import { Whiscash } from './whiscash';
import { Walrein } from './walrein';
import { Vigoroth } from './vigoroth';
import { Uxie } from './uxie';
import { Ursaring } from './ursaring';
import { UnownT } from './unown-t';
import { UnownM } from './unown-m';
import { UnownI } from './unown-i';
import { Tyranitar } from './tyranitar';
import { Typhlosion } from './typhlosion';
import { Tropius } from './tropius';
import { Toxicroak } from './toxicroak';
import { Surskit } from './surskit';
import { Sudowoodo } from './sudowoodo';
import { Spheal } from './spheal';
import { Slaking } from './slaking';
import { SkullFossil } from './skull-fossil';
import { Shinx } from './shinx';
import { Shieldon } from './shieldon';
import { Sealeo } from './sealeo';
import { Sandslash } from './sandslash';
import { Sandshrew } from './sandshrew';
import { Remoraid } from './remoraid';
import { Rampardos } from './rampardos';
import { Raichu } from './raichu';
import { Quilava } from './quilava';
import { Pupitar } from './pupitar';
import { Pikachu } from './pikachu';
import { Pichu } from './pichu';
import { Parasect } from './parasect';
import { Octillery } from './octillery';
import { Ninetales } from './ninetales';
import { Nidoqueen } from './nidoqueen';
import { MrMime } from './mr-mime';
import { Meganium } from './meganium';
import { Masquerain } from './masquerain';
import { Mantine } from './mantine';
import { Manectric } from './manectric';
import { Magmortar } from './magmortar';
import { MagmortarLVX } from './magmortar-lvx';
import { Magmar } from './magmar';
import { Magby } from './magby';
import { Lumineon } from './lumineon';
import { Larvitar } from './larvitar';
import { LakeBoundary } from './lake-boundary';
import { Lairon } from './lairon';
import { Honchkrow } from './honchkrow';
import { Happiny } from './happiny';
import { Gyarados } from './gyarados';
import { Graveler } from './graveler';
import { Glalie } from './glalie';
import { Geodude } from './geodude';
import { FossilExcavator } from './fossil-excavator';
import { Feraligatr } from './feraligatr';
import { Exeggutor } from './exeggutor';
import { Exeggcute } from './exeggcute';
import { Electrike } from './electrike';
import { ElectivireLVX } from './electivire-lvx';
import { Dodrio } from './dodrio';
import { Dewgong } from './dewgong';
import { Crobat } from './crobat';
import { Croagunk } from './croagunk';
import { Cranidos } from './cranidos';
import { Chingling } from './chingling';
import { Celebi } from './celebi';
import { Buizel } from './buizel';
import { Bronzong } from './bronzong';
import { Blissey } from './blissey';
import { Bastiodon } from './bastiodon';
import { Barboach } from './barboach';
import { ArmorFossil } from './armor-fossil';
import { Ariados } from './ariados';
import { Ambipom } from './ambipom';
import { Alakazam } from './alakazam';
import { Aipom } from './aipom';
import { Aggron } from './aggron';
import { Abra } from './abra';
import { Abomasnow } from './abomasnow';
import { LucarioLVX } from './lucario-lvx';
import { Murkrow } from './murkrow';
import { Dunsparce } from './dunsparce';
import { Bayleef } from './bayleef';
import { Kricketune } from './kricketune';
import { Spinarak } from './spinarak';
import { Chimecho } from './chimecho';
import { Girafarig } from './girafarig';
import { Kricketot } from './kricketot';
import { Nidoran } from './nidoran';
import { Teddiursa } from './teddiursa';
import { Magikarp } from './magikarp';
import { Doduo } from './doduo';
import { Finneon } from './finneon';
import { Snover } from './snover';
import { Slakoth } from './slakoth';
import { Zubat } from './zubat';
import { Snorunt } from './snorunt';
import { Chikorita } from './chikorita';
import { Paras } from './paras';
import { Seel } from './seel';
import { Aron } from './aron';
import { Bronzor } from './bronzor';
import { Cyndaquil } from './cyndaquil';
import { Gible } from './gible';
import { Golbat } from './golbat';
import { DuskBallMT, QuickBallMT, DarknessEnergySpecialMT, MetalEnergyN1MT } from './other-prints';
import { Card } from '../../game/store/card/card';
import { Azelf } from './azelf';
import { BebesSearch } from './bebes-search';
import { Chansey } from './chansey';
import { Croconaw } from './croconaw';
import { Gabite } from './gabite';
import { Garchomp } from './garchomp';
import { Mesprit } from './mesprit';
import { Nidorina } from './nidorina';
import { UnownE } from './unown-e';
import { TeamGalacticsWager } from './team-galactics-wager';
import { TimeSpaceDistortion } from './time-space-distortion';
import { Totodile } from './totodile';

