import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/auth.guard';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { StudentComponent } from '../../student/student.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'student', component: StudentComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/dashboard' }
];
