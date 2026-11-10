import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ptcg-board-zone-button',
  templateUrl: './board-zone-button.component.html',
  styleUrls: ['./board-zone-button.component.scss']
})
export class BoardZoneButtonComponent {
  @Input() label = '';
  @Input() count = 0;
  @Input() ariaLabel = '';
  @Input() countBelow = false;
  @Input() alignRight = false;
  @Output() zoneClick = new EventEmitter<void>();
}
