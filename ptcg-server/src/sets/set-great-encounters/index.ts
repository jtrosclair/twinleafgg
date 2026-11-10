import { Glameow } from './glameow';
import { Feebas } from './feebas';
import { Arbok } from './arbok';
import { Cacturne } from './cacturne';
import { Hariyama } from './hariyama';
import { Delibird } from './delibird';
import { Clamperl } from './clamperl';
import { Togepi } from './togepi';
import { Drowzee } from './drowzee';
import { Ekans } from './ekans';
import { Slugma } from './slugma';
import { Snubbull } from './snubbull';
import { Torchic } from './torchic';
import { Wingull } from './wingull';
import { Krabby } from './krabby';
import { Mudkip } from './mudkip';
import { Mankey } from './mankey';
import { Zangoose } from './zangoose';
import { Togetic } from './togetic';
import { LeftoversGE } from './other-prints';
import { Card } from '../../game/store/card/card';
import { Baltoy } from './baltoy';
import { Beedrill } from './beedrill';
import { Buizel } from './buizel';
import { Claydol } from './claydol';
import { DialgaLVX } from './dialga-lv-x';
import { FelicitysDrawing } from './felicitys-drawing';
import { Floatzel } from './floatzel';
import { Illumise } from './illumise';
import { MoonlightStadium } from './moonlight-stadium';
import { Porygon } from './porygon';
import { PremierBall } from './premier-ball';
import { UnownG } from './unown-g';
import { Volbeat } from './volbeat';
import { Weedle } from './weedle';

// Other prints
import { RareCandyGE } from './other-prints';

export const setGreatEncounters: Card[] = [
  new Glameow(),
  new Feebas(),
  new Arbok(),
  new Cacturne(),
  new Hariyama(),
  new Delibird(),

  new Clamperl(), new Togepi(),
  new Drowzee(),
  new Ekans(),
  new Slugma(),
  new Snubbull(),
  new Torchic(),
  new Wingull(),
  new Krabby(),
  new Mudkip(),
  new Mankey(),
  new Zangoose(),
  new Togetic(),

  new Beedrill(),
  new Buizel(),
  new Floatzel(),
  new Baltoy(),
  new Claydol(),
  new DialgaLVX(),
  new FelicitysDrawing(),
  new Illumise(),
  new MoonlightStadium(),
  new Porygon(),
  new PremierBall(),
  new UnownG(),
  new Volbeat(),
  new Weedle(),

  // Other prints
  new RareCandyGE(),
  new LeftoversGE(),
];
