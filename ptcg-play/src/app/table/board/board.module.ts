import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BoardComponent } from './board.component';
import { BoardZoneButtonComponent } from './board-zone-button/board-zone-button.component';
import { BoardCardComponent } from './board-card/board-card.component';
import { SharedModule } from '../../shared/shared.module';
import { CardsModule } from 'src/app/shared/cards/cards.module';
import { BoardSelectionOverlayComponent } from './board-selection-overlay/board-selection-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    SharedModule,
    CardsModule
  ],
  declarations: [
    BoardComponent,
    BoardZoneButtonComponent,
    BoardCardComponent,
    BoardSelectionOverlayComponent
  ],
  exports: [
    BoardComponent,
    BoardCardComponent
  ]
})
export class BoardModule { }
