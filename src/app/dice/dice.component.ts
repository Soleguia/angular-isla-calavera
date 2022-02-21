import { Component, Input, OnInit } from '@angular/core';
import { DiceEntity } from '../model/dice-entity';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent implements OnInit {

  path = 'assets/dice-icons/';
  diceFaces = [
    { name: 'Coin', face: this.path+'coin.svg'},
    { name: 'Diamond', face: this.path+'diamond.svg'},
    { name: 'Monkey', face: this.path+'monkey.svg'},
    { name: 'Parrot', face: this.path+'parrot.svg'},
    { name: 'Skull', face: this.path+'skull.svg'},
    { name: 'Swords', face: this.path+'swords.svg'}
  ];
  currentDice:DiceEntity;
  utils: UtilsService;

  constructor(utilsService: UtilsService) {
    this.utils = utilsService;
    this.currentDice = { name: 'Default', face: this.path+'dice.svg'};
  }

  @Input()
  face:number;

  ngOnInit(): void {
    if( this.face > -1 ){
      this.currentDice = this.diceFaces[this.face];
    }
  }

  getDice(face:number):DiceEntity{
    if( face > -1 ){
      face = parseInt( this.utils.getRandom(0, 5).toFixed(0) );
    }
    return this.diceFaces[face];
  }

  getDiceBlank():DiceEntity{
    return { name: 'Dice', face: this.path+'dice.svg'};
  }

}
