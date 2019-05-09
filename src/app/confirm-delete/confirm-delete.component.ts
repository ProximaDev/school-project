import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material";


@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent {

  constructor(private dialogRef: MatDialogRef<ConfirmDeleteComponent>) {}

  doit(val){
    if(val == 'true'){
      this.dialogRef.close('true');
    } else if(val == 'false') {
      this.dialogRef.close('false');
    }
  }
}
