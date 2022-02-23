import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CardEntity } from '../model/card-entity';
import { DiceEntity } from '../model/dice-entity';
import { GameDataEntity } from '../model/game-data-entity';
import { CardService } from '../services/card.service';
import { DataService } from '../services/data.service';
import { DiceService } from '../services/dice.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  data:DataService;
  cards:CardService;
  dice:DiceService;
  currentCard:CardEntity;
  dicePool:DiceEntity[];
  gameData: GameDataEntity;
  gameData$:Observable<GameDataEntity>;
  utils: UtilsService;

  @Input()
  gameOn:boolean;


  constructor(utilsService: UtilsService, dataService:DataService, diceService:DiceService, cardsData:CardService) {
    this.utils = utilsService;
    this.data = dataService;
    this.dice = diceService;
    this.cards = cardsData;
    this.currentCard = this.cards.cardDefault;
    this.dicePool = this.data.dicePool;
    this.gameData = this.data.gameData;
  }

  ngOnInit(): void {
    this.gameData$ = this.data.getGameData$();
    this.gameData$.subscribe(gameData => {
      this.gameData = gameData;
    });
  }



  defaultCard():void {
    this.currentCard = this.cards.cardDefault;
    this.gameData.card = this.currentCard;
  }

  revealCard():void {
    this.currentCard = this.cards.getCard();
    this.gameData.card = this.currentCard;
  }

  // First play
  firstRoll():void {
    this.data.firstRound();
    this.revealCard();
    this.roll(this.gameData.player, this.gameData.lastPlayer);

    this.checkSkullIsland( this.dicePool );
  }

  nextPlayerRoll( player:number, lastPlayer:number ) {
    this.revealCard();
    this.roll( player, lastPlayer );
    this.checkSkullIsland( this.dicePool );
  }

  roll( player:number, lastPlayer:number ) {
    this.dicePool = this.dice.randomDicePool();

    this.checkRoll( this.dicePool );

    this.data.setThrow({
      round: this.gameData.round,
      player: player,
      lastPlayer: lastPlayer,
      card: this.gameData.card,
      skulls: this.gameData.skulls,
      skullIsland: this.gameData.skullIsland,
      lockedDice: this.gameData.lockedDice,
      throws: [ ...this.gameData.throws, {
        round: this.gameData.round,
        player: this.gameData.player,
        diceRoll: this.dicePool
      } ]
    });

  }

  checkRoll( roll:DiceEntity[] ){
    roll.forEach( dice => {
      console.log({dice})
      if( dice.name == 'Skull' ){

      }
    })
  }

  checkSkullIsland( roll:DiceEntity[] ){
    let totalSkulls = roll.filter( dice => dice.name == 'Skull' ).length;
    if( this.data.gameData.card.name == 'Skull' ){
      totalSkulls += 1;
    }
    if( this.data.gameData.card.name == 'Double Skull' ){
      totalSkulls += 2;
    }

    if( totalSkulls >= 4 ){
      console.log( 'Welcome to Skull Island!!' );
      this.data.gameData.skullIsland = true;
    } else {
      console.log( 'No Skull Island... this time.');
    }
  }

  settleDown(){
    this.data.nextRound();
    this.defaultCard();
    this.dicePool = this.dice.defaultDicePool();
  }

}
