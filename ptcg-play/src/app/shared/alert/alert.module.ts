import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';

@NgModule({
  imports: [MatSnackBarModule],
  providers: [AlertService]
})
export class AlertModule { }