// Other prints
import {
  MultiEnergyMT,
  NightMaintenanceMT
} from './other-prints';

export const setMysteriousTreasures: Card[] = [
  new Murkrow(),
  new Dunsparce(),
  new Bayleef(),
  new Kricketune(),
  new Spinarak(),

  new Chimecho(),
  new Girafarig(), new Kricketot(), new Nidoran(),
  new Teddiursa(),
  new Magikarp(),
  new Doduo(),
  new Finneon(),
  new Snover(),
  new Slakoth(),

  new Zubat(),
  new Snorunt(),
  new Chikorita(),
  new Paras(),
  new Seel(),

  new Aron(),
  new Bronzor(),
  new Cyndaquil(),
  new Gible(),
  new Golbat(),

  new Azelf(),
  new BebesSearch(),
  new Chansey(),
  new Croconaw(),
  new Gabite(),
  new Garchomp(),
  new Mesprit(),
  new Nidorina(),
  new UnownE(),
  new TeamGalacticsWager(),
  new TimeSpaceDistortion(),
  new Totodile(),

  // Other prints
  new MultiEnergyMT(),
  new NightMaintenanceMT(),
  new DuskBallMT(),
  new QuickBallMT(),
  new DarknessEnergySpecialMT(),
  new MetalEnergyN1MT(),
  new LucarioLVX(),
  new Abomasnow(),
  new Abra(),
  new Aggron(),
  new Aipom(),
  new Alakazam(),
  new Ambipom(),
  new Ariados(),
  new ArmorFossil(),
  new Barboach(),
  new Bastiodon(),
  new Blissey(),
  new Bronzong(),
  new Buizel(),
  new Celebi(),
  new Chingling(),
  new Cranidos(),
  new Croagunk(),
  new Crobat(),
  new Dewgong(),
  new Dodrio(),
  new ElectivireLVX(),
  new Electrike(),
  new Exeggcute(),
  new Exeggutor(),
  new Feraligatr(),
  new FossilExcavator(),
  new Geodude(),
  new Glalie(),
  new Graveler(),
  new Gyarados(),
  new Happiny(),
  new Honchkrow(),
  new Lairon(),
  new LakeBoundary(),
  new Larvitar(),
  new Lumineon(),
  new Magby(),
  new Magmar(),
  new MagmortarLVX(),
  new Magmortar(),
  new Manectric(),
  new Mantine(),
  new Masquerain(),
  new Meganium(),
  new MrMime(),
  new Nidoqueen(),
  new Ninetales(),
  new Octillery(),
  new Parasect(),
  new Pichu(),
  new Pikachu(),
  new Pupitar(),
  new Quilava(),
  new Raichu(),
  new Rampardos(),
  new Remoraid(),
  new Sandshrew(),
  new Sandslash(),
  new Sealeo(),
  new Shieldon(),
  new Shinx(),
  new SkullFossil(),
  new Slaking(),
  new Spheal(),
  new Sudowoodo(),
  new Surskit(),
  new Toxicroak(),
  new Tropius(),
  new Typhlosion(),
  new Tyranitar(),
  new UnownI(),
  new UnownM(),
  new UnownT(),
  new Ursaring(),
  new Uxie(),
  new Vigoroth(),
  new Walrein(),
  new Whiscash(),
];
