import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Expenses } from '../services/models/expenses.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { FirebaseService } from '../services/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Observable } from 'rxjs';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {

  expenseList: Observable<any[]>;
  expenseData: any;
  isEdit: boolean = false;
  btnTXT = 'اضافة'

  constructor(private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog,
    private expense: Expenses) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.expenseList = this.firestoreService.getFirestoreData('expenseList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.expenseList.subscribe(data => {
      this.expenseData = data;
    });
  }



  saveFormData(form: NgForm) {
    var datePipe = new DatePipe('en-US');
    this.expense.date = datePipe.transform(new Date(this.expense.date), 'dd/MM/yyyy');
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('expenseList', this.expense.id, this.expense);
    } else {
      this.firestoreService.addFirestoreData('expenseList', this.expense, "");
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onEdit(expense: Expenses) {
    this.expense = expense;
    this.isEdit = true;
    this.btnTXT = "تحديث";
  }

  onDelete(expense: Expenses): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('expenseList', expense.id);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }


}
