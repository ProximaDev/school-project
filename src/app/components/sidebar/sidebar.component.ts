import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
const STORAGE_KEY = 'local_user';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'اللوحة الرئيسية', icon: 'dashboard', class: '' },
  { path: '/articles', title: 'لوحة الاخبار', icon: 'library_books', class: '' },
  { path: '/videos', title: 'لوحة الفيديوهات', icon: 'movie', class: '' },
  { path: '/student', title: 'اضافة طالب', icon: 'person_add', class: '' },
  { path: '/homework', title: 'اضافة واجب', icon: 'note_add', class: '' },
  { path: '/all-notify', title: 'ارسال اشعار', icon: 'notification_important', class: '' },
  { path: '/weekly', title: 'الجدول الاسبوعي', icon: 'today', class: '' },
  { path: '/courses', title: 'المواد', icon: 'book', class: '' },
  { path: '/absent', title: 'الغيابات', icon: 'schedule', class: '' },
  { path: '/degree', title: 'الدرجات', icon: 'assignment', class: '' }
];

export const ROUTES2: RouteInfo[] = [
  { path: '/attitude', title: 'سلوك ومستوى الطالب  ', icon: 'accessibility_new', class: '' },
  { path: '/staff', title: 'معلومات الكادر ', icon: 'group', class: '' },
  { path: '/exam', title: 'الامتحانات', icon: 'local_library', class: '' },
  { path: '/holiday', title: 'العطل', icon: 'hotel', class: '' },
  { path: '/payment', title: 'الاقساط', icon: 'euro_symbol', class: '' },
  { path: '/penalty', title: 'الغرامات', icon: 'sentiment_very_dissatisfied', class: '' },
  { path: '/trans', title: 'خطوط النقل', icon: 'airport_shuttle', class: '' },
  { path: '/history', title: ' معلومات المدرسة', icon: 'domain', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems: any[];

  constructor(public afAuth: AngularFireAuth,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService) { }

  logout() {
    this.afAuth.auth.signOut();
    this.storage.set(STORAGE_KEY, null);
    this.router.navigate(['login']);
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  menuselect(num: number) {
    if (num == 1) {
      this.menuItems = ROUTES.filter(menuItem => menuItem);
    } else {
      this.menuItems = ROUTES2.filter(menuItem => menuItem);
    }
  }
}
