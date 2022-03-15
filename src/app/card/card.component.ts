import { Component, Input, OnInit } from '@angular/core';
import { CardEntity } from '../model/card-entity';
import { CardService } from '../services/card.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor( private data:DataService, private cards:CardService) {
  }

  @Input()
  showCard:CardEntity;

  ngOnInit(): void {
  }


}
