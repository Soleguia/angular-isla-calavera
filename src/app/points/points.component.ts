import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerEntity } from '../model/player-entity';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss']
})
export class PointsComponent implements OnInit {

  data:DataService;
  playersData:PlayerEntity[] = [];
  playersData$:Observable<PlayerEntity[]>;
  currentPlayer:number

  constructor(dataService:DataService) {
    this.data = dataService
    this.currentPlayer = this.data.gameData.player;
  }

  ngOnInit(): void {
    this.playersData$ = this.data.getPlayers$();
    this.playersData$.subscribe(playersData => this.playersData = playersData);
  }


}
