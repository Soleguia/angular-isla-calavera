import { Component, Input, OnInit } from '@angular/core';
import { DiceEntity } from '../model/dice-entity';
import { DataService } from '../services/data.service';
import { DiceService } from '../services/dice.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent implements OnInit {

  currentDice:DiceEntity;

  constructor( private utils: UtilsService,  private dice: DiceService,  private data: DataService ) {
    this.currentDice = this.dice.defaultDice;
  }

  @Input()
  id:string;

  @Input()
  face:DiceEntity;

  ngOnInit(): void {
    this.currentDice = this.face;
    this.face.id = this.id;
  }

  getDice(face:number):DiceEntity{
    if( face > -1 ){
      face = parseInt( this.utils.getRandom(0, 5).toFixed(0) );
    }
    return this.dice.diceFaces[face];
  }
}
