import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.scss']
})
export class AddPlayersComponent {
  newName = '';
  addPlayerButtonDisabled:boolean = true;

  constructor( private utils:UtilsService, private data:DataService ){}

  addPlayer( name:string ):void {
    if( name.length < 2){
      name = 'Player-' + this.data.players.length + this.utils.getRandom(1, 100).toFixed(0);
    }
    this.data.addPlayer( name );
    this.newName = '';
  }

}
