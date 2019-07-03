import { FirebaseService } from '../services/firebase.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {

	event_title: any;
  event_content: any;

  constructor(private router: Router,
    public FirebaseService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService) {}

  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
  }
  
  saveFormData(form) {
    this.FirebaseService.addEvent(this.event_title, this.event_content);
    this.router.navigate(['all-notify']);
  }
}
