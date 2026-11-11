import { Card } from '../../game/store/card/card';
import { Round32BidoofMT } from '../set-mysterious-treasures/bidoof';
import { Round32TeamAquasSphealDCR } from '../set-double-crisis/team-aquas-spheal';
import { Round32GastlyMEW } from '../set-pokemon-151/gastly';
import { Round32HelioptileASC } from '../set-ascended-heroes/helioptile';
import { Round32PikachuASC } from '../set-ascended-heroes/pikachu';
import { Round32RolycolyASC } from '../set-ascended-heroes/rolycoly';
import { Round32SwirlixASC } from '../set-ascended-heroes/swirlix';
import { Round32VibravaPFL } from '../set-phantasmal-flames/vibrava';
import { Seaking } from '../set-jungle/seaking';

import { CrushingHammerFAPBL, EnergySwitchFAPBL } from '../set-pitch-black/round32-prints';

// Register newly reviewed prints after existing definitions to preserve fallback order.
export const setZzUpstreamRound32: Card[] = [
  new Round32BidoofMT(),
  new Round32TeamAquasSphealDCR(),
  new Round32GastlyMEW(),
  new Round32HelioptileASC(),
  new Round32PikachuASC(),
  new Round32RolycolyASC(),
  new Round32SwirlixASC(),
  new Round32VibravaPFL(),
  new Seaking(),
  new CrushingHammerFAPBL(),
  new EnergySwitchFAPBL(),
];
