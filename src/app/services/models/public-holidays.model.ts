import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class PublicHolidays {
    id: string;
    name: string;
    date: string;
}
