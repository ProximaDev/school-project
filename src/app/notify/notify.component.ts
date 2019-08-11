import { FirebaseService } from '../services/firebase.service';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Notify } from '../services/models/notify.model';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {

  StudentList: Observable<any[]>;
  StudentData: any;
  stage: any;
  division: any;
  token: any;
  sentone = false;

  constructor(private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private firestoreService: FirebaseService,
    public FirebaseService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private notify: Notify) { }

  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
  }

  getToken(token: string) {
    console.log(token);
    this.token = token;
    this.sentone = true;
  }

  divSelect() {
    this.StudentList = this.firestoreService.getRealTimeData('studentList', `${this.stage}/${this.division}`);
    this.StudentList.subscribe(data => {
      this.StudentData = data;
    });
  }

  sendToAll(f: NgForm) {
    let today = new Date();
    this.notify.date = formatDate(today, 'medium', 'en-US');
    this.FirebaseService.addFirestoreData('notifyList', this.notify, "");

    this.http.post('https://us-central1-school-a53e4.cloudfunctions.net/sendToTopic', { 'title': this.notify.title, 'content': this.notify.content }).subscribe(data => {
      console.log(data);
      console.log(data['status']);
      if (data['status'] != undefined && data['status'] == 'Done') {
        f.resetForm();
        this.router.navigate(['all-notify']);
      }
    }, error => {
      if (error.status != 200) {
        this.toastr.show("حدث خطا اثناء اضافة الحدث", "خطأ");
      }
    });
  }

  sendToOne(f: NgForm) {
    let today = new Date();
    this.notify.date = formatDate(today, 'medium', 'en-US');
    this.FirebaseService.addFirestoreData('notifyList', this.notify, "");

    if (this.token != null && this.token != undefined) {
      this.http.post('https://us-central1-school-a53e4.cloudfunctions.net/sendToDevice', { 'token': this.token, 'title': this.notify.title, 'content': this.notify.content }).subscribe(data => {
        console.log(data);
        console.log(data['status']);
        if (data['status'] != undefined && data['status'] == 'Done') {
          f.resetForm();
          this.router.navigate(['all-notify']);
        }
      }, error => {
        if (error.status != 200) {
          this.toastr.show("حدث خطا اثناء اضافة الحدث", "خطأ");
        }
      });
    } else {
      this.toastr.show("لم يتم العثور على ملف الاتصال لهذا الحساب", "خطأ");
    }
  }
}
