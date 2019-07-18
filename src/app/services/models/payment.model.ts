import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Payment {
    id: string;
    name: string;
    division: string;
    stage: string;
    total_amount: string;
    amount_paid: string;
    tag: string;
}
