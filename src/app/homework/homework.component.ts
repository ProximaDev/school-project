import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { HomeworkService } from '../services/homework/homework.service'
import { Homework } from '../services/homework/homework.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss']
})
export class HomeworkComponent implements OnInit {
  homeworkList: Homework[];
  isEdit: boolean;
  stage:any;
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

  SubList: any;
  SubData: any

  subArray = [];

  constructor(private firestoreService: FirebaseService,
    private service: HomeworkService,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private dialog: MatDialog) { }

  ngOnInit() {
      this.resetForm();


     

    this.service.getHomework().subscribe(actionArray => {
      this.homeworkList = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Homework;
      })
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

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      stage: '',
      Division: '',
      course: '',
      Subject: '',
      description: '',
      date: '',
    }
  }
  
  
  saveFormData(form: NgForm) {
    let data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id == null)
      this.firestore.collection('Homeworks').add(data);
    else
      this.firestore.doc('Homeworks/' + form.value.id).update(data);
    this.resetForm(form);
    this.toastr.success('تمت الاضافة بنجاح', 'اضافة');
  }
  onEdit(stu: Homework) {
    this.service.formData = Object.assign({}, stu);
  }

  onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestore.doc('Homeworks/' + id).delete();
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  
}
