import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery'
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-all-notify',
  templateUrl: './all-notify.component.html',
  styleUrls: ['./all-notify.component.scss']
})
export class AllNotifyComponent implements OnInit, AfterViewInit {

  notifyList: Observable<any[]>;
  notifyData: any;

  constructor(private firestoreService: FirebaseService,
    private router: Router, private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  openDialog(item): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true')
        this.deleteEvent(item);
    });
  }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    } else {
      this.notifyList = this.firestoreService.getFirestoreData('notifyList');
    }
  }

  ngAfterViewInit() {
    this.notifyList.subscribe(data => {
      if (data.length == 0) {
        $('#no-items-ava').show();
        $('#SHOW').hide();
      }
      else {
        $('#no-items-ava').hide();
        $('#SHOW').show();
      }
      this.notifyData = data;
      this.spinnerService.hide();
    });
  }

  deleteEvent(item) {
    this.firestoreService.deleteFirestoreData('notifyList', item.id);
    this.toastr.success('تم الحذف', 'تم حذف الحدث بنجاح');
  }
}

