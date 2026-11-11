import { Yanmega } from './yanmega';
import { Probopass } from './probopass';
import { NightMaintenance } from './night-maintenance';
import { Luxray } from './luxray';
import { Lucario } from './lucario';
import { Heatran } from './heatran';
import { CarnivineP8, LuxioP8, CroagunkP8, HappinyP8, PiplupP8 } from './other-prints';
import { Card } from '../../game/store/card/card';
import { Riolu } from './riolu';

export const setPOPSeries8: Card[] = [
  new Riolu(),
  new CarnivineP8(),
  new LuxioP8(),
  new CroagunkP8(),
  new HappinyP8(),
  new PiplupP8(),
  new Heatran(),
  new Lucario(),
  new Luxray(),
  new NightMaintenance(),
  new Probopass(),
  new Yanmega(),
];
