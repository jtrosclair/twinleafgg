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
];
