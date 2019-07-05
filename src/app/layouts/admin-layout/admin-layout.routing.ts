import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/auth.guard';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { StudentComponent } from '../../student/student.component';
import { VideosComponent } from '../../videos/videos.component';
import { WeeklyComponent } from '../../weekly/weekly.component';
import { AddWeeklyComponent } from '../../add-weekly/add-weekly.component';
import { AddVideoComponent } from '../../add-video/add-video.component';
import { EditVideoComponent } from '../../edit-video/edit-video.component';
import { HomeworkComponent } from '../../homework/homework.component'
import { NotifyComponent } from '../../notify/notify.component';
import { AllNotifyComponent } from '../../all-notify/all-notify.component';
import { CoursesComponent } from '../../courses/courses.component'
import { AbsentComponent } from '../../absent/absent.component';
import { DegreeComponent } from '../../degree/degree.component';
import { ArticlesComponent } from '../../articles/articles.component';
import { AddArticleComponent } from '../../add-article/add-article.component';
import { EditArticleComponent } from '../../edit-article/edit-article.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'articles', component: ArticlesComponent, canActivate: [AuthGuard] },
    { path: 'add-article', component: AddArticleComponent, canActivate: [AuthGuard] },
    { path: 'edit-article', component: EditArticleComponent, canActivate: [AuthGuard] },
    { path: 'student', component: StudentComponent, canActivate: [AuthGuard] },
    { path: 'homework', component: HomeworkComponent, canActivate: [AuthGuard] },
    { path: 'videos', component: VideosComponent, canActivate: [AuthGuard] },
    { path: 'add-video', component: AddVideoComponent, canActivate: [AuthGuard] },
    { path: 'edit-video', component: EditVideoComponent, canActivate: [AuthGuard] },
    { path: 'weekly', component: WeeklyComponent, canActivate: [AuthGuard] },
    { path: 'notify', component: NotifyComponent, canActivate: [AuthGuard] },
    { path: 'all-notify', component: AllNotifyComponent, canActivate: [AuthGuard] },
    { path: 'add-weekly', component: AddWeeklyComponent, canActivate: [AuthGuard] },
    { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
    { path: 'absent', component: AbsentComponent, canActivate: [AuthGuard] },
    { path: 'degree', component: DegreeComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/dashboard' }
];
