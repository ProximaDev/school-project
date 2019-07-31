import { FirebaseService } from '../services/firebase.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Notify } from '../services/models/notify.model';
import { formatDate } from '@angular/common';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {

  constructor(private router: Router,
    public FirebaseService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private notify: Notify) { }

  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
  }

  saveFormData(form) {
    let today = new Date();
    this.notify.date = formatDate(today, 'medium', 'en-US');
    this.FirebaseService.addFirestoreData('notifyList', this.notify, "");
    this.router.navigate(['all-notify']);
  }
}
