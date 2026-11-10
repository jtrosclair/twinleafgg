import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndModule } from '@ng-dnd/core';
import { DndMultiBackendModule } from '@ng-dnd/multi-backend';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CardComponent } from './card/card.component';
import { CardImagePopupComponent } from './card-image-popup/card-image-popup.component';
import { CardInfoListPopupComponent } from './card-info-list-popup/card-info-list-popup.component';
import { CardInfoPaneComponent } from './card-info-pane/card-info-pane.component';
import { CardInfoPopupComponent } from './card-info-popup/card-info-popup.component';
import { CardListPaneComponent } from './card-list-pane/card-list-pane.component';
import { CardListPopupComponent } from './card-list-popup/card-list-popup.component';
import { DropHighlightDirective } from './drop-highlight/drop-highlight.directive';
import { EnergyComponent } from './energy/energy.component';
import { EnergyTextDirective } from './energy/energy-text.directive';
import { ImageCacheModule } from '../image-cache/image-cache.module';
import { MaterialModule } from '../material.module';
import { TrainerTypeComponent } from './trainer-type/trainer-type.component';
import { HoverHighlightComponent } from './hover-highlight/hover-highlight.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImageCacheModule,
    MaterialModule,
    DndMultiBackendModule,
    DndModule,
    TranslateModule,
    MatDialogModule
  ],
  declarations: [
    CardComponent,
    CardImagePopupComponent,
    CardInfoPaneComponent,
    CardInfoPopupComponent,
    CardListPaneComponent,
    CardListPopupComponent,
    EnergyComponent,
    EnergyTextDirective,
    DropHighlightDirective,
    TrainerTypeComponent,
    HoverHighlightComponent,
    CardInfoListPopupComponent,
  ],
  entryComponents: [
    CardImagePopupComponent,
    CardInfoPopupComponent,
    CardInfoListPopupComponent,
    CardListPopupComponent,
  ],
  exports: [
    CardComponent,
    EnergyComponent,
    DropHighlightDirective
  ]
})
export class CardsModule { }
