import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Student } from './student.model'

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  formData: Student;

  constructor(private firestore: AngularFirestore) { }

  getStudent() {
    return this.firestore.collection('Students').snapshotChanges();
  }
}
