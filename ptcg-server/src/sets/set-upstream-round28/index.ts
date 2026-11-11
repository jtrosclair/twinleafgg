import { Card } from '../../game/store/card/card';
import { Round28HaunterAR42 } from '../set-arceus/haunter2';
import { Round28BunearyDP73 } from '../set-diamond-and-pearl/buneary';
import { Round28GlaceonMD20 } from '../set-majestic-dawn/glaceon2';
import { Round28ShellosEastSeaMD73 } from '../set-majestic-dawn/shellos-east-sea';
import { Round28VulpixMT107 } from '../set-mysterious-treasures/vulpix';
import { Round28CharmanderSW82 } from '../set-secret-wonders/charmander';
import { Round28StaraviaSF52 } from '../set-stormfront/staravia';
import { Round28SpinarakHS83 } from '../set-heartgold-and-soulsilver/spinarak';
import { Round28BuizelUL45 } from '../set-unleashed/buizel';
import { Round28EeveeP313 } from '../set-pop-series-3/eevee';
import { Round28PikachuP413 } from '../set-pop-series-4/pikachu';

import { Round28BurmySandyCloakMD54 } from '../set-majestic-dawn/burmy-sandy-cloak';
import { Round28PonytaSF71 } from '../set-stormfront/ponyta';
import { Round28SnoverSF74 } from '../set-stormfront/snover';
import { Round28SwabluGE86 } from '../set-great-encounters/swablu';
import { Round28SandshrewHS79 } from '../set-heartgold-and-soulsilver/sandshrew';

import { Round28BeldumSV90 } from '../set-supreme-victors/beldum';
import { Round28PoliwagUL58 } from '../set-unleashed/poliwag';

// Register after established cards to preserve historical fallback priority.
export const setZzUpstreamRound28: Card[] = [
  new Round28HaunterAR42(),
  new Round28BunearyDP73(),
  new Round28GlaceonMD20(),
  new Round28ShellosEastSeaMD73(),
  new Round28VulpixMT107(),
  new Round28CharmanderSW82(),
  new Round28StaraviaSF52(),
  new Round28SpinarakHS83(),
  new Round28BuizelUL45(),
  new Round28EeveeP313(),
  new Round28PikachuP413(),
  new Round28BurmySandyCloakMD54(),
  new Round28PonytaSF71(),
  new Round28SnoverSF74(),
  new Round28SwabluGE86(),
  new Round28SandshrewHS79(),
  new Round28BeldumSV90(),
  new Round28PoliwagUL58(),
];
