import { FirebaseService } from '../services/firebase.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Videos } from '../services/models/videos.model'
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {

  constructor(private router: Router,
    public FirebaseService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private video: Videos) { }

  ngOnInit() {
    if (this.mstorage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
  }

  saveFormData(form) {
    this.FirebaseService.addFirestoreData('videosList', this.video);
    this.router.navigate(['videos']);
  }
}
