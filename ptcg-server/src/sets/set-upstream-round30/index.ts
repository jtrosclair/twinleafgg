import { Card } from '../../game/store/card/card';
import { Round30ManaphyP6, Round30PachirisuP6, Round30RioluP6, Round30StaraviaP6, Round30BunearyP6, Round30PiplupP6, Round30StarlyP6, Round30TurtwigP6 } from '../set-pop-series-6/other-prints';

import { DelibirdP7, StantlerP7, MareepP7 } from '../set-pop-series-7/other-prints';

// Register after existing cards so legacy unnumbered fallbacks are unchanged.
export const setZzUpstreamRound30: Card[] = [
  new Round30ManaphyP6(),
  new Round30PachirisuP6(),
  new Round30RioluP6(),
  new Round30StaraviaP6(),
  new Round30BunearyP6(),
  new Round30PiplupP6(),
  new Round30StarlyP6(),
  new Round30TurtwigP6(),
  new DelibirdP7(),
  new StantlerP7(),
  new MareepP7(),
];
