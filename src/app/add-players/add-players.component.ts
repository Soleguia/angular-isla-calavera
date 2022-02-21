import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.scss']
})
export class AddPlayersComponent {

  data:DataService;
  newName = '';
  addPlayerButtonDisabled:boolean = true;

  constructor( dataService:DataService ){
    this.data = dataService;
  }

  addPlayer( name:string ):void {
    if( name.length < 2){
      name = 'Player-' + this.data.players.length + this.data.getRandom(1, 100).toFixed(0);
    }
    this.data.addPlayer( name );
    this.newName = '';
  }

}
