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

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'student', component: StudentComponent, canActivate: [AuthGuard] },
    { path: 'homework', component: HomeworkComponent, canActivate: [AuthGuard] },
    { path: 'videos', component: VideosComponent, canActivate: [AuthGuard] },
    { path: 'add-video', component: AddVideoComponent, canActivate: [AuthGuard] },
    { path: 'edit-video', component: EditVideoComponent, canActivate: [AuthGuard] },
    { path: 'weekly', component: WeeklyComponent, canActivate: [AuthGuard] },
    { path: 'notify', component: NotifyComponent, canActivate: [AuthGuard] },
    { path: 'add-weekly', component: AddWeeklyComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/dashboard' }
];
