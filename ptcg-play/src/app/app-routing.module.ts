import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanActivateService } from './can-activate.service';
import { TableComponent } from './table/table.component';
import { MaintenanceMessageComponent } from './maintenance/maintenance-message.component';
import { SandboxViewerComponent } from './sandbox-viewer/sandbox-viewer.component';

const routes: Routes = [
  { path: 'table/:gameId', component: TableComponent },
  { path: 'sandbox-viewer', component: SandboxViewerComponent },
  { path: 'maintenance', component: MaintenanceMessageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
