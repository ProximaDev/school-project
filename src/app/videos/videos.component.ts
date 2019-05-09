import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
const STORAGE_KEY = 'local_user';
import * as $ from 'jquery';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, AfterViewInit {

  videosList: Observable<any[]>;
  videosData: any;

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  openDialog(item): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true')
        this.deleteVideo(item);
    });
  }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    } else {
      this.videosList = this.firestoreService.getVideos();
    }
  }

  ngAfterViewInit() {
    this.videosList.subscribe(data => {
      if (data.length == 0) {
        $('#no-items-ava').show();
        $('#SHOW').hide();
      }
      else {
        $('#no-items-ava').hide();
        $('#SHOW').show();
      }
      this.videosData = data;
      this.spinnerService.hide();
    });
  }

  deleteVideo(item) {
    this.firestoreService.deleteVideos(item);
    this.toastr.success('تم الحذف', 'تم حذف الفيديو بنجاح');
  }
  updateVideo(item) {
    this.router.navigate(['edit-video', item]);
  }

  youtube_parser(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
  }

}
