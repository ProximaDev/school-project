import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Degrees } from '../services/models/degree.model';
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { FirebaseService } from '../services/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Observable } from 'rxjs';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.scss']
})
export class DegreeComponent implements OnInit, AfterViewInit {

  CourseList: Observable<any[]>;
  CourseData: any;
  DegreeList: Observable<any[]>;
  DegreeData: any;
  StudentList: Observable<any[]>;
  StudentData: any;
  isEdit: boolean = false;
  btnTXT = 'اضافة'

  constructor(private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog,
    private degree: Degrees) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.DegreeList = this.firestoreService.getFirestoreData('degreeList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.DegreeList.subscribe(data => {
      this.DegreeData = data;
    });
  }

  stageSelect() {
    this.CourseList = this.firestoreService.getRealTimeData('courseList', this.degree.stage);
    this.CourseList.subscribe(data => {
      this.CourseData = data;
    });
  }

  divSelect() {
    this.StudentList = this.firestoreService.getRealTimeData('studentList', `${this.degree.stage}/${this.degree.division}`);
    this.StudentList.subscribe(data => {
      this.StudentData = data;
    });
  }

  saveFormData(form: NgForm) {
    this.degree.tag = this.degree.stage + '_' + this.degree.division;
    if (this.isEdit) {
      this.firestoreService.updateFirestoreData('degreeList', this.degree.id, this.degree);
    } else {
      this.firestoreService.addFirestoreData('degreeList', this.degree, "");
    }
    this.isEdit = false;
    this.btnTXT = 'اضافة';
    form.resetForm();
  }

  onDelete(degree: Degrees) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteFirestoreData('degreeList', degree.id);
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  filterExact(stage: string, division: string) {
    const value = stage + '_' + division;
    this.DegreeList = this.firestoreService.getFirestoreData('degreeList', 'tag', value);
    this.DegreeList.subscribe(data => {
      this.DegreeData = data;
    });
  }
}
