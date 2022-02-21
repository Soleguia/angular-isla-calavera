import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { CardEntity } from '../model/card-entity';
import { GameDataEntity } from '../model/game-data-entity';
import { PlayerEntity } from '../model/player-entity';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private showContent:string = '';
  public players:PlayerEntity[] = [];
  private playersData$:Subject<PlayerEntity[]> = new Subject<PlayerEntity[]>();
  public gameOn:boolean = false;
  public dicePool = new Array(8);
  public gameData:GameDataEntity;
  private gameData$:Subject<GameDataEntity[]> = new Subject<GameDataEntity[]>();


  constructor() {
    this.gameData = {
      round: 0,
      player: 0,
      throws: []
    }
  }

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
    this.players = [ ...this.players, { name: name, points: 0 } ]
    this.playersData$.next(this.players);
  }

  getPlayers$():Observable<PlayerEntity[]> {
    return this.playersData$.asObservable();
  }

  setGameStatus(isOn:boolean){
    this.gameOn = isOn;
  }

  getRandom(min:number, max:number):number {
    return Math.random() * (max - min) + min;
  }

  nextRound(){
    this.gameData.round++;

  }

}
