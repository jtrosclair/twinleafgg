import { Wobbuffet } from './wobbuffet';
import { Squirtle } from './squirtle';
import { Mew } from './mew';
import { Flygon } from './flygon';
import { Deoxys } from './deoxys';
import { Combusken } from './combusken';
import { Chimecho } from './chimecho';
import { Card } from '../../game/store/card/card';
import { Deoxysex } from './deoxys-ex';
import { PokemonFanClub } from './pokemon-fan-club';

// Other prints
import { SceptileP4 } from './other-prints';

export const setPOPSeries4: Card[] = [
  new Deoxysex(),
  new PokemonFanClub(),

  // Other prints
  new SceptileP4(),
  new Chimecho(),
  new Combusken(),
  new Deoxys(),
  new Flygon(),
  new Mew(),
  new Squirtle(),
  new Wobbuffet(),
];
