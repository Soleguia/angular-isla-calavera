import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CardEntity } from '../model/card-entity';
import { GameDataEntity } from '../model/game-data-entity';
import { CardService } from '../services/card.service';
import { DataService } from '../services/data.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  data:DataService;
  cards:CardService;
  currentCard:CardEntity;
  dicePool;
  gameData: GameDataEntity;
  gameData$:Observable<GameDataEntity>;
  utils: UtilsService;

  @Input()
  gameOn:boolean;


  constructor(utilsService: UtilsService, dataService:DataService, cardsData:CardService) {
    this.utils = utilsService;
    this.data = dataService;
    this.cards = cardsData;
    this.currentCard = this.cards.cardDefault;
    this.dicePool = this.data.dicePool;
    this.gameData = this.data.gameData;
  }

  ngOnInit(): void {
    this.gameData$ = this.data.getGameData$();
    this.gameData$.subscribe(gameData => {
      this.gameData = gameData;
      this.dicePool = this.gameData.throws;
    });
  }

  // First play
  firstRoll():void {
    this.data.firstRound();
    this.revealCard();
    this.roll();
  }

  revealCard():void {
    this.currentCard = this.cards.getCard();
    this.gameData.card = this.currentCard;
  }

  roll() {
    let dicePool = [];
    for( let d = 0; d < this.data.poolSize; d++ ){
      dicePool.push( this.utils.getRandom(0, 5) );
    }
    this.dicePool = dicePool;

    this.data.setThrow({
      round: this.gameData.round,
      player: this.gameData.player,
      card: this.gameData.card,
      throws: this.dicePool
    });

  }

  settleDown(){
    this.data.nextRound();
    this.revealCard();

  }

}
