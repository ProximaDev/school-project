import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Student } from '../services/models/student.model';
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
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, AfterViewInit {

  studentList: Observable<any[]>;
  studentData: any;
  isEdit: boolean = false;
  btnTXT = 'اضافة'

  constructor(private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router,
    private student: Student) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.studentList = this.firestoreService.getFirestoreData('Students');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.studentList.subscribe(data => {
      this.studentData = data;
    });
  }

  saveFormData(form: NgForm) {
    var datePipe = new DatePipe('en-US');
    this.student.birthdate = datePipe.transform(new Date(this.student.birthdate), 'dd/MM/yyyy');
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('Students', this.student.email, this.student);
    } else {
      this.firestoreService.addFirestoreData('Students', this.student, true);
    }
    this.firestoreService.addRealTimeData('Students', `${this.student.stage}/${this.student.selection}/${this.student.fullName}`, this.student);
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onEdit(stu: Student) {
    this.student = stu;
    this.isEdit = true;
    this.btnTXT = "تحديث";
  }

  onDelete(stu: Student): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('Students', stu.email);
        this.firestoreService.deleteRealTimeData('Students', `${stu.stage}/${stu.selection}/${stu.fullName}`);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }
}
