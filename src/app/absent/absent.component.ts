import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Absent } from '../services/models/absent.model';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-absent',
  templateUrl: './absent.component.html',
  styleUrls: ['./absent.component.scss']
})
export class AbsentComponent implements OnInit, AfterViewInit {

  CourseList: Observable<any[]>;
  CourseData: any;
  AbsentList: Observable<any[]>;
  AbsentData: any;
  StudentList: Observable<any[]>;
  StudentData: any;
  isEdit: boolean = false;
  btnTXT = 'اضافة'

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private absent: Absent) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.AbsentList = this.firestoreService.getFirestoreData('absentList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.AbsentList.subscribe(data => {
      this.AbsentData = data;
    });
  }

  stageSelect() {
    this.CourseList = this.firestoreService.getRealTimeData('courseList', this.absent.stage);
    this.CourseList.subscribe(data => {
      this.CourseData = data;
    });
  }

  divSelect() {
    this.StudentList = this.firestoreService.getRealTimeData('studentList', `${this.absent.stage}/${this.absent.division}`);
    this.StudentList.subscribe(data => {
      this.StudentData = data;
    });
  }

  saveFormData(form: NgForm) {
    var datePipe = new DatePipe('en-US');
    this.absent.date = datePipe.transform(new Date(this.absent.date), 'dd/MM/yyyy');
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('absentList', this.absent.id, this.absent);
    } else {
      this.firestoreService.addFirestoreData('absentList', this.absent, false);
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onDelete(absent: Absent) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('absentList', absent.id);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }
}
