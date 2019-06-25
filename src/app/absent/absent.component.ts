import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/firestore';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-absent',
  templateUrl: './absent.component.html',
  styleUrls: ['./absent.component.scss']
})
export class AbsentComponent implements OnInit, AfterViewInit {

  name: any;
  selection: any;
  stage: any;
  subject: any;
  adate: any;

  course1: any;
  course2: any;
  course3: any;
  course4: any;
  course5: any;
  course6: any;
  course7: any;
  course8: any;
  course9: any;
  course10: any;

  stuList: Observable<any[]>;
  stuData: any;

  SubList: any;
  SubData: any

  subArray = [];

  absent: Observable<any[]>;
  absentData: any;

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private firestore: AngularFirestore) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    } else {
      this.stuList = this.firestoreService.getStudents();
      this.absent = this.firestoreService.getAbsent();
    }
  }

  ngAfterViewInit() {
    this.stuList.subscribe(data => {
      this.stuData = data;
      this.spinnerService.hide();
    });
    this.absent.subscribe(data => {
      this.absentData = data;
    });
  }

  stageSelect() {
    this.subArray = [];
    this.SubList = this.firestoreService.getCourse(this.stage);
    this.SubList.subscribe(data => {
      if (data.length != 0 && data != undefined && data != null) {
        this.SubData = data;
        this.subArray.push(this.SubData.course1);
        this.subArray.push(this.SubData.course2);
        this.subArray.push(this.SubData.course3);
        this.subArray.push(this.SubData.course4);
        this.subArray.push(this.SubData.course5);
        this.subArray.push(this.SubData.course6);
        this.subArray.push(this.SubData.course7);
        this.subArray.push(this.SubData.course8);
        this.subArray.push(this.SubData.course9);
        this.subArray.push(this.SubData.course10);
      }

    });
  }

  //onEdit(id, name, selection, stage, subject, adate) {}

  onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestore.doc('Absents/' + id).delete();
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  addAbsent() {
    this.firestoreService.addAbsent(this.name, this.selection, this.stage, this.subject, this.adate);
  }
}
