import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CardEntity } from '../model/card-entity';
import { DiceEntity } from '../model/dice-entity';
import { GameDataEntity } from '../model/game-data-entity';
import { PlayerEntity } from '../model/player-entity';
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
  currentCard:CardEntity;
  dicePool:DiceEntity[];
  gameData: GameDataEntity;
  gameData$:Observable<GameDataEntity>;
  playersData:PlayerEntity[] = [];
  playersData$:Observable<PlayerEntity[]>;
  winner:number;

  @Input()
  gameOn:boolean;


  constructor( private utils: UtilsService, private data:DataService, private dice:DiceService, private cards:CardService) {
    this.currentCard = this.cards.cardDefault;
    this.dicePool = this.data.dicePool;
    this.gameData = this.data.gameData;
    this.winner = -1;
  }

  ngOnInit(): void {
    this.gameData$ = this.data.getGameData$();
    this.gameData$.subscribe(gameData => this.gameData = gameData );
    this.playersData$ = this.data.getPlayers$();
    this.playersData$.subscribe(playersData => this.playersData = playersData);
  }

  defaultCard():void {
    this.currentCard = this.cards.cardDefault;
    this.gameData.card = this.currentCard;
  }

  revealCard():void {
    this.currentCard = this.cards.getCard();
    this.gameData.card = this.currentCard;
    if( this.gameData.card.name == 'Sorceress' ){
      this.gameData.denySkull = true;
    }
  }

  // Game's first roll
  firstRoll():void {
    this.data.addRound();
    this.revealCard();
    this.data.dicePool = this.roll(); // full dicepool

    this.checkSkullIslandOrRoundOver();

  }

  turnInit(){
    if( this.data.lastRound ){
        this.data.countDownTurns--;
    }
    this.revealCard();
    this.data.dicePool = this.roll(); // full dicepool
    this.gameData.lastPlayer = this.gameData.player;
    this.checkSkullIslandOrRoundOver();
  }

  // Player round's first roll
  nextPlayerRoll() {
    this.turnInit();
  }

  currentPoolSize():number {
    return this.dice.poolSize - this.gameData.lockedDice.length - this.gameData.savedDice.length;
  }

  playerCanRoll():boolean {
    return this.data.playerCanRoll();
  }
  playerCanSettleDown():boolean {
    return this.data.playerCanSettleDown();
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

  isLastRound():boolean {
    return this.data.lastRound;
  }
  countDownTurns():number {
    return this.data.countDownTurns;
  }
  // AutoWin on 9 Coins or 9 Diamonds
  isAutoWin(){
    if ( this.check9win( 'Coin' ) || this.check9win( 'Diamond' ) ){
      this.winner = this.gameData.player;
      this.gameData.winner = this.winner;
    }
  }
  check9win( face:string ):boolean {
    if( this.dicePool.filter( dice => dice.name == face ).length == 8 && this.gameData.card.name == face ){
      return true;
    }
    return false;
  }

  roll( poolSize:number = this.dice.poolSize ):DiceEntity[] {
      let roll = this.dice.randomDicePool( poolSize );
      // take skulls from roll
      let skulls = roll.filter( dice => dice.name === 'Skull' );

      skulls.forEach( dice => dice.class = 'dice skull locked' );
      let rollWithoutSkulls = roll.filter( dice => dice.name !== 'Skull' );

      if( this.gameData.denySkull && skulls.length > 0 ){
        skulls.length = skulls.length - 1;
        rollWithoutSkulls.push(this.dice.defaultDice);
        this.gameData.denySkull = false;
      }
      // add skulls to lockedDice
      this.gameData.lockedDice = [ ...this.gameData.lockedDice, ...skulls ];

      this.dicePool = [ ...this.gameData.lockedDice, ...this.gameData.savedDice, ...rollWithoutSkulls ];

      this.isAutoWin();

      this.data.setThrow({
        round: this.gameData.round,
        roundOver: this.gameData.roundOver,
        player: this.gameData.player,
        lastPlayer: this.gameData.lastPlayer,
        card: this.gameData.card,
        skulls: this.gameData.skulls,
        denySkull: this.gameData.denySkull,
        skullIsland: this.gameData.skullIsland,
        lockedDice: this.gameData.lockedDice,
        savedDice: this.gameData.savedDice,
        throws: [ ...this.gameData.throws, {
          round: this.gameData.round,
          player: this.gameData.player,
          diceRoll: this.dicePool
        } ],
        winner: this.gameData.winner
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

    if( totalSkulls >= 4 && ! this.cards.isPirateShip( this.gameData.card ) ) {
      this.gameData.denySkull = false;
      return true;
    }
    return false
  }

  isRoundOver():boolean {
    let skulls = this.countSkullCards();
    let lockedSkulls = this.gameData.lockedDice.filter( dice => dice.name == 'Skull' ).length;
    if( skulls + lockedSkulls > 2 ){
      return true;
    }
    return false;
  }

  roundOverOnSkullIsland():void {
    if( this.gameData.skullIsland ){
      let skulls = this.countSkullCards() + this.countSkullDice( this.gameData.lockedDice );
      if( this.gameData.card.name == 'Pirate' ){
        skulls *= 2;
      }
      this.data.players.map( (player, id) => {
        if( this.gameData.player != id ){
          let score = skulls * -100;
          player.points += score;
          player.registry.push( score );
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

  setScore(): void{
    let playerScore = 0;
    let scoreDice = [...this.dicePool];
    let bonusAllDice = 0;

    if( this.isRoundOver() ){
      scoreDice = this.gameData.savedDice;
    } else {
      scoreDice = scoreDice.filter( dice => dice.name !== 'Skull' && dice.name !== 'Default' );
    }

    // extract distinct values from scoreDice
    let distinctDice:DiceEntity[] = [];
    scoreDice.forEach( dice => {
      if( ! distinctDice.some( distinct => distinct.name == dice.name) ){
        distinctDice = [ ...distinctDice, dice ];
      }
    });

    // count every distinct
    // check for Monkeys & Parrots card
    let monkeysParrots = false;

    distinctDice.forEach( dice => {
      let count = 0;
      if( this.gameData.card.name == 'Monkeys & Parrots' && ( dice.name == 'Monkey' || dice.name == 'Parrot' ) ){
          if( ! monkeysParrots ){
            count = scoreDice.filter( score => {
              return score.name === 'Monkey' || score.name === 'Parrot'
            } ).length;
            monkeysParrots = true;
          }
      } else {
        count = scoreDice.filter( score => {
          return score.name === dice.name
        } ).length;

        if( dice.name == 'Coin' && this.gameData.card.name == 'Coin' ){
          count += 1;
        }
        if( dice.name == 'Diamond' && this.gameData.card.name == 'Diamond' ){
          count += 1;
        }
      }

      let score = this.utils.getScore( dice.name, count );
      if( score > 0 ){
        bonusAllDice += count;
      }
      playerScore += score;

    });

    // CARD: Pirate
    if( this.gameData.card.name == 'Pirate' ){
      playerScore *= 2;
    }

    // CARD: Pirate Ship
    if( this.cards.isPirateShip( this.gameData.card ) ) {
      playerScore = this.cards.scoreCardsPirateShip( this.gameData.card, scoreDice, playerScore );
    }

    // Bonus +500
    if( scoreDice.length == 8 && bonusAllDice == 8 ){
      playerScore += 500;
    }

    this.data.players[this.gameData.player].points += playerScore;
    this.data.players[this.gameData.player].registry.push( playerScore );


    this.checkWinPoints();
  }

  winnerByPoints(){
    let maxPoints = 0;
    let winner = -1;
    this.data.players.forEach( (player, index) => {
      if( player.points > maxPoints ) {
        maxPoints = player.points;
        winner = index;
      }
    });
    return winner;
  }

  checkWinPoints(){
    let currentPlayer = this.gameData.player;
    let currentPlayerPoints = this.data.players[currentPlayer].points
    if( this.data.lastRound ){
      if( currentPlayerPoints > this.data.players[this.data.lastPlayer].points ){
        this.data.countDownTurns++;
      }
    } else {
      if( currentPlayerPoints >= this.data.winPoints ){
        this.data.lastRound = true;
        this.data.lastPlayer = currentPlayer;
        this.data.countDownTurns = this.data.players.length - 1;
      }
    }
  }

  settleDown(){

    this.setScore();

    this.data.nextPlayer();
    this.data.nextRound();

    this.defaultCard();
    this.dicePool = this.dice.defaultDicePool();

    if( this.data.lastRound && this.data.countDownTurns == 0 ){
      this.winner = this.winnerByPoints();
      this.gameData.winner = this.winner;
    }
  }

  isLocked( face:DiceEntity ){
    return this.gameData.lockedDice.find( dice => dice.id == face.id );
  }
  isSaved( face:DiceEntity ){
    return this.gameData.savedDice.find( dice => dice.id == face.id );
  }

  canLockDice( face:DiceEntity ){
    return ! this.gameData.skullIsland
            && ! this.isRoundOver()
            && ! ( this.dicePool.filter( dice => dice.name == 'Default' ).length > 1 )
            && face.name !== 'Default'
            && face.name !== 'Skull';
  }

  saveDice( face:DiceEntity ) {
    if( this.canLockDice( face ) ){
      let isSaved = this.gameData.savedDice.find( dice => dice.id == face.id );
      let savedDice:DiceEntity = this.dicePool.find( dice => dice.id == face.id )!;

      if( isSaved ){
        if( savedDice ){
          savedDice.class = 'dice';
        }
        this.unSaveDice( savedDice );
      } else {
        if( savedDice ){
          savedDice.class = 'dice saved';
        }
        if( this.isLocked( savedDice ) ){
          this.unLockDice( savedDice );
        }
        this.gameData.savedDice = [...this.gameData.savedDice, savedDice];
      }
    }
  }

  unSaveDice( face:DiceEntity ){
    this.gameData.savedDice = this.gameData.savedDice.filter( dice => dice.id !== face.id );
  }
  unLockDice( face:DiceEntity ){
    this.gameData.lockedDice = this.gameData.lockedDice.filter( dice => dice.id !== face.id );
  }

  isTreasureCard(face:DiceEntity):boolean {
    return ! this.gameData.skullIsland && ! this.gameData.roundOver && face.name !== 'Skull' && this.gameData.card.name == 'Treasure';
  }

  lockDice( face:DiceEntity ): void {
    // Can't lock dice on Skull Island , Round Over or Default View
    if( this.canLockDice( face ) ){

      if( this.isTreasureCard(  face ) ){
        let isSaved = this.gameData.savedDice.find( dice => dice.id == face.id );
        let savedDice:DiceEntity = this.dicePool.find( dice => dice.id == face.id )!;

        if( isSaved ){
          if( savedDice ){
            savedDice.class = 'dice';
          }
          this.unSaveDice( savedDice );
        } else {
          if( savedDice ){
            savedDice.class = 'dice saved';
          }
          this.gameData.savedDice = [...this.gameData.savedDice, savedDice];
        }
      } else {
        let isLocked = this.gameData.lockedDice.find( dice => dice.id == face.id );
        let poolDice:DiceEntity = this.dicePool.find( dice => dice.id == face.id )!;

        if( isLocked ){
          if( poolDice ){
            poolDice.class = 'dice';
          }
          this.unLockDice( poolDice );
        } else {
          if( poolDice ){
            poolDice.class = 'dice locked';
          }
          if( this.isSaved( poolDice ) ){
            this.unSaveDice( poolDice );
          }
          this.gameData.lockedDice = [...this.gameData.lockedDice, poolDice];
        }
      }
    }
  }
  restart(){
    location.reload();
  }
}
