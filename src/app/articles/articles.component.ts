import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { ArticleViewComponent } from '../article-view/article-view.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, AfterViewInit {

  articlesList: Observable<any[]>;
  articlesData: any;

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  viewDialog(items) {
    this.dialog.open(ArticleViewComponent, {
      data: { article: items }
    });
  }

  openDialog(item, img): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true')
        this.deleteArticle(item, img);
    });
  }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    } else {
      this.articlesList = this.firestoreService.getFirestoreData('newsList');
    }
  }

  ngAfterViewInit() {
    this.articlesList.subscribe(data => {
      if (data.length == 0) {
        $('#no-items-ava').show();
        $('#SHOW').hide();
      }
      else {
        $('#no-items-ava').hide();
        $('#SHOW').show();
      }
      this.articlesData = data;
      this.spinnerService.hide();
    });
  }

  substringText(text): any {
    return new DOMParser().parseFromString(text, "text/html").documentElement.textContent.substring(0, 300) + '...';
  }

  deleteArticle(id, fileName) {
    this.firestoreService.deleteFirestoreData('newsList', id);
    this.firestoreService.deleteStorageFile('posts', fileName);
    this.toastr.success('تم الحذف', 'تم حذف الخبر بنجاح');
  }

  updateArticle(item) {
    this.router.navigate(['edit-article', item]);
  }
}
