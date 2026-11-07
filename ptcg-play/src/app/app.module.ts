import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DndModule } from '@ng-dnd/core';
import { DndMultiBackendModule, MultiBackend, HTML5ToTouch } from '@ng-dnd/multi-backend';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SIMULATOR_APP_BASE_HREF_PROVIDER } from './app-base-href';
import { CardsService } from './api/services/cards.service';
import { GameService } from './api/services/game.service';
import { LanguageService } from './shared/services/language.service';
import { StaticTranslateLoader } from './shared/services/static-translate.loader';
import { SharedModule } from './shared/shared.module';
import { TableModule } from './table/table.module';
import { SandboxViewerModule } from './sandbox-viewer/sandbox-viewer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, AppRoutingModule, SharedModule,
    SandboxViewerModule, TableModule, BrowserAnimationsModule,
    DndMultiBackendModule,
    DndModule.forRoot({ backend: MultiBackend, options: HTML5ToTouch }),
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: StaticTranslateLoader }
    })
  ],
  providers: [CardsService, GameService, SIMULATOR_APP_BASE_HREF_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(languageService: LanguageService) { languageService.chooseLanguage(); }
}

