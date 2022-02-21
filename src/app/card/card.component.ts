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
  data:DataService;
  cards:CardService;


  constructor(dataService:DataService, cardsData:CardService) {
    this.data = dataService;
    this.cards = cardsData;
  }

  @Input()
  showCard:CardEntity;

  ngOnInit(): void {
  }


}
