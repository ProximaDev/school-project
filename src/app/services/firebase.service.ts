import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app'
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFireDatabase, private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  getFirestoreData(colName: string, property?: string, value?: string) {
    if (value == null || property == null) {
      return this.firestore.collection(colName).valueChanges();
    }
    else {
      return this.firestore.collection(colName, ref => {
        let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        query = query.where(property, '==', value);
        return query;
      }).valueChanges();
    }
  }

  addFirestoreData(colName: string, dataObject: any, Id: string) {
    let id = '';
    if (Id=="email") {
      id = dataObject.email
    }else if (Id=="name") {
      id = dataObject.name
    }
    else {
      id = this.firestore.createId();
      dataObject.id = id;
    }
    this.firestore.doc(`${colName}/${id}`).set(Object.assign({}, dataObject));
  }

  updateFirestoreData(colName: string, id: string, dataObject: any) {
    this.firestore.doc(`${colName}/${id}`).set(dataObject);
  }
  updatepay( id: string, amount: any){
    this.firestore.doc(`paymentList/${id}`).update({amount_paid:amount});
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
  async setStuEmailPassword(email: string, password: string) {
    await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  async updateStuEmailPassword(email: string, password: string, newEmail: string, newPassword: string) {
    await this.afAuth.auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      userCredential.user.updateEmail(newEmail)
      userCredential.user.updatePassword(newPassword)
    });
  }
}
