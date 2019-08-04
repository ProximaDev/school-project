import { Component, OnInit, Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { PublicHolidays } from '../services/models/public-holidays.model';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent implements OnInit {

  holidayList: Observable<any[]>;
  holidayData: any;
  isEdit: boolean = false;
  btnTXT = 'اضافة'

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private holiday: PublicHolidays) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.holidayList = this.firestoreService.getFirestoreData('holidayList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.holidayList.subscribe(data => {
      this.holidayData = data;
    });
  }

  

  saveFormData(form: NgForm) {
    var datePipe = new DatePipe('en-US');
    this.holiday.date = datePipe.transform(new Date(this.holiday.date), 'dd/MM/yyyy');
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('holidayList', this.holiday.id, this.holiday);
    } else {
      this.firestoreService.addFirestoreData('holidayList', this.holiday, "");
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onDelete(holiday: PublicHolidays) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('holidayList', holiday.id);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  
  
}
