import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Penalty {
    id: string;
    name: string;
    division: string;
    stage: string;
    penalty_type: string;
    penalty_amount: string;
    tag: string;
    date:string;
}
