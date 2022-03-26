import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  gameOn:boolean = false;

  constructor( private data:DataService ){
    this.gameOn = this.data.gameOn;
  }

}
