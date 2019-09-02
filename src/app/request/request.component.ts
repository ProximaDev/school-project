import { Component, OnInit } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';//مكتبات جاهزة

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  constructor(public db: AngularFireDatabase) {}
  requestData=[];
  itemList: AngularFireList<any>;
  ngOnInit() {

    this.itemList = this.db.list('/request/')
    this.itemList.snapshotChanges().subscribe(actions => {
      this.requestData = [];
      actions.forEach(action => {
        var y = action.payload.toJSON();
        for (var tempkey in y) {
          this.requestData.push(y[tempkey]);
          console.log(y);
        }
      });

    
   

    });
    

}



}
