import { Zigzagoon } from './zigzagoon';
import { Wigglytuff } from './wigglytuff';
import { Whismur } from './whismur';
import { Weezing } from './weezing';
import { Wailord } from './wailord';
import { Wailmer } from './wailmer';
import { UnownL } from './unown-l';
import { UnownH } from './unown-h';
import { UnownF } from './unown-f';
import { Treecko } from './treecko';
import { Togekiss } from './togekiss';
import { Tangrowth } from './tangrowth';
import { Tangela } from './tangela';
import { Swampert } from './swampert';
import { Solrock } from './solrock';
import { Slowpoke } from './slowpoke';
import { Slowking } from './slowking';
import { Slowbro } from './slowbro';
import { Skarmory } from './skarmory';
import { Seviper } from './seviper';
import { Sceptile } from './sceptile';
import { Rotom } from './rotom';
import { Relicanth } from './relicanth';
import { Purugly } from './purugly';
import { Primeape } from './primeape';
import { Porygon2 } from './porygon2';
import { PorygonZ } from './porygon-z';
import { Pelipper } from './pelipper';
import { Pachirisu } from './pachirisu';
import { Milotic } from './milotic';
import { Metapod } from './metapod';
import { Mawile } from './mawile';
import { Marshtomp } from './marshtomp';
import { Makuhita } from './makuhita';
import { Magcargo } from './magcargo';
import { Luvdisc } from './luvdisc';
import { Lunatone } from './lunatone';
import { Loudred } from './loudred';
import { Linoone } from './linoone';
import { Latios } from './latios';
import { Latias } from './latias';
import { Lapras } from './lapras';
import { Koffing } from './koffing';
import { Kingler } from './kingler';
import { Kakuna } from './kakuna';
import { Jigglypuff } from './jigglypuff';
import { Igglybuff } from './igglybuff';
import { Hypno } from './hypno';
import { Huntail } from './huntail';
import { Houndour } from './houndour';
import { Houndoom } from './houndoom';
import { Grovyle } from './grovyle';
import { Granbull } from './granbull';
import { Gorebyss } from './gorebyss';
import { Exploud } from './exploud';
import { Dialga } from './dialga';
import { Palkia } from './palkia';
import { PalkiaLVX } from './palkia-lvx';
import { Darkrai2 } from './darkrai2';
import { Darkrai } from './darkrai';
import { DarkraiLVX } from './darkrai-lvx';
import { Cresselia } from './cresselia';
import { CresseliaLVX } from './cresselia-lvx';
import { Combusken } from './combusken';
import { Caterpie } from './caterpie';
import { Cacnea } from './cacnea';
import { Butterfree } from './butterfree';
import { Blaziken } from './blaziken';
import { AmuletCoin } from './amulet-coin';
import { Altaria } from './altaria';
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
  new Altaria(),
  new AmuletCoin(),
  new Blaziken(),
  new Butterfree(),
  new Cacnea(),
  new Caterpie(),
  new Combusken(),
  new CresseliaLVX(),
  new Cresselia(),
  new DarkraiLVX(),
  new Darkrai(),
  new Darkrai2(),
  new PalkiaLVX(),
  new Palkia(),
  new Dialga(),
  new Exploud(),
  new Gorebyss(),
  new Granbull(),
  new Grovyle(),
  new Houndoom(),
  new Houndour(),
  new Huntail(),
  new Hypno(),
  new Igglybuff(),
  new Jigglypuff(),
  new Kakuna(),
  new Kingler(),
  new Koffing(),
  new Lapras(),
  new Latias(),
  new Latios(),
  new Linoone(),
  new Loudred(),
  new Lunatone(),
  new Luvdisc(),
  new Magcargo(),
  new Makuhita(),
  new Marshtomp(),
  new Mawile(),
  new Metapod(),
  new Milotic(),
  new Pachirisu(),
  new Pelipper(),
  new PorygonZ(),
  new Porygon2(),
  new Primeape(),
  new Purugly(),
  new Relicanth(),
  new Rotom(),
  new Sceptile(),
  new Seviper(),
  new Skarmory(),
  new Slowbro(),
  new Slowking(),
  new Slowpoke(),
  new Solrock(),
  new Swampert(),
  new Tangela(),
  new Tangrowth(),
  new Togekiss(),
  new Treecko(),
  new UnownF(),
  new UnownH(),
  new UnownL(),
  new Wailmer(),
  new Wailord(),
  new Weezing(),
  new Whismur(),
  new Wigglytuff(),
  new Zigzagoon(),
];
