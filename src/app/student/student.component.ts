import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../services/students/student.service'
import { Student } from '../services/students/student.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  studentList: Student[];
  isEdit: boolean;

  constructor(private service: StudentService,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.resetForm();

    this.service.getStudent().subscribe(actionArray => {
      this.studentList = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Student;
      })
    });
  }
  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      fullName: '',
      gender: '',
      birthdate: '',
      address: '',
      mobile: '',
      email: '',
      password: ''
    }
  }

  saveFormData(form: NgForm) {
    let data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id == null)
      this.firestore.collection('Students').add(data);
    else
      this.firestore.doc('Students/' + form.value.id).update(data);
    this.resetForm(form);
    this.toastr.success('تمت الاضافة بنجاح', 'اضافة');
  }

  onEdit(stu: Student) {
    this.service.formData = Object.assign({}, stu);
  }

  onDelete(id: string) {
    if (confirm("هل انت متاكد من الحذف؟ لا يمكن التراجع")) {
      this.firestore.doc('Students/' + id).delete();
      this.toastr.warning('تم الحذف بنجاح', 'حذف');
    }
  }

  test() {
    console.log("work");
  }
}
