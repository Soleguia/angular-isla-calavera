import { Injectable } from '@angular/core';
import { DiceEntity } from '../model/dice-entity';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class DiceService {
  
  utils:UtilsService;

  poolSize:number = 8;
  path = 'assets/dice-icons/';
  defaultDice = { name: 'Default', face: this.path+'dice.svg'};
  diceFaces = [
    { name: 'Coin', face: this.path+'coin.svg'},
    { name: 'Diamond', face: this.path+'diamond.svg'},
    { name: 'Monkey', face: this.path+'monkey.svg'},
    { name: 'Parrot', face: this.path+'parrot.svg'},
    { name: 'Skull', face: this.path+'skull.svg'},
    { name: 'Swords', face: this.path+'swords.svg'}
  ];

  constructor(utilsService: UtilsService) {
    this.utils = utilsService;
  }

  defaultDicePool():DiceEntity[] {
    let dicePool = [];
    for( let d = 0; d < this.poolSize; d++ ){
      dicePool.push( this.defaultDice );
    }
    return dicePool;
  }

  randomDicePool():DiceEntity[] {
    let dicePool = [];
    for( let d = 0; d < this.poolSize; d++ ){
      let face = this.utils.getRandom(0, 5);
      let dice = this.diceFaces[face]
      dicePool.push( dice );
    }
    return dicePool;
  }
}
