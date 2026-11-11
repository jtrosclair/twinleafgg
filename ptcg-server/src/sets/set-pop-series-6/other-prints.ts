import { Manaphy } from '../set-diamond-and-pearl/manaphy';
import { Round29PachirisuDPP4 } from '../set-diamond-and-pearl-promos/pachirisu';
import { Riolu } from '../set-diamond-and-pearl/riolu';
import { Staravia } from '../set-diamond-and-pearl/staravia';
import { Round28BunearyDP73 } from '../set-diamond-and-pearl/buneary';
import { Piplup } from '../set-diamond-and-pearl/piplup';
import { Starly } from '../set-diamond-and-pearl/starly';
import { Turtwig } from '../set-diamond-and-pearl/turtwig';

export class Round30ManaphyP6 extends Manaphy {
  public set: string = 'P6';
  public setNumber: string = '3';
  public fullName: string = 'Manaphy P6';
}

export class Round30PachirisuP6 extends Round29PachirisuDPP4 {
  public set: string = 'P6';
  public setNumber: string = '4';
  public fullName: string = 'Pachirisu P6';
}

export class Round30RioluP6 extends Riolu {
  public set: string = 'P6';
  public setNumber: string = '8';
  public fullName: string = 'Riolu P6';
}

export class Round30StaraviaP6 extends Staravia {
  public set: string = 'P6';
  public setNumber: string = '10';
  public fullName: string = 'Staravia P6';
}

export class Round30BunearyP6 extends Round28BunearyDP73 {
  public set: string = 'P6';
  public setNumber: string = '12';
  public fullName: string = 'Buneary P6';
}

export class Round30PiplupP6 extends Piplup {
  public set: string = 'P6';
  public setNumber: string = '15';
  public fullName: string = 'Piplup P6';
  constructor() {
    super();
    // Water Splash is printed 20+, while the older implementation has 10+.
    this.attacks = this.attacks.map((attack, index) => index === 1 ? { ...attack, damage: 20 } : attack);
  }
}

export class Round30StarlyP6 extends Starly {
  public set: string = 'P6';
  public setNumber: string = '16';
  public fullName: string = 'Starly P6';
}

export class Round30TurtwigP6 extends Turtwig {
  public set: string = 'P6';
  public setNumber: string = '17';
  public fullName: string = 'Turtwig P6';
}
