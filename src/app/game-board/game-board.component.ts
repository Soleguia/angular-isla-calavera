import { Component, Input, OnInit } from '@angular/core';
import { GameDataEntity } from '../model/game-data-entity';
import { CardService } from '../services/card.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  data:DataService;
  cards:CardService;
  dicePool;
  gameData: GameDataEntity;

  @Input()
  gameOn:boolean;


  constructor(dataService:DataService, cardsData:CardService) {
    this.data = dataService;
    this.cards = cardsData;
    this.dicePool = this.data.dicePool;
    this.gameData = this.data.gameData;
  }

  ngOnInit(): void {

  }
  firstRoll():void {
    this.data.nextRound();
    this.cards.currentCard = this.cards.getCard();
  }

  roll() {

  }

  settleDown(){
    this.data.nextRound();

  }

}
