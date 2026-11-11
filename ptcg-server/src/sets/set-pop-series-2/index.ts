import { Venusaur } from './venusaur';
import { Tauros } from './tauros';
import { Suicune } from './suicune';
import { Raikou } from './raikou';
import { PokemonPark } from './pokemon-park';
import { Pidgeot } from './pidgeot';
import { Luvdisc } from './luvdisc';
import { Entei } from './entei';
import { Cacnea } from './cacnea';
import { Card } from '../../game/store/card/card';
import { Celebiex } from './celebi-ex';

//Other prints
import { MrBrineysCompassionPS2 } from './other-prints';

export const setPOPSeries2: Card[] = [
  new Celebiex(),

  //Other prints
  new MrBrineysCompassionPS2(),
  new Cacnea(),
  new Entei(),
  new Luvdisc(),
  new Pidgeot(),
  new PokemonPark(),
  new Raikou(),
  new Suicune(),
  new Tauros(),
  new Venusaur(),
];
