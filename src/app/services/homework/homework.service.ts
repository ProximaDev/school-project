import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Homework } from './homework.model'

@Injectable({
  providedIn: 'root'
})
export class HomeworkService {
  formData: Homework;

  constructor(private firestore: AngularFirestore) { }

  getHomework() {
    return this.firestore.collection('Homeworks').snapshotChanges();
  }
}
