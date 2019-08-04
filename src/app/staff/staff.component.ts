import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Staff } from '../services/models/staff.model';
import { FirebaseService } from '../services/firebase.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from "@angular/material";
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  staffList: Observable<any[]>;
  staffData: any;
  isEdit: boolean = false;
  btnTXT = 'اضافة'
  

  constructor(private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router,
    private staff: Staff) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.staffList = this.firestoreService.getFirestoreData('stafflist');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.staffList.subscribe(data => {
      this.staffData = data;
    });
  }

  saveFormData(form: NgForm) {
    var datePipe = new DatePipe('en-US');
    this.staff.join_date = datePipe.transform(new Date(this.staff.join_date), 'dd/MM/yyyy');
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('stafflist', this.staff.email, this.staff);
    } else {
      this.firestoreService.addFirestoreData('stafflist', this.staff, "email");
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onEdit(staff: Staff) {
    this.staff = staff;
    this.isEdit = true;
    this.btnTXT = "تحديث";
  }
  onDelete(staff: Staff): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('stafflist', staff.email);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }
  


}
