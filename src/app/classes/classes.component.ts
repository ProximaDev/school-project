import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Class } from '../services/classes/class.model'
import { ClassService } from '../services/classes/class.service';
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {

  stage: any;
  classList: Class[];
  isEdit: boolean;
  btnTXT = 'اضافة'

  constructor(private service: ClassService,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.resetForm();
    this.service.getCourse().subscribe(actionArray => {
      this.classList = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Class;
      })
    });
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      stage: '',
      class1: '',
     class2: '',
      class3: '',
      class4: '',
      class5: '',
      class6: '',
      }
  }
  saveFormData(form: NgForm) {
    this.btnTXT = 'اضافة';
    let data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id == null)
      this.firestore.doc(`Classes/${data.stage}`).set(data);
    else {
      this.firestore.doc('Classes/' + form.value.stage).update(data);
      this.btnTXT = 'تعديل';
    }
    this.resetForm(form);
    this.toastr.success('تمت العملية بنجاح', 'العملية');
  }

  onEdit(stu: Class) {
    this.service.formData = Object.assign({}, stu);
    this.stage = stu.stage;
    this.btnTXT = "تحديث";
  }

  onDelete(stage: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestore.doc('Classes/' + stage).delete();
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }
}
