import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Notify {
    id: string;
    title: string;
    content: string;
    date: string;
}
