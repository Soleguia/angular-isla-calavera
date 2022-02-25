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

  // Game's first roll
  firstRoll():void {
    this.data.addRound();
    this.revealCard();
    this.roll(); // full dicepool

    this.checkSkullIslandOrRoundOver();

    this.setLockedDice();
  }

  // Player round's first roll
  nextPlayerRoll() {
    this.revealCard();
    this.roll(); // full dicepool
    this.gameData.lastPlayer = this.gameData.player;

    this.checkSkullIslandOrRoundOver();

    this.setLockedDice();
  }

  setLockedDice(){
    let skulls = this.dicePool.filter( dice => dice.name == 'Skull' )
    this.gameData.lockedDice = [ ...skulls ];
  }

  roll() {
    let currentPoolSize = this.dice.poolSize - this.gameData.lockedDice.length;
    // you need at least 2 dice for keep rolling
    if( currentPoolSize >= 2 ){
      let roll = this.dice.randomDicePool( currentPoolSize );
      // if Skull Island but rolls no skulls
      if( this.gameData.skullIsland && ! roll.some( dice => dice.name == 'Skull' ) ){
        this.gameData.roundOver = true;
      } else {
        this.dicePool = [ ...this.gameData.lockedDice, ...roll ];
        this.setLockedDice();
      }
      this.data.setThrow({
        round: this.gameData.round,
        roundOver: this.gameData.roundOver,
        player: this.gameData.player,
        lastPlayer: this.gameData.lastPlayer,
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
  }

  countSkullCards():number {
    if( this.data.gameData.card.name == 'Skull' ){
      return 1;
    }
    if( this.data.gameData.card.name == 'Double Skull' ){
      return 2;
    }
    return 0;
  }

  countSkullDice( dicePool:DiceEntity[] ) {
    return dicePool.filter( dice => dice.name == 'Skull' ).length;
  }

  checkSkullIsland( roll:DiceEntity[] ):boolean {
    let totalSkulls = this.countSkullDice( roll );
    totalSkulls += this.countSkullCards();

    if( totalSkulls >= 4 ){
      console.log( 'Welcome to Skull Island!!' );
      return true;
    } else {
      console.log( 'No Skull Island... this time.');
    }
    return false;
  }

  roundOver(){
    let skulls = this.countSkullCards();
    let lockedSkulls = this.gameData.lockedDice.filter( dice => dice.name == 'Skull' ).length;
    if( skulls + lockedSkulls > 2 ){
      return true;
    }
    return false;
  }

  checkSkullIslandOrRoundOver():void {
    if( this.checkSkullIsland( this.dicePool ) ){
      this.data.gameData.skullIsland = true;
    } else {
      this.gameData.roundOver = this.roundOver();
    }
  }

  settleDown(){
    this.data.nextPlayer();
    this.data.nextRound();
    this.defaultCard();
    this.dicePool = this.dice.defaultDicePool();
  }

  lockDice( dice:DiceEntity) {
    this.gameData.lockedDice.push( dice );
  }
}
