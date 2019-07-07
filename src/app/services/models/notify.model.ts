import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Notify {
    id: string;
    subject: string;
    content: string;
    date: string;
}
