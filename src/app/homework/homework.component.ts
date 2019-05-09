import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { HomeworkService } from '../services/homework/homework.service'
import { Homework } from '../services/homework/homework.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'


@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss']
})
export class HomeworkComponent implements OnInit {

  homeworkList: Homework[];
  isEdit: boolean;

  constructor(private service: HomeworkService,
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

  test() {
    console.log("work");
  }
}
