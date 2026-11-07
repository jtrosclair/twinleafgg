import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableComponent } from './table/table.component';
import { SandboxViewerComponent } from './sandbox-viewer/sandbox-viewer.component';

const routes: Routes = [
  { path: '', redirectTo: 'sandbox-viewer', pathMatch: 'full' },
  { path: 'table/:gameId', component: TableComponent },
  { path: 'sandbox-viewer', component: SandboxViewerComponent },
  { path: '**', redirectTo: 'sandbox-viewer' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
