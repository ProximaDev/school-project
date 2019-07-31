import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Trans } from '../services/models/trans.model';
import { NgForm } from '@angular/forms';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-trans',
  templateUrl: './trans.component.html',
  styleUrls: ['./trans.component.scss']
})
export class TransComponent implements OnInit, AfterViewInit {

  TransList: Observable<any[]>;
  TransData: any;
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
    private trans: Trans) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.TransList = this.firestoreService.getFirestoreData('transList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.TransList.subscribe(data => {
      this.TransData = data;
    });
  }

  divSelect() {
    this.StudentList = this.firestoreService.getRealTimeData('studentList', `${this.trans.stage}/${this.trans.division}`);
    this.StudentList.subscribe(data => {
      this.StudentData = data;
    });
  }

  saveFormData(form: NgForm) {
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('transList', this.trans.id, this.trans);
    } else {
      this.firestoreService.addFirestoreData('transList', this.trans, "");
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onDelete(trans: Trans) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('transList', trans.id);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  onEdit(tran: Trans) {
    this.trans = tran;
    this.isEdit = true;
    this.btnTXT = "تحديث";
    this.divSelect();
  }

  filterExact(sname: string) {
    this.TransList = this.firestoreService.getFirestoreData('transList', 'name', sname);
    this.TransList.subscribe(data => {
      this.TransData = data;
    });
  }
}
