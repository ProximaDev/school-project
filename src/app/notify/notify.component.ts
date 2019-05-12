import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { NotifyService } from '../services/notify/notify.service'
import { Notify } from '../services/notify/notify.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {
  notifyList: Notify[];
  isEdit: boolean;



  constructor(private service: NotifyService,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.resetForm();

    this.service.getHomework().subscribe(actionArray => {
      this.notifyList = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Notify;
      })
    });
  }
  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      subject:'',
      content:''
    }
  }
  saveFormData(form: NgForm) {
    let data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id == null)
      this.firestore.collection('Notifys').add(data);
    else
      this.firestore.doc('Notifys/' + form.value.id).update(data);
    this.resetForm(form);
    this.toastr.success('تمت الاضافة بنجاح', 'اضافة');
  }
  onEdit(stu: Notify) {
    this.service.formData = Object.assign({}, stu);
  }

  onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestore.doc('Notifys/' + id).delete();
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  test() {
    console.log("work");
  }
}
