import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { NgxSpinnerService } from 'ngx-spinner';
const STORAGE_KEY = 'local_user';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  i=0;

  PenaltyList: Observable<any[]>;
  PenaltyData: any;
  PaymentList: Observable<any[]>;
  PaymentData: any;
  studentList: Observable<any[]>;
  studentData: any;
  staffList: Observable<any[]>;
  staffData: any;
  holidayList: Observable<any[]>;
  holidayData: any;
  expenseList: Observable<any[]>;
  expenseData: any;

  paymentcol=0;
  payamount=0;
  studentnumber=0;
  penaltynumber=0;
  penaltycol=0;
  staffnumber=0;
  holidaynumber=0;
  staffsalary=0;
  expensecol=0;

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    ) { }
  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.PaymentList = this.firestoreService.getFirestoreData('paymentList');
    this.studentList = this.firestoreService.getFirestoreData('studentList');
    this.PenaltyList = this.firestoreService.getFirestoreData('penaltyList');
    this.staffList = this.firestoreService.getFirestoreData('stafflist');
    this.holidayList = this.firestoreService.getFirestoreData('holidayList');
    this.expenseList = this.firestoreService.getFirestoreData('expenseList');


    
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.PaymentList.subscribe(data => {
      this.PaymentData = data;
    });
    this.studentList.subscribe(data => {
      this.studentData = data;
    });

    this.PenaltyList.subscribe(data => {
      this.PenaltyData = data;
    });

    this.staffList.subscribe(data => {
      this.staffData = data;
    });

    this.holidayList.subscribe(data => {
      this.holidayData = data;
    });

    this.expenseList.subscribe(data => {
      this.expenseData = data;
    });
   
  }



statistics(){
  while(this.PaymentData[this.i] != null){
    this.paymentcol+= parseInt(this.PaymentData[this.i]['total_amount']);
    this.payamount+= parseInt(this.PaymentData[this.i]['amount_paid']);
    this.i+=1;
    }

  this.i=0;

  while(this.studentData[this.i] != null){
    this.studentnumber+=1;
    this.i+=1;
    } 

    this.i=0;

  while(this.PenaltyData[this.i] != null){
    this.penaltynumber+=1;
    this.penaltycol+= parseInt(this.PenaltyData[this.i]['penalty_amount']);
    this.i+=1;
    } 

    this.i=0;

  while(this.staffData[this.i] != null){
    this.staffnumber+=1;
    this.i+=1;
    } 

    this.i=0;

    while(this.staffData[this.i] != null){
      this.staffsalary+=parseInt(this.staffData[this.i]['salary']);
      this.i+=1;
      } 

    this.i=0;

    while(this.holidayData[this.i] != null){
      this.holidaynumber+=1;
      this.i+=1;
      } 

      this.i=0;

      while(this.expenseData[this.i] != null){
        this.expensecol+=parseInt(this.expenseData[this.i]['amount']);
        this.i+=1;
        } 
  
        this.i=0;

}



}
