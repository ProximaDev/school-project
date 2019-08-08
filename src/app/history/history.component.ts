import { Component, OnInit, Inject} from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { History } from '../services/models/history.model';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  historyList: Observable<any[]>;
  historyData: any;
  edit =false;

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private history: History) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.historyList = this.firestoreService.getFirestoreData('historylist');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.historyList.subscribe(data => {
      this.historyData = data;
    });
  }

  

  saveFormData(form: NgForm) {
    var datePipe = new DatePipe('en-US');
    this.history.establishment_date = datePipe.transform(new Date(this.history.establishment_date), 'dd/MM/yyyy');
      this.firestoreService.updateFirestoreData('historylist', this.history.id, this.history);
    form.resetForm();
    this.edit=false;
  }

  onEdit(history: History) {
    this.history = history;
    this.edit=true;
  }
}
