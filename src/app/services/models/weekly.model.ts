import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Weekly {
    id: string;
    stage: string;
    division: string;
    image: string;
    imgname: string;
    tag: string;
}
