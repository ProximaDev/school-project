import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  allmessages = [];
  allkeys = [];
  summaries = [];
  list = [];
  newmessage;
  selectedValue: any;
  itemList: AngularFireList<any>;
  friendChat = firebase.database().ref('/friendchats');

  constructor(public db: AngularFireDatabase) { }


  ngOnInit() {
    this.itemList = this.db.list('/friendchats/admin');
    this.itemList.snapshotChanges().subscribe(actions => {
      actions.forEach(action => {
        this.summaries.push(action.key);
      });
    });
  }

  onChange(select) {
    this.selectedValue = select;

    this.itemList = this.db.list('/friendchats/admin/' + this.selectedValue)
    this.itemList.snapshotChanges().subscribe(actions => {
      this.list = [];
      actions.forEach(action => {
        let y = action.payload.toJSON();
        this.list.push(y);
        console.log(y);
      });
    });
  }

  addmessage() {
    this.summaries = []
    var promise = new Promise((resolve, reject) => {

      let st = this.newmessage;
      this.itemList = this.db.list('/friendchats/admin/' + this.selectedValue);
      this.itemList.push({
        sentby: 'admin',
        message: st,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        this.itemList = this.db.list('/friendchats/' + this.selectedValue + '/admin/');
        this.itemList.push({
          sentby: 'admin',
          message: st,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          resolve(true);
        })
      })
    })
    this.newmessage = "";
    return promise;
  }
}
