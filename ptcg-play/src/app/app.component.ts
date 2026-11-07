import { Component, ElementRef, HostListener } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { WebViewBridgeService } from './shared/services/webview-bridge.service';

@Component({
  selector: 'ptcg-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    themeService: ThemeService,
    webViewBridgeService: WebViewBridgeService
  ) {
    themeService.initialize();
    setTimeout(() => this.onResize());
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.elementRef.nativeElement.style.setProperty('--card-size', '60px');
  }
}
