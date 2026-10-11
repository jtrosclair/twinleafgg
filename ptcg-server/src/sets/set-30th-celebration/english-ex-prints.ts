import { Mewtwoex } from './mewtwo-ex';
import { Mewex } from './mew-ex';

// https://api.tcgdex.net/v2/en/cards/30th-064 and /30th-066.
// Identical printed text to the existing M6a implementations; additive identities.
export class EnglishMewtwoEx64 extends Mewtwoex {
  public set = '30C';
  public setNumber = '64';
  public usSetNumber = '30C 64';
  public fullName = 'Mewtwo ex 30C 64';
}

export class EnglishMewEx66 extends Mewex {
  public set = '30C';
  public setNumber = '66';
  public usSetNumber = '30C 66';
  public fullName = 'Mew ex 30C 66';
}

export const english30CExPrints = [new EnglishMewtwoEx64(), new EnglishMewEx66()];
