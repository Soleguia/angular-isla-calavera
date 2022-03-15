import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameDataEntity } from '../model/game-data-entity';
import { PlayerEntity } from '../model/player-entity';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss']
})
export class PointsComponent implements OnInit {

  playersData:PlayerEntity[] = [];
  playersData$:Observable<PlayerEntity[]>;
  gameData:GameDataEntity;
  gameData$:Observable<GameDataEntity>;
  currentPlayer:number

  constructor( private data:DataService ) {
    this.gameData = this.data.gameData;
  }

  ngOnInit(): void {
    this.playersData$ = this.data.getPlayers$();
    this.playersData$.subscribe(playersData => this.playersData = playersData);

    this.gameData$ = this.data.getGameData$();
    this.gameData$.subscribe(gameData => this.gameData = gameData);

  }


}
