import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Pay {
    id: string;
    name: string;
    division: string;
    stage: string;
    number: string;
    amountpaid: string;
    tag: string;
    date:string;
}
