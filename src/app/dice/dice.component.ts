import { Component, Input, OnInit } from '@angular/core';
import { DiceEntity } from '../model/dice-entity';

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

  @Input()
  dice:DiceEntity;

  constructor() {
    this.currentDice = { name: 'Default', face: this.path+'dice.svg'};
  }

  ngOnInit(): void {}

  getDice():DiceEntity{
    let face:number = parseInt( this.getRandom(0, 5).toFixed(0) );
    return this.diceFaces[face];
  }

  getDiceBlank():DiceEntity{
    return { name: 'Dice', face: this.path+'dice.svg'};
  }

  getRandom(min:number, max:number):number {
    return Math.random() * (max - min) + min;
  }
}
