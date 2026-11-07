import { Directive, ElementRef, Input, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SimulatorAssetsService } from '../../services/simulator-assets.service';

const symbols: { [code: string]: { name: string; url: string } } = {
  D: { name: 'darkness', url: 'assets/energy-icons/darkness.svg' },
  Y: { name: 'fairy', url: 'assets/energy-icons/fairy.svg' },
  F: { name: 'fighting', url: 'assets/energy-icons/fighting.svg' },
  R: { name: 'fire', url: 'assets/energy-icons/fire.svg' },
  G: { name: 'grass', url: 'assets/energy-icons/grass.svg' },
  L: { name: 'lightning', url: 'assets/energy-icons/lightning.svg' },
  M: { name: 'metal', url: 'assets/energy-icons/metal.svg' },
  P: { name: 'psychic', url: 'assets/energy-icons/psychic.svg' },
  C: { name: 'colorless', url: 'assets/energy-icons/colorless.svg' },
  W: { name: 'water', url: 'assets/energy-icons/water.svg' },
  N: { name: 'dragon', url: 'assets/energy-icons/dragon.svg' }
};

/** Sanitize card text normally, then insert only the bundled energy symbols.
 * SVG never requires trusting card HTML or a URL supplied by the snapshot. */
@Directive({ selector: '[ptcgEnergyText]' })
export class EnergyTextDirective {
  constructor(private element: ElementRef<HTMLElement>, private sanitizer: DomSanitizer,
    private assets: SimulatorAssetsService) { }

  @Input('ptcgEnergyText') set text(value: string) {
    const host = this.element.nativeElement;
    host.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, value || '') || '';
    const document = host.ownerDocument;
    const walker = document.createTreeWalker(host, 4); // SHOW_TEXT
    const nodes: Text[] = [];
    let node: Node;
    while ((node = walker.nextNode())) { nodes.push(node as Text); }
    for (const text of nodes) {
      const tokens = /\[([WFYRGLPMDCN])\]/g;
      let match: RegExpExecArray, offset = 0;
      const fragment = document.createDocumentFragment();
      while ((match = tokens.exec(text.data))) {
        fragment.appendChild(document.createTextNode(text.data.slice(offset, match.index)));
        const symbol = symbols[match[1]], image = document.createElement('img');
        image.width = 18;
        image.height = 18;
        image.alt = symbol.name + ' Energy';
        image.setAttribute('align', 'top');
        image.setAttribute('loading', 'lazy');
        image.setAttribute('decoding', 'async');
        image.addEventListener('error', () => this.assets.fallbackImage(image), { once: true });
        image.src = this.assets.resolve(symbol.url);
        fragment.appendChild(image);
        offset = match.index + match[0].length;
      }
      if (offset) {
        fragment.appendChild(document.createTextNode(text.data.slice(offset)));
        text.parentNode.replaceChild(fragment, text);
      }
    }
  }
}
