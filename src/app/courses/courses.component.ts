import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Course } from '../services/courses/course.model'
import { CourseService } from '../services/courses/course.service';
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  stage: any;
  courseList: Course[];
  isEdit: boolean;
  btnTXT = 'اضافة'

  constructor(private service: CourseService,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.resetForm();
    this.service.getCourse().subscribe(actionArray => {
      this.courseList = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Course;
      })
    });
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      stage: '',
      course1: '',
      course2: '',
      course3: '',
      course4: '',
      course5: '',
      course6: '',
      course7: '',
      course8: '',
      course9: '',
      course10: '',
    }
  }
  saveFormData(form: NgForm) {
    this.btnTXT = 'اضافة';
    let data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id == null)
      this.firestore.doc(`Courses/${data.stage}`).set(data);
    else {
      this.firestore.doc('Courses/' + form.value.stage).update(data);
    }
    this.resetForm(form);
    this.toastr.success('تمت العملية بنجاح', 'العملية');
  }

  onEdit(stu: Course) {
    this.service.formData = Object.assign({}, stu);
    this.stage = stu.stage;
    this.btnTXT = "تحديث";
  }

  onDelete(stage: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestore.doc('Courses/' + stage).delete();
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }
}
