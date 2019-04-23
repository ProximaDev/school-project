import { Injectable, Inject } from '@angular/core';
import { CanActivate,  Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
const STORAGE_KEY = 'local_user';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isloggedin = false;
  constructor(
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {}
  canActivate(): boolean {
      if (this.storage.get(STORAGE_KEY) == null) {
        this.router.navigate(['login']);
        this.isloggedin = false;
      } else {
        this.isloggedin = true;
      }
    return this.isloggedin;
}
}
