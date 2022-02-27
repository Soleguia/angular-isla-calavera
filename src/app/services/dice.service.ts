import { Injectable } from '@angular/core';
import { DiceEntity } from '../model/dice-entity';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class DiceService {

  utils:UtilsService;
  totalDices:number;
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
    this.totalDices = 0;
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
      let dice = {...this.diceFaces[face]};
      this.totalDices++;
      dice.id = 'dice--'+ this.totalDices
      dicePool.push( dice );
    }
    return dicePool;
  }

  diceIndex( player:number, round:number, throws:number, id:number ):string {
    return 'dice-'+player+'-'+round+'-'+throws+'-'+id;
  }
}
