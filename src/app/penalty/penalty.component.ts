import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Penalty } from '../services/models/penalty.model';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-penalty',
  templateUrl: './penalty.component.html',
  styleUrls: ['./penalty.component.scss']
})
export class PenaltyComponent implements OnInit {

  CourseList: Observable<any[]>;
  CourseData: any;
  PenaltyList: Observable<any[]>;
  PenaltyData: any;
  Pay1List: Observable<any[]>;
  Pay1Data: any;
  StudentList: Observable<any[]>;
  StudentData: any;
  isEdit: boolean = false;
  btnTXT = 'اضافة'
  paid:number=0;
  
  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private penalty: Penalty) { }
  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.PenaltyList = this.firestoreService.getFirestoreData('penaltyList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.PenaltyList.subscribe(data => {
      this.PenaltyData = data;
    });
  }

  stageSelect() {
    this.CourseList = this.firestoreService.getRealTimeData('courseList', this.penalty.stage);
    this.CourseList.subscribe(data => {
      this.CourseData = data;
    });
  }

  divSelect() {
    this.StudentList = this.firestoreService.getRealTimeData('studentList', `${this.penalty.stage}/${this.penalty.division}`);
    this.StudentList.subscribe(data => {
      this.StudentData = data;
    });
  }


  saveFormData(form: NgForm) {   
    var datePipe = new DatePipe('en-US');
    this.penalty.date = datePipe.transform(new Date(this.penalty.date), 'dd/MM/yyyy');
    this.penalty.tag = this.penalty.stage + '_' + this.penalty.division;
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('penaltyList', this.penalty.id, this.penalty);
    } else {
      this.firestoreService.addFirestoreData('penaltyList', this.penalty, "");
      this.paid =parseInt(this.Pay1Data[0]['total_amount']);
      this.paid+=parseInt(this.penalty.penalty_amount);
      this.firestoreService.updatepen(this.penalty.name,this.paid.toString());
     
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

getpayinfo(){
  this.Pay1List = this.firestoreService.getFirestoreData('paymentList', 'name',this.penalty.name);
  this.Pay1List.subscribe(data => {
    this.Pay1Data = data;
  });
    
}
  onDelete(penalty: Penalty) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('penaltyList', penalty.id);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }
  filterExact(stage: string, division: string) {
    const value = stage + '_' + division;
    this.PenaltyList = this.firestoreService.getFirestoreData('penaltyList', 'tag', value);
    this.PenaltyList.subscribe(data => {
      this.PenaltyData = data;
    });
  }

}
