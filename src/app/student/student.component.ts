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
  oldEmail: string;
  oldPassword: string;

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
    this.studentList = this.firestoreService.getFirestoreData('studentList');
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
    this.student.tag = this.student.stage + '_' + this.student.division;
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('studentList', this.student.email, this.student);
      if (this.student.email != this.oldEmail || this.student.password != this.oldPassword) {
        this.firestoreService.updateStuEmailPassword(this.oldEmail, this.oldPassword, this.student.email, this.student.password);
      }
    } else {
      this.firestoreService.addFirestoreData('studentList', this.student, "email");
      this.firestoreService.setStuEmailPassword(this.student.email, this.student.password);
    }
    this.firestoreService.addRealTimeData('studentList', `${this.student.stage}/${this.student.division}/${this.student.fullName}`, this.student);
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onEdit(stu: Student) {
    this.student = stu;
    this.isEdit = true;
    this.btnTXT = "تحديث";
    this.oldEmail = stu.email;
    this.oldPassword = stu.password;
  }

  onDelete(stu: Student) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('studentList', stu.email);
        this.firestoreService.deleteRealTimeData('studentList', `${stu.stage}/${stu.division}/${stu.fullName}`);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }
  filterExact(stage: string, division: string) {
    const value = stage + '_' + division;
    this.studentList = this.firestoreService.getFirestoreData('studentList', 'tag', value);
    this.studentList.subscribe(data => {
      this.studentData = data;
    });
  }
}
