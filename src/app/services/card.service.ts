import { Injectable } from '@angular/core';
import { CardEntity } from '../model/card-entity';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private utils:UtilsService;
  private cardsDeck:string[] = [];
  public currentCard:CardEntity;
  private path = 'assets/cards/';
  public cardDefault = {
    id: 'default',
    amount: 0,
    name: 'Welcome to Skull Island',
    face: [this.path+'island-map.svg'],
    description: "Let's play!",
    class: 'card--default'
  };
  private cardsFaces = [
    {
      id: 'coin',
      amount: 4,
      name: 'Coin',
      face: [this.path+'coin.svg'],
      description: 'Counts as an additional Coin. If you hold 9 coins (8 dice-coin + this one) automatically win the game.',
      class: 'card--coin'
    },
    {
      id: 'diamond',
      amount: 4,
      name: 'Diamond',
      face: [this.path+'diamond.svg'],
      description: 'Counts as an additional Diamond. If you hold 9 diamonds (8 dice-diamond + this one) automatically win the game.',
      class: 'card--diamond'
    },
    {
      id: 'skull',
      amount: 3,
      name: 'Skull',
      face: [this.path+'skull.svg'],
      description: 'Counts as an additional Skull.',
      class: 'card--skull'
    },
    {
      id: 'double-skull',
      amount: 2,
      name: 'Double Skull',
      face: [this.path+'skull.svg', this.path+'skull.svg'],
      description: 'Counts as 2 additional Skulls.',
      class: 'card--double-skull'
    },
    {
      id: 'treasure',
      amount: 4,
      name: 'Treasure',
      face: [this.path+'treasure.svg'],
      description: 'You can keep any number of dice here. You still get the points even getting 3 or more skulls.',
      class: 'card--treasure'
    },
    {
      id: 'sorceress',
      amount: 4,
      name: 'Sorceress',
      face: [this.path+'sorceress.svg'],
      description: 'Allows you rerolling 1 Skull.',
      class: 'card--sorceress'
    },
    {
      id: 'pirate',
      amount: 4,
      name: 'Pirate',
      face: [this.path+'pirate.svg'],
      description: 'Double your points this turn.',
      class: 'card--pirate'
    },
    {
      id: 'monkey-parrot',
      amount: 4,
      name: 'Monkeys & Parrots',
      face: [this.path+'monkey.svg',this.path+'parrot.svg'],
      description: 'Monkeys & Parrots counts as same type. (Ex. 2 monkeys + 2 parrots is the same as 4 "monkey/parrots" = 200 points.)',
      class: 'card--monkey-parrot'
    },
    {
      id: 'ship-2',
      amount: 2,
      name: 'Pirate Ship 2',
      face: [this.path+'ship.svg',this.path+'swords.svg',this.path+'swords.svg'],
      description: "You need 2 dice-swords in order to gain points and receive 300 extra points. If you don't gather at least that amount of swords, you lose 300 points.",
      class: 'card--ship-2'
    },
    {
      id: 'ship-3',
      amount: 2,
      name: 'Pirate Ship 3',
      face: [this.path+'ship.svg',this.path+'swords.svg',this.path+'swords.svg',this.path+'swords.svg'],
      description: "You need 3 dice-swords in order to gain points and receive 500 extra points. If you don't gather at least that amount of swords, you lose 500 points.",
      class: 'card--ship-3'
    },
    {
      id: 'ship-4',
      amount: 2,
      name: 'Pirate Ship 4',
      face: [this.path+'ship.svg',this.path+'swords.svg',this.path+'swords.svg',this.path+'swords.svg',this.path+'swords.svg'],
      description: "You need 4 dice-swords in order to gain points and receive 1000 extra points. If you don't gather at least that amount of swords, you lose 1000 points.",
      class: 'card--ship-4'
    }
  ];

  constructor(utilsService:UtilsService) {
    this.utils = utilsService;
    this.cardsDeck = this.setCardsDeck();
    this.currentCard = this.cardsFaces[0];
  }

  getCard():any{
    let card:number = parseInt( this.utils.getRandom(0, this.cardsDeck.length).toFixed(0) );
    return this.cardsFaces.find( face => face.id == this.cardsDeck[card] );
  }

  resetCard(){
    this.currentCard = this.getCard();
  }

  setCardsDeck() {
    let deck:string[] = [];
    this.cardsFaces.forEach( card => {
      for( let c = 0; c < card.amount; c++ ){
        deck = [ ...deck, card.id ];
      }
    });
    return deck;
  }

}
