import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from 'app/services/firebase.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {

  PayList: Observable<any[]>;
  PayData: any[];
  PaymentList: Observable<any[]>;
  PaymentData: any[];
  StudentList: Observable<any[]>;
  StudentData: any[];
  division: any;
  stage: any;
  name: any;

  constructor(private firestoreService: FirebaseService, private toastr: ToastrService) { }

  divSelect() {
    this.StudentList = this.firestoreService.getRealTimeData('studentList', `${this.stage}/${this.division}`);
    this.StudentList.subscribe(data => {
      this.StudentData = data;
    });
  }


  async filterExact(stage: string, division: string, name: string) {
    const value = stage + '_' + division;
    this.PaymentList = await this.firestoreService.getFirestoreData('paymentList', 'tag', value);
    await this.PaymentList.subscribe(data => {
      let filters = {};
      filters['name'] = val => val == name;
      this.PaymentData = _.filter(data, _.conforms(filters));
    });
    this.PayList = await this.firestoreService.getFirestoreData('payList', 'tag', value);
    await this.PayList.subscribe(data => {
      let filters = {};
      filters['name'] = val => val == name;
      this.PayData = _.filter(data, _.conforms(filters));
    });
  }

}
