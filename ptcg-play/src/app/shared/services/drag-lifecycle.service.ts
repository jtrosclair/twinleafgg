import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { DRAG_DROP_MANAGER } from '@ng-dnd/core';

interface DragLifecycleManager {
  getMonitor(): { isDragging(): boolean };
  getActions(): { endDrag(): void };
  getBackend(): { teardown(): void; setup(): void };
}

@Injectable({ providedIn: 'root' })
export class DragLifecycleService implements OnDestroy {
  private readonly removeListeners: Array<() => void> = [];

  private readonly cancelDrag = (): void => {
    if (this.manager.getMonitor().isDragging()) {
      // An interrupted gesture is never a drop. Ending it also clears the
      // preview, source placeholder and the hand's local dragging flag.
      this.zone.run(() => {
        // Clear backend gesture bookkeeping and its source-removal observer,
        // which would otherwise resurrect a card removed after cancellation.
        const backend = this.manager.getBackend();
        backend.teardown();
        backend.setup();
        this.manager.getActions().endDrag();
      });
    }
  };

  constructor(
    @Inject(DRAG_DROP_MANAGER) private manager: DragLifecycleManager,
    @Inject(DOCUMENT) document: Document,
    private zone: NgZone
  ) {
    for (const event of ['touchcancel', 'pointercancel']) {
      this.listen(document, event, true);
    }
    this.listen(document, 'visibilitychange');
    const window = document.defaultView;
    if (window) {
      // Resume signals also recover a WebView suspended before it could
      // deliver the cancellation/background event.
      for (const event of ['blur', 'pagehide', 'focus', 'pageshow']) {
        this.listen(window, event);
      }
    }
  }

  private listen(target: EventTarget, event: string, capture = false): void {
    target.addEventListener(event, this.cancelDrag, capture);
    this.removeListeners.push(() => target.removeEventListener(event, this.cancelDrag, capture));
  }

  ngOnDestroy(): void {
    this.removeListeners.forEach(remove => remove());
  }
}
