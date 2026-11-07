import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// MatInput/MatSelect export the form-field/option modules their templates need.
const modules = [MatButtonModule, MatDialogModule, MatInputModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule];

@NgModule({ imports: modules, exports: modules })
export class MaterialModule { }
