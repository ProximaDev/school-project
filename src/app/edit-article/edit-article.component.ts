import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators/map';
import { finalize } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { formatDate } from '@angular/common';
import * as firebase from 'firebase/app';
import { Articles } from 'app/services/models/articles.model';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private router: ActivatedRoute,
    private route: Router,
    private storage: AngularFireStorage,
    public FirebaseService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private toastr: ToastrService,
    private article: Articles) { }

  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.route.navigate(['login']);
    }
    else {
      this.router.params.subscribe(data => {
        this.article.id = data.id;
        this.article.title = data.title;
        this.article.description = data.description;
        this.article.oldname = data.imgname;
      });
    }
  }

  saveFormData(form) {
    if (this.article.image) {
      let today = new Date();
      let date = formatDate(today, 'medium', 'en-US');
      const storageRef = firebase.storage().ref();
      storageRef.child(`posts/${this.article.oldname}`).delete();
      this.FirebaseService.updateFirestoreData('newsList', this.article.id, this.article);
      this.route.navigate(['articles']);
    }
    else {
      this.toastr.error('خطأ', 'يرجى انتظار تحميل الصورة');
    }
  }

  onSelectedFile(event) {
    const randomId = Math.random().toString(36).substring(2);
    this.article.imgname = 'uni-' + randomId + event.target.files[0].name;
    const id = '/posts/' + this.article.imgname;
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.article.image = url;
        });
      })
    ).subscribe();
  }

}
