import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  data:DataService;
  showContent:string = '';

  constructor( dataService:DataService ){
    this.data = dataService;
  }

  initIC(show:string):void {
    this.data.setShowContent(show);
    this.showContent = this.data.getShowContent();
  }

}
