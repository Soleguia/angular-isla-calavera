import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerEntity } from '../model/player-entity';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  showContent:string = '';
  playersData:PlayerEntity[] = [];
  playersData$:Observable<PlayerEntity[]>;
  gameOn:boolean;

  constructor( private data:DataService ) {
    this.gameOn = this.getGameStatus();
  }

  ngOnInit(): void {
    this.playersData$ = this.data.getPlayers$();
    this.playersData$.subscribe(playersData => this.playersData = playersData);
  }

  initIC(show:string):void {
    this.data.setShowContent(show);
    this.showContent = this.data.getShowContent();
  }
  
  getGameStatus():boolean{
    return this.data.gameOn;
  }

  setGameOn( isOn:boolean ){
    this.data.setGameStatus(isOn);
    this.gameOn = this.getGameStatus();
  }
}
