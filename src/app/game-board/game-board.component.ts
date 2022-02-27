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
    this.data.dicePool = this.roll(); // full dicepool

    this.checkSkullIslandOrRoundOver();

  }

  // Player round's first roll
  nextPlayerRoll() {
    this.revealCard();
    this.data.dicePool = this.roll(); // full dicepool
    this.gameData.lastPlayer = this.gameData.player;

    this.checkSkullIslandOrRoundOver();
  }

  currentPoolSize():number {
    return this.dice.poolSize - this.gameData.lockedDice.length;
  }

  playerRoll(){
    let currentPoolSize = this.currentPoolSize();

    // you need at least 2 dice for keep rolling
    if( currentPoolSize >= 2 ){
      let roll = this.roll( currentPoolSize );

      if( this.gameData.skullIsland ){
        currentPoolSize = this.currentPoolSize();
        let rolledSkulls = roll.filter( dice => dice.name == 'Skull' ).length;
        if( rolledSkulls < 1 || currentPoolSize < 2 ){
          this.gameData.roundOver = true;
          this.roundOverOnSkullIsland()
        }
      } else {
        this.gameData.roundOver = this.isRoundOver();
      }

    } else {
      if( this.gameData.skullIsland ){
        this.gameData.roundOver = true;
        this.roundOverOnSkullIsland()
      }
    }
  }


  roll( poolSize:number = this.dice.poolSize ):DiceEntity[] {
      let roll = this.dice.randomDicePool( poolSize );
      // take skulls from roll
      let skulls = roll.filter( dice => dice.name === 'Skull' );
      let rollWithoutSkulls = roll.filter( dice => dice.name !== 'Skull' );
      // add skulls to lockedDice
      this.gameData.lockedDice = [ ...this.gameData.lockedDice, ...skulls ];

      this.dicePool = [ ...this.gameData.lockedDice, ...rollWithoutSkulls ];

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
      return roll;
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
  isSkullIsland( roll:DiceEntity[] ):boolean {
    let totalSkulls = this.countSkullDice( roll );
    totalSkulls += this.countSkullCards();

    if( totalSkulls >= 4 ){
      return true;
    }
    return false;
  }

  isRoundOver():boolean {
    let skulls = this.countSkullCards();
    let lockedSkulls = this.gameData.lockedDice.filter( dice => dice.name == 'Skull' ).length;
    if( skulls + lockedSkulls > 2 ){
      return true;
    }
    return false;
  }

  roundOverOnSkullIsland(){
    if( this.gameData.skullIsland ){
      let skulls = this.countSkullCards() + this.countSkullDice( this.gameData.lockedDice );
      if( this.gameData.card.name == 'Pirate' ){
        skulls *= 2;
      }
      this.data.players.map( (player, id) => {
        if( this.gameData.player != id ){
          player.points += skulls * -100;
        }
      } )
    }
  }
  checkSkullIslandOrRoundOver():void {
    if( this.isSkullIsland( this.dicePool ) ){
      this.data.gameData.skullIsland = true;
    } else {
      this.gameData.roundOver = this.isRoundOver();
    }
  }

  setScore(){
    let scoreDice = [...this.dicePool];
    scoreDice = scoreDice.filter( dice => dice.name !== 'Skull' );
    // extract distinct values from scoreDice
    let distinctDice:DiceEntity[] = [];
    scoreDice.forEach( dice => {
      if( ! distinctDice.some( distinct => distinct.name == dice.name) ){
        distinctDice = [ ...distinctDice, dice ];
      }
    });
    // count every distinct
    let playerScore = 0;
    distinctDice.forEach( dice => {
      let count = scoreDice.filter( score => score.name === dice.name ).length;
      playerScore += this.utils.getScore( dice.name, count );
    });

    this.data.players[this.gameData.player].points += playerScore;
    // ToDo: count how many dice are in combinations, if 8 then +500
    // ToDo: check card effect
    // ToDo: apply card effect
  }

  settleDown(){
    if( ! this.isRoundOver() ){
      this.setScore();
    }
    this.data.nextPlayer();
    this.data.nextRound();
    this.defaultCard();
    this.dicePool = this.dice.defaultDicePool();
  }

  lockDice( diceIndex:string ) {
    if( ! this.gameData.skullIsland && ! this.isRoundOver() ){
      let isLocked = this.gameData.lockedDice.find( dice => dice.id == diceIndex );
      let poolDice:DiceEntity = this.dicePool.find( dice => dice.id == diceIndex )!;

      if( isLocked ){
        if( poolDice ){
          poolDice.class = 'dice';
        }
        this.gameData.lockedDice = this.gameData.lockedDice.filter( dice => dice.id !== diceIndex );
      } else {
        if( poolDice ){
          poolDice.class = 'dice locked';
        }
        this.gameData.lockedDice = [...this.gameData.lockedDice, poolDice];
      }
    }
  }

}
