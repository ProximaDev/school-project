import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from '../services/firebase.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from "@angular/material";
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Course } from 'app/services/models/course.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, AfterViewInit {

  CourseList: Observable<any[]>;
  CourseData: any;
  btnTXT = 'اضافة'

  constructor(private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private course: Course) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.CourseList = this.firestoreService.getRealTimeDataCol('courseList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.CourseList.subscribe(data => {
      this.CourseData = data;
    });
  }

  saveFormData(form: NgForm) {
    this.firestoreService.addRealTimeData('courseList', `${this.course.stage}`, this.course);
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onEdit(cou: Course) {
    this.course = cou;
    this.btnTXT = "تحديث";
  }

  onDelete(cou: Course) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteRealTimeData('courseList', cou.stage);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }
}
