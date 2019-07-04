import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { formatDate } from '@angular/common';
import * as firebase from 'firebase/app'
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFireDatabase, private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  getFirestoreData(colName: string) {
    return this.firestore.collection(colName).valueChanges();
  }

  addFirestoreData(colName: string, dataObject: any, emailAsId: boolean) {
    let id = '';
    if (emailAsId) {
      id = dataObject.email
    } else {
      id = this.firestore.createId();
      dataObject.id = id;
    }
    this.firestore.doc(`${colName}/${id}`).set(Object.assign({}, dataObject));
  }

  updateFirestoreData(colName: string, id: string, dataObject: any) {
    this.firestore.doc(`${colName}/${id}`).set(dataObject);
  }

  deleteFirestoreData(colName: string, id: string) {
    this.firestore.doc(`${colName}/${id}`).delete();
  }

  deleteStorageFile(folder: string, filename: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${folder}/${filename}`).delete();
  }

  addRealTimeData(colName: string, path: string, dataObject: any) {
    this.db.list(`${colName}/`).set(`${path}`, Object.assign({}, dataObject));
  }

  deleteRealTimeData(colName: string, path: string) {
    this.db.list(`${colName}/`).remove(`${path}`);
  }

  getRealTimeData(colName: string, path: string) {
    return this.db.list(`${colName}/${path}`).valueChanges();
  }

  addEvent(title, content) {
    let today = new Date();
    let date = formatDate(today, 'medium', 'en-US');
    const id = this.firestore.createId();
    this.firestore.doc(`eventList/${id}`).set({
      id,
      title,
      content,
      date
    });
  }

  getEvents() {
    return this.firestore.collection('eventList').valueChanges();
  }

  deleteEvent(id) {
    this.firestore.doc(`eventList/${id}`).delete();
  }

  addDegree(name, selection, stage, subject, type, degrees) {
    const id = this.firestore.createId();
    this.firestore.doc(`Degree/${id}`).set({
      id,
      name,
      selection,
      stage,
      subject,
      type,
      degrees,
    });
  }

  updateDegree(id, name, selection, stage, subject, type, degrees) {
    this.firestore.doc(`Degree/${id}`).set({
      id,
      name,
      selection,
      stage,
      subject,
      type,
      degrees,
    });
  }
  getDegree() {
    return this.firestore.collection('Degree').valueChanges();
  }


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

  getClass(stage: string) {
    return this.firestore.doc(`Classes/${stage}`).valueChanges();
  }

  async login(email, password) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
}
