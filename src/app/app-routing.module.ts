import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  { 
    path: 'info', 
    component: InfoComponent 
  },
  { 
    path: 'game', 
    component: GameComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
