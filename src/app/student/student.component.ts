import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../services/students/student.service'
import { Student } from '../services/students/student.model';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from "@angular/material";
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router } from '@angular/router';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, AfterViewInit {

  studentList: Student[];
  isEdit: boolean;
  btnTXT = 'اضافة'

  constructor(public service: StudentService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.spinnerService.show();
    this.resetForm();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    } else {
      this.service.getStudent().subscribe(actionArray => {
        this.studentList = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as Student;
        })
      });
    }
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      fullName: '',
      gender: '',
      stage: '',
      selection: '',
      birthdate: '',
      address: '',
      mobile: '',
      email: '',
      password: ''
    }
  }

  saveFormData(form: NgForm) {
    this.btnTXT = 'اضافة';
    let data = Object.assign({}, form.value);
    let email = data.email;
    if (form.value.id == null) {
      this.firestore.doc(`Students/${email}`).set(data);
      this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password);
    }
    else {
      this.firestore.doc('Students/' + form.value.email).update(data);
    }

    this.resetForm(form);
    this.toastr.success('تمت العملية بنجاح', 'العملية');
  }

  onEdit(stu: Student) {
    this.service.formData = Object.assign({}, stu);
    this.btnTXT = "تحديث";
  }

  onDelete(email: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestore.doc('Students/' + email).delete();
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }
}
