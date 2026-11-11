import { DoubleRainbowEnergyP5, BoostEnergyP5 } from './other-prints';
import { Pikachu } from './pikachu';
import { Pelipper } from './pelipper';
import { Meowth } from './meowth';
import { Lugia } from './lugia';
import { HoOh } from './ho-oh';
import { Card } from '../../game/store/card/card';
import { EspeonStar } from './espeon-star';
import { Mew } from './mew';
import { UmbreonStar } from './umbreon-star';

export const setPOPSeries5: Card[] = [
  new EspeonStar(),
  new Mew(),
  new UmbreonStar(),
  new HoOh(),
  new Lugia(),
  new Meowth(),
  new Pelipper(),
  new Pikachu(),
  new DoubleRainbowEnergyP5(),
  new BoostEnergyP5(),
];
