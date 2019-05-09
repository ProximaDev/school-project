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
    return this.firestore.collection('Students').snapshotChanges();
  }

  async login(email, password) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
}
