import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Exam {
    id: string;
    stage: string;
    division: string;
    course: string;
    subject: string;
    description: string;
    date: string;
    tag: string;
}
