import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Exam } from '../services/models/exam.model';
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
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  CourseList: Observable<any[]>;
  CourseData: any;
  examList: Observable<any[]>;
  examData: any;
  isEdit: boolean = false;
  btnTXT = 'اضافة'

  constructor(private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog,
    private exam: Exam) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.examList = this.firestoreService.getFirestoreData('examList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.examList.subscribe(data => {
      this.examData = data;
    });
  }

  stageSelect() {
    this.CourseList = this.firestoreService.getRealTimeData('courseList', this.exam.stage);
    this.CourseList.subscribe(data => {
      this.CourseData = data;
    });
  }

  saveFormData(form: NgForm) {
    var datePipe = new DatePipe('en-US');
    this.exam.date = datePipe.transform(new Date(this.exam.date), 'dd/MM/yyyy');
    this.exam.tag = this.exam.stage + '_' + this.exam.division;
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('examList', this.exam.id, this.exam);
    } else {
      this.firestoreService.addFirestoreData('examList', this.exam, "");
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onEdit(exam: Exam) {
    this.exam = exam;
    this.isEdit = true;
    this.btnTXT = "تحديث";
  }

  onDelete(exam: Exam): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('examList', exam.id);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  filterExact(stage: string, division: string) {
    const value = stage + '_' + division;
    this.examList = this.firestoreService.getFirestoreData('examList', 'tag', value);
    this.examList.subscribe(data => {
      this.examData = data;
    });
  }

}
