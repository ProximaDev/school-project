import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators/map';
import { finalize } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Weekly } from '../services/models/weekly.model';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-add-weekly',
  templateUrl: './add-weekly.component.html',
  styleUrls: ['./add-weekly.component.scss']
})
export class AddWeeklyComponent implements OnInit {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private router: Router,
    private storage: AngularFireStorage,
    public FirebaseService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private toastr: ToastrService,
    private weekly: Weekly) { }


  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
  }

  saveFormData(form) {
    if (this.weekly.image) {
      this.weekly.tag = this.weekly.stage + '_' + this.weekly.division;
      this.FirebaseService.addFirestoreData('weeklyList', this.weekly, "");
      this.router.navigate(['weekly']);
    }
    else {
      this.toastr.error('خطأ', 'يرجى انتظار تحميل الصورة');
    }
  }

  onSelectedFile(event) {
    const randomId = Math.random().toString(36).substring(2);
    this.weekly.imgname = 'uni-' + randomId + event.target.files[0].name;
    const id = '/weekly/' + this.weekly.imgname;
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.weekly.image = url;
        });
      })
    ).subscribe();
  }
}
