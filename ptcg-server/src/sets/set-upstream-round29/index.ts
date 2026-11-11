import { Card } from '../../game/store/card/card';
import { Round29TurtwigDPP1 } from '../set-diamond-and-pearl-promos/turtwig';
import { Round29PachirisuDPP4 } from '../set-diamond-and-pearl-promos/pachirisu';
import { Round29BunearyDPP6 } from '../set-diamond-and-pearl-promos/buneary';
import { Round29BuizelDPP13 } from '../set-diamond-and-pearl-promos/buizel';
import { Round29ChatotDPP14 } from '../set-diamond-and-pearl-promos/chatot';
import { Round29ShinxDPP15 } from '../set-diamond-and-pearl-promos/shinx';

import { Round29BeldumUL44 } from '../set-unleashed/beldum';

// Deliberately register after existing cards to preserve legacy fallbacks.
export const setZzUpstreamRound29: Card[] = [
  new Round29TurtwigDPP1(),
  new Round29PachirisuDPP4(),
  new Round29BunearyDPP6(),
  new Round29BuizelDPP13(),
  new Round29ChatotDPP14(),
  new Round29ShinxDPP15(),
  new Round29BeldumUL44(),
];
