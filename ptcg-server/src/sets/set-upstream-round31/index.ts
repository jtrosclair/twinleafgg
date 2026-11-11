import { Card } from '../../game/store/card/card';
import { Round31MakuhitaMEP, Round31ChikoritaMEP, Round31CharmeleonMEP } from '../set-mega-evolution-promos/round31-prints';

import { HighPressureSystemP3, LowPressureSystemP3 } from '../set-pop-series-3/round31-prints';

// Keep new print variants last so existing unnumbered fallbacks stay stable.
export const setZzUpstreamRound31: Card[] = [
  new Round31MakuhitaMEP(), new Round31ChikoritaMEP(), new Round31CharmeleonMEP(),
  new HighPressureSystemP3(), new LowPressureSystemP3()
];
