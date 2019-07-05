import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Homework {
    id: string;
    stage: string;
    division: string;
    course: string;
    subject: string;
    description: string;
    date: string;
}
