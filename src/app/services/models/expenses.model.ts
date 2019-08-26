import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Expenses {
    id:string;
    name:string;
    type:string;
    amount:string;
    description:string;
    date:string;
}
