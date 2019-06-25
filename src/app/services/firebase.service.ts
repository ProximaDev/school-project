import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { formatDate } from '@angular/common';
import * as firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }


  addAbsent(name, selection, stage, subject, adate) {
    const id = this.firestore.createId();
    this.firestore.doc(`Absents/${id}`).set({
      id,
      name,
      selection,
      stage,
      subject,
      adate
    });
  }

  updateAbsent(id, name, selection, stage, subject, adate) {
    this.firestore.doc(`Absents/${id}`).set({
      id,
      name,
      selection,
      stage,
      subject,
      adate
    });
  }
  getAbsent() {
    return this.firestore.collection('Absents').valueChanges();
  }


  addVideos(title, link) {
    const id = this.firestore.createId();
    this.firestore.doc(`videosList/${id}`).set({
      id,
      title,
      link,
    });
  }

  updateVideos(id, title, link) {
    this.firestore.doc(`videosList/${id}`).set({
      id,
      title,
      link,
    });
  }
  getVideos() {
    return this.firestore.collection('videosList').valueChanges();
  }

  deleteVideos(id) {
    this.firestore.doc(`videosList/${id}`).delete();
  }

  addweekly(stage, selection, image, imgname) {
    let filter = stage + "_" + selection;
    const id = this.firestore.createId();
    this.firestore.doc(`weeklyList/${id}`).set({
      id,
      stage,
      selection,
      image,
      imgname,
      filter
    });
  }

  getWeekly() {
    return this.firestore.collection('weeklyList').valueChanges();
  }

  deleteWeekly(id, imgid) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`weekly/${imgid}`).delete();
    this.firestore.doc(`weeklyList/${id}`).delete();
  }

  getStudents() {
    return this.firestore.collection('Students').valueChanges();
  }

  getCourse(stage: string) {
    return this.firestore.doc(`Courses/${stage}`).valueChanges();
  }

  async login(email, password) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
}
