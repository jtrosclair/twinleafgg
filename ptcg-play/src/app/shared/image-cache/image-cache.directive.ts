import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { SimulatorAssetsService } from '../services/simulator-assets.service';

@Directive({ selector: '[ptcgImageCache]', host: { loading: 'lazy', decoding: 'async' } })
export class ImageCacheDirective {
  @HostBinding('attr.src') public url: string | SafeUrl = '';
  constructor(private assets: SimulatorAssetsService) { }
  @Input('ptcgImageCache') set src(value: string) { this.url = this.assets.imageSource(value || ''); }
  @HostListener('error', ['$event.target']) onError(image: HTMLImageElement): void {
    this.assets.fallbackImage(image);
    this.url = this.assets.imageSource(image.getAttribute('src') || image.src);
  }
}
