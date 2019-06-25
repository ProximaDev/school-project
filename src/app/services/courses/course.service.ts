import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {  Course} from './course.model'

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  formData: Course;

  constructor(private firestore: AngularFirestore) { }

  getCourse() {
    return this.firestore.collection('Courses').snapshotChanges();
  }
}
