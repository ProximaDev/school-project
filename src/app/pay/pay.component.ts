import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Pay } from '../services/models/pay.model';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

const STORAGE_KEY = 'local_user';


@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  
  CourseList: Observable<any[]>;
  CourseData: any;
  PayList: Observable<any[]>;
  PayData: any;
  StudentList: Observable<any[]>;
  StudentData: any;
  isEdit: boolean = false;
  btnTXT = 'اضافة'
  st:string;
  div:string;

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private pay: Pay) { }
  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.PayList = this.firestoreService.getFirestoreData('payList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.PayList.subscribe(data => {
      this.PayData = data;
    });
  }

  stageSelect() {
    this.CourseList = this.firestoreService.getRealTimeData('courseList', this.pay.stage);
    this.CourseList.subscribe(data => {
      this.CourseData = data;
    });
  }

  divSelect() {
    this.StudentList = this.firestoreService.getRealTimeData('studentList', `${this.pay.stage}/${this.pay.division}`);
    this.StudentList.subscribe(data => {
      this.StudentData = data;
    });
  }


  saveFormData(form: NgForm) {
    var datePipe = new DatePipe('en-US');
    this.pay.date = datePipe.transform(new Date(this.pay.date), 'dd/MM/yyyy');
    this.pay.tag = this.pay.stage + '_' + this.pay.division;
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('payList', this.pay.id, this.pay);
    } else {
      this.firestoreService.addFirestoreData('payList', this.pay, false);
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onDelete(pay: Pay) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('payList', pay.id);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }
  filterExact(stage: string, division: string) {
    const value = stage + '_' + division;
    this.PayList = this.firestoreService.getFirestoreData('payList', 'tag', value);
    this.PayList.subscribe(data => {
      this.PayData = data;
    });
  }

}
