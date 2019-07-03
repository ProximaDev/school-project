import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { StudentComponent } from '../../student/student.component';
import { VideosComponent } from '../../videos/videos.component';
import { WeeklyComponent } from '../../weekly/weekly.component';
import { AddWeeklyComponent } from '../../add-weekly/add-weekly.component';
import { AddVideoComponent } from '../../add-video/add-video.component';
import { EditVideoComponent } from '../../edit-video/edit-video.component';
import { ConfirmDeleteComponent } from '../../confirm-delete/confirm-delete.component';
import { HomeworkComponent } from '../../homework/homework.component'
import { NotifyComponent } from '../../notify/notify.component';
import { AllNotifyComponent } from '../../all-notify/all-notify.component';
import { CoursesComponent } from '../../courses/courses.component'
import { AbsentComponent } from '../../absent/absent.component';
import { DegreeComponent } from '../../degree/degree.component';
import { ClassesComponent } from '../../classes/classes.component';
import { ArticlesComponent } from '../../articles/articles.component';
import { AddArticleComponent } from '../../add-article/add-article.component';
import { EditArticleComponent } from '../../edit-article/edit-article.component';
import { ArticleViewComponent } from '../../article-view/article-view.component';
import { NgxTrumbowygModule } from 'ngx-trumbowyg';
import {PaymentsComponent} from '../../payments/payments.component'

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    NgxYoutubePlayerModule.forRoot(),
    NgxSpinnerModule,
    NgxTrumbowygModule.withConfig({
      lang: 'ar',
      svgPath: '/assets/icons.svg',
      removeformatPasted: true,
      autogrow: true,
      btns: [
        ['formatting'],
        ['strong', 'em', 'del'],
        ['superscript', 'subscript'],
        ['link'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        ['unorderedList', 'orderedList'],
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen'],
        ['insertImage']
      ],
      events: {}
    }),
  ],
  declarations: [
    ConfirmDeleteComponent,
    DashboardComponent,
    StudentComponent,
    VideosComponent,
    WeeklyComponent,
    AddWeeklyComponent,
    AddVideoComponent,
    EditVideoComponent,
    HomeworkComponent,
    NotifyComponent,
    AllNotifyComponent,
    CoursesComponent,
    AbsentComponent,
    DegreeComponent,
    ClassesComponent,
    ArticleViewComponent,
    ArticlesComponent,
    AddArticleComponent,
    EditArticleComponent,
    PaymentsComponent
  ],
  entryComponents: [ConfirmDeleteComponent, ArticleViewComponent]
})

export class AdminLayoutModule { }
