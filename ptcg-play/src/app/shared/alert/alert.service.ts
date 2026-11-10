import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/** The simulator reports rejected actions without interrupting the board. */
@Injectable()
export class AlertService {
  constructor(private snackBar: MatSnackBar) { }

  public toast(message: string, duration: number = 3000): void {
    this.snackBar.open(message, '', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['toast-offset']
    });
  }
}
