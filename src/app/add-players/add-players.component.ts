import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.scss']
})
export class AddPlayersComponent {
  data:DataService;
  newName = '';
  addPlayerButtonDisabled:boolean = true;
  private utils:UtilsService;

  constructor( utilsService: UtilsService, dataService:DataService ){
    this.utils = utilsService;
    this.data = dataService;
  }

  addPlayer( name:string ):void {
    if( name.length < 2){
      name = 'Player-' + this.data.players.length + this.utils.getRandom(1, 100).toFixed(0);
    }
    this.data.addPlayer( name );
    this.newName = '';
  }

}
