import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DndModule } from '@ng-dnd/core';
import { DndMultiBackendModule } from '@ng-dnd/multi-backend';
import { DndSortableModule } from '@ng-dnd/sortable';
import { TranslateModule } from '@ngx-translate/core';
import { AlertModule } from './alert/alert.module';
import { BadgeModule } from './badge/badge.module';
import { CardsModule } from './cards/cards.module';
import { ContentComponent } from './content/content.component';
import { ImageCacheModule } from './image-cache/image-cache.module';
import { MaterialModule } from './material.module';
import { SidebarContainerComponent } from './sidebar/sidebar-container.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule,
    AlertModule, BadgeModule, CardsModule, ImageCacheModule, MaterialModule,
    DndModule, DndMultiBackendModule, DndSortableModule, TranslateModule
  ],
  declarations: [ContentComponent, SidebarContainerComponent],
  exports: [
    CommonModule, FormsModule, RouterModule,
    AlertModule, BadgeModule, CardsModule, ImageCacheModule, MaterialModule,
    DndModule, DndMultiBackendModule, DndSortableModule, TranslateModule,
    ContentComponent, SidebarContainerComponent
  ]
})
export class SharedModule { }
