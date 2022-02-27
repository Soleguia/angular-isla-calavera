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
  defaultDice = {
    name: 'Default',
    face: this.path+'dice.svg',
    class: 'dice',
    id: ''
  };
  diceFaces = [
    {
      name: 'Coin',
      face: this.path+'coin.svg',
      class: 'dice',
      id: ''
    },
    {
      name: 'Diamond',
      face: this.path+'diamond.svg',
      class: 'dice',
      id: ''
    },
    {
      name: 'Monkey',
      face: this.path+'monkey.svg',
      class: 'dice',
      id: ''
    },
    {
      name: 'Parrot',
      face: this.path+'parrot.svg',
      class: 'dice',
      id: ''
    },
    {
      name: 'Skull',
      face: this.path+'skull.svg',
      class: 'dice',
      id: ''
    },
    {
      name: 'Swords',
      face: this.path+'swords.svg',
      class: 'dice',
      id: ''
    }
  ];

  constructor(utilsService: UtilsService) {
    this.utils = utilsService;
  }

  defaultDicePool( poolSize:number=this.poolSize ):DiceEntity[] {
    let dicePool = [];
    for( let d = 0; d < poolSize; d++ ){
      dicePool.push( this.defaultDice );
    }
    return dicePool;
  }

  randomDicePool( poolSize:number=this.poolSize ):DiceEntity[] {
    let dicePool = [];
    for( let d = 0; d < poolSize; d++ ){
      let face = this.utils.getRandom(0, 5);
      let dice = this.diceFaces[face]
      dicePool.push( dice );
    }
    return dicePool;
  }

  diceIndex( player:number, round:number, id:number ){
    return 'dice-'+player+'-'+round+'-'+id;
  }
}
