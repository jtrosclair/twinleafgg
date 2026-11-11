import { CardType } from '../../game/store/card/card-types';
import { Makuhita } from '../set-mega-evolution/makuhita';
import { Chikorita } from '../set-mega-evolution/chikorita';
import { Charmeleon } from '../set-phantasmal-flames/charmeleon';

export class Round31MakuhitaMEP extends Makuhita {
  public set = 'MEP'; public setNumber = '68'; public fullName = 'Makuhita MEP';
}
export class Round31ChikoritaMEP extends Chikorita {
  public set = 'MEP'; public setNumber = '69'; public fullName = 'Chikorita MEP';
  constructor() { super(); (this.attacks[0].cost as CardType[]).splice(0, 1, CardType.GRASS); }
}
export class Round31CharmeleonMEP extends Charmeleon {
  public set = 'MEP'; public setNumber = '79'; public fullName = 'Charmeleon MEP'; public hp = 110;
}
