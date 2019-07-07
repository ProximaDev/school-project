import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
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

  getRealTimeDataCol(colName: string) {
    return this.db.list(`${colName}`).valueChanges();
  }

  async login(email: string, password: string) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
}
