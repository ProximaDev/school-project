import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Staff {
    id: string;
    fullName: string;
    gender: string;
    age: string;
    address: string;
    mobile: string;
    email: string;
    Role:string;
    specialization:string;
    join_date:string;
    Experience:string;
    salary:string;
}
