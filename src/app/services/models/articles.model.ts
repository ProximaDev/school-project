import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Articles {
    id: string;
    title: string;
    description: string;
    image: string;
    imgname: string;
    oldname: string;
}
