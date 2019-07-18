import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Payment } from '../services/models/payment.model';
import { NgForm } from '@angular/forms';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  CourseList: Observable<any[]>;
  CourseData: any;
  PaymentList: Observable<any[]>;
  PaymentData: any;
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
    private payment: Payment) { }
  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.PaymentList = this.firestoreService.getFirestoreData('paymentList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.PaymentList.subscribe(data => {
      this.PaymentData = data;
    });
  }

  stageSelect() {
    this.CourseList = this.firestoreService.getRealTimeData('courseList', this.payment.stage);
    this.CourseList.subscribe(data => {
      this.CourseData = data;
    });
  }

  divSelect() {
    this.StudentList = this.firestoreService.getRealTimeData('studentList', `${this.payment.stage}/${this.payment.division}`);
    this.StudentList.subscribe(data => {
      this.StudentData = data;
    });
  }

  saveFormData(form: NgForm) {
    this.payment.tag = this.payment.stage + '_' + this.payment.division;
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('paymentList', this.payment.id, this.payment);
    } else {
      this.firestoreService.addFirestoreData('paymentList', this.payment, false);
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onDelete(payment: Payment) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('paymentList', payment.id);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }


}
