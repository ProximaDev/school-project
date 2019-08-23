import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Payment {
    id: string;
    name: string;
    division: string;
    stage: string;
    total_amount: number;
    amount_paid: string;
    payment_date1:string;
    payment_date2:string;
    payment_date3:string;
    payment_amount1:string;
    payment_amount2:string;
    payment_amount3:string;
    tag: string;
}
