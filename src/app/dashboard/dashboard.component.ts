import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { NgxSpinnerService } from 'ngx-spinner';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.spinnerService.show();
  }

  ngOnInit() {
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
  }
  ngAfterViewInit() {
    this.spinnerService.hide();
  }
}
