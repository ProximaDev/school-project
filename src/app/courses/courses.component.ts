import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Course } from '../services/courses/course.model'
import { CourseService } from '../services/courses/course.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

 courseList: Course[];
  isEdit: boolean;


  constructor(private service: CourseService,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private datePipe: DatePipe,
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
    let data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id == null)
      this.firestore.collection('Courses').add(data);
    else
      this.firestore.doc('Courses/' + form.value.id).update(data);
    this.resetForm(form);
    this.toastr.success('تمت الاضافة بنجاح', 'اضافة');
  }
  onEdit(stu: Course) {
    this.service.formData = Object.assign({}, stu);
  }

  onDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestore.doc('Courses/' + id).delete();
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  test() {
    console.log("work");
  }


}
