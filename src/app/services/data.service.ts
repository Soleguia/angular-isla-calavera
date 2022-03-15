import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { DiceEntity } from '../model/dice-entity';
import { GameDataEntity } from '../model/game-data-entity';
import { PlayerEntity } from '../model/player-entity';
import { CardService } from './card.service';
import { DiceService } from './dice.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private showContent:string = '';
  public players:PlayerEntity[] = [];
  private playersData$:Subject<PlayerEntity[]> = new Subject<PlayerEntity[]>();

  public gameOn:boolean = false;
  public lastRound:boolean = false;
  public countDownTurns: number = 0;
  public lastPlayer:number = -1;
  public winPoints:number = 6000;

  public dice: DiceService;
  public cards: CardService;

  public dicePool:DiceEntity[];

  public gameRegistry:GameDataEntity[] = [];
  public gameData:GameDataEntity;
  private gameData$:Subject<GameDataEntity> = new Subject<GameDataEntity>();



  constructor( diceService:DiceService, cardService:CardService ) {
    this.cards = cardService;
    this.dice = diceService;
    this.gameData = this.gameDataDefault();
    this.dicePool = this.dice.defaultDicePool();

  }

  gameDataDefault():GameDataEntity {
    return {
      round: 0,
      roundOver: false,
      player: 0,
      lastPlayer: 0,
      card: this.cards.cardDefault,
      skulls: 0,
      denySkull: false,
      skullIsland: false,
      lockedDice: [],
      savedDice: [],
      throws: [],
      winner: -1
    }
  };
  getShowContent():string {
    return this.showContent;
  }

  setShowContent( showContent:string ) {
    this.showContent = showContent;
  }

  getPlayers():{} {
    return this.players;
  }

  addPlayer( name:string ){
    this.players = [ ...this.players, { name: name, points: 0, registry: [] } ]
    this.playersData$.next(this.players);
  }

  getPlayers$():Observable<PlayerEntity[]> {
    return this.playersData$.asObservable();
  }

  getGameData$():Observable<GameDataEntity> {
    return this.gameData$.asObservable();
  }

  setGameStatus(isOn:boolean){
    this.gameOn = isOn;
  }

  getRound():number{
    return this.gameData.round;
  }

  addRound(){
    this.gameData.round++;
  }
  nextRound(){
    this.setThrow( this.gameData );
  }

  nextPlayer(){
    // current player turns into last player
    this.gameData.lastPlayer = this.gameData.player;

    let player = this.gameData.player + 1;
    if( player >= this.players.length ){
      this.gameData.player = 0;
      this.addRound();
    } else {
      this.gameData.player = player;
    }
    this.gameData.skullIsland = false;
    this.gameData.roundOver = false;
    this.gameData.lockedDice = [];
    this.gameData.savedDice = [];
    this.gameData$.next(this.gameData);
  }

  setThrow( gameData:GameDataEntity ){
    this.gameData = gameData;
    this.gameData$.next(this.gameData);
    this.gameRegistry.push( this.gameData );
  }

  enoughPoolSize():boolean {
    if( this.dice.poolSize - this.gameData.lockedDice.length - this.gameData.savedDice.length > 1 ){
      return true;
    }
    return false;
  }

  playerCanRoll():boolean {
    return this.enoughPoolSize() && this.gameData.round > 0 && this.gameData.player === this.gameData.lastPlayer && !this.gameData.roundOver;
  }
  playerCanSettleDown():boolean {
    let player = this.gameData.player;
    let round = this.gameData.round;
    return !!this.gameData.throws.filter( throwData => throwData.player == player && throwData.round == round ).length;
  }

}
