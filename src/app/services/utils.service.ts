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

  getScore( name:string, amount:number ):number {
    let total = 0;
    if( amount == 8 ){
      total += 4500;
    } else if( amount == 7 ){
      total += 2000;
    } else if( amount == 6 ){
      total += 1000;
    } else if( amount == 5 ){
      total += 500;
    } else if( amount == 4 ){
      total += 200;
    } else if( amount == 3 ){
      total += 100;
    }

    if( name == 'Coin' || name == 'Diamond' ){
      total += (amount * 100);
    }

    return total;
  }
}
