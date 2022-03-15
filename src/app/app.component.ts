import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  showContent:string = '';

  constructor( private data:DataService ){}

  initIC(show:string):void {
    this.data.setShowContent(show);
    this.showContent = this.data.getShowContent();
  }

}
