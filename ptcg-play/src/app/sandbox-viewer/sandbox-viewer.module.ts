import { NgModule } from '@angular/core';

import { SandboxViewerComponent } from './sandbox-viewer.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SandboxViewerComponent
  ],
  imports: [
    SharedModule
  ]
})
export class SandboxViewerModule { }
