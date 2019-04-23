import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { formatDate } from '@angular/common';
import * as firebase from 'firebase/app'


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}
  
    getStudents() {
    return this.firestore.collection('Students').snapshotChanges();
  }

  async login(email , password) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email , password);
  }
}
