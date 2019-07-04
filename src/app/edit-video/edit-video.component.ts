import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Videos } from '../services/models/videos.model';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.scss']
})
export class EditVideoComponent implements OnInit {

  constructor(public router: ActivatedRoute,
    public FirebaseService: FirebaseService,
    private route: Router,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private video: Videos) { }

  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.route.navigate(['login']);
    }
    else {
      this.router.params.subscribe(data => {
        this.video.id = data.id;
        this.video.title = data.title;
        this.video.link = data.link;
      });
    }
  }

  async saveFormData(form) {
    this.FirebaseService.updateFirestoreData('videosList', this.video.id, this.video);
    this.route.navigate(['videos']);
  }

}
