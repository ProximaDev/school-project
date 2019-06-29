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
import * as _ from 'lodash';

@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.scss']
})
export class WeeklyComponent implements OnInit, AfterViewInit {

  stage: any;
  selection: any;
  rule: any;

  weeklyList: Observable<any[]>;
  weeklyData: any;
  filterData: any;

  class1:any;
  class2:any;
  class3:any;
  class4:any;
  class5:any;
  class6:any;


  classList: any;
  classData: any;

  classArray = [];

  /// Active filter rules
  filters = {}

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    } else {
      this.weeklyList = this.firestoreService.getWeekly();
    }
  }

  ngAfterViewInit(): void {
    this.weeklyList.subscribe(data => {
      if (data.length == 0) {
        $('#no-items-ava').show();
        $('#SHOW').hide();
      }
      else {
        $('#no-items-ava').hide();
        $('#SHOW').show();
      }
      this.weeklyData = data;
      this.applyFilters();
      this.spinnerService.hide();
    });
  }

  stageSelect() {
    this.classArray= [];  
    this.classList = this.firestoreService.getClass(this.stage);
 
    this.classList.subscribe(data => {
      if (data.length != 0 && data != undefined && data != null) {
        this.classData = data;
        this.classArray.push(this.classData.class1);
        this.classArray.push(this.classData.class2);
        this.classArray.push(this.classData.class3);
        this.classArray.push(this.classData.class4);
        this.classArray.push(this.classData.class5);
        this.classArray.push(this.classData.class6);
      }
    });
  }

  private applyFilters() {
    this.filterData = _.filter(this.weeklyData, _.conforms(this.filters))
  }

  /// filter property by equality to rule
  filterExact(property: string) {
    this.rule = this.stage + "_" + this.selection;
    this.filters[property] = val => val == this.rule
    this.applyFilters()
  }

  openDialog(id, imgid): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true')
        this.deleteWeekly(id, imgid);
    });
  }

  deleteWeekly(id, imgid) {
    this.firestoreService.deleteWeekly(id, imgid);
    this.toastr.success('تم الحذف', 'تم حذف الجدول بنجاح');
  }
}
