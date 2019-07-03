import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Class } from './class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  formData: Class;

  constructor(private firestore: AngularFirestore) { }

  getCourse() {
    return this.firestore.collection('Classes').snapshotChanges();
  }
}
