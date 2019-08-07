import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Attitude } from '../services/models/attitude.model';
import { NgForm } from '@angular/forms';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-attitude',
  templateUrl: './attitude.component.html',
  styleUrls: ['./attitude.component.scss']
})
export class AttitudeComponent implements OnInit {

  AttitudeList: Observable<any[]>;
  AttitudeData: any;
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
    private attitude: Attitude) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.AttitudeList = this.firestoreService.getFirestoreData('attitudeList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.AttitudeList.subscribe(data => {
      this.AttitudeData = data;
    });
  }

  divSelect() {
    this.StudentList = this.firestoreService.getRealTimeData('studentList', `${this.attitude.stage}/${this.attitude.division}`);
    this.StudentList.subscribe(data => {
      this.StudentData = data;
    });
  }

  saveFormData(form: NgForm) {
    this.attitude.tag = this.attitude.stage + '_' + this.attitude.division;
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('attitudeList', this.attitude.id, this.attitude);
    } else {
      this.firestoreService.addFirestoreData('attitudeList', this.attitude, "");
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onDelete(attitude: Attitude) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('attitudeList', attitude.id);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  filterExact(stage: string, division: string) {
    const value = stage + '_' + division;
    this.AttitudeList = this.firestoreService.getFirestoreData('attitudeList', 'tag', value);
    this.AttitudeList.subscribe(data => {
      this.AttitudeData = data;
    });
  }

}
