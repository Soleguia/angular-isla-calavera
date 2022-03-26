import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { PointsComponent } from './points/points.component';
import { GameComponent } from './game/game.component';
import { AddPlayersComponent } from './add-players/add-players.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameBoardComponent } from './game-board/game-board.component';
import { DiceComponent } from './dice/dice.component';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    PointsComponent,
    GameComponent,
    AddPlayersComponent,
    GameBoardComponent,
    DiceComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
