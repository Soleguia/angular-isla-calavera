import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getRandom(min:number, max:number):number {
    let r = Math.random() * (max - min) + min
    return parseInt( r.toFixed(0) );
  }
}
