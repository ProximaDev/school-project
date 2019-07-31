import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Trans {
    id: string;
    name: string;
    carnum: string;
    mobile: string;
    student: string;
    stage: string;
    division: string;
}
