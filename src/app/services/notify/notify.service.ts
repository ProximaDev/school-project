import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Notify } from './notify.model'

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  formData: Notify;

  constructor(private firestore: AngularFirestore) { }

  getHomework() {
    return this.firestore.collection('Notify').snapshotChanges();
  }
}
