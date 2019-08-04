import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Attitude {
    id: string;
    name: string;
    division: string;
    stage: string;
    type:string;
    description: string;
    tag: string;
}
