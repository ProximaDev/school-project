import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      const user = this.afAuth.auth.onAuthStateChanged((loggedin) => {
        if (loggedin) {
          resolve(loggedin);
        } else {
          reject('No user logged in');
        }
      });
    });
  }
  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }
}
