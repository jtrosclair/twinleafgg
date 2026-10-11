import { Mewtwo } from './mewtwo';

// https://api.tcgdex.net/v2/en/cards/30th-063 — same printed attacks.
// Preserve Mewtwo 30C's legacy #64 identity for existing puzzles.
export class EnglishMewtwo63 extends Mewtwo {
  public setNumber = '63';
  public usSetNumber = '30C 63';
  public fullName = 'Mewtwo 30C 63';
}
