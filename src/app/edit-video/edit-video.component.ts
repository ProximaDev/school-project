import { Component, OnInit,Inject} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.scss']
})
export class EditVideoComponent implements OnInit {

  id: any;
  title: any;
  link: any;

  constructor(public router: ActivatedRoute,
    public FirebaseService: FirebaseService,
    private route: Router,
    @Inject(SESSION_STORAGE) private mstorage: StorageService) { }
  
    ngOnInit( ) {
      if (this.mstorage
        .get(STORAGE_KEY) == null) {
        this.route.navigate(['login']);
      }
      else{
        this.router.params.subscribe( data => {
          this.id = data.id;
          this.title = data.title;
          this.link = data.link;
        });
      }
    }
	
	async saveFormData(form) {
    this.FirebaseService.updateVideos(this.id, this.title, this.link);
    this.route.navigate(['videos']);
  }

}
