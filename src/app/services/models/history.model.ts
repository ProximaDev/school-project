import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class History {
    name: string;
    establishment_date:string;
    owner_name:string;
    director_name:string;
    school_profile:string;
}
