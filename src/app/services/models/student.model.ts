import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Student {
    id: string;
    fullName: string;
    gender: string;
    stage: string;
    division: string;
    birthdate: string;
    address: string;
    mobile: string;
    email: string;
    password: string;
    tag: string;
}
