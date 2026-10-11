import { Mew } from './mew';

// https://limitlesstcg.com/cards/30C/R, /G, /B: same Psychic text as #65.
export class EnglishMewR extends Mew {
  public setNumber = 'R';
  public usSetNumber = '30C R';
  public fullName = 'Mew 30C R';
}
export class EnglishMewG extends Mew {
  public setNumber = 'G';
  public usSetNumber = '30C G';
  public fullName = 'Mew 30C G';
}
export class EnglishMewB extends Mew {
  public setNumber = 'B';
  public usSetNumber = '30C B';
  public fullName = 'Mew 30C B';
}
export const english30CRgbPrints = [new EnglishMewR(), new EnglishMewG(), new EnglishMewB()];
