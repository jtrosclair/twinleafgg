import { Rampardos } from '../set-mysterious-treasures/rampardos';
import { Bastiodon as BastiodonBatch15 } from '../set-mysterious-treasures/bastiodon';
import { Turtwig as TurtwigBatch15 } from '../set-diamond-and-pearl/turtwig';
import { Starly as StarlyBatch15 } from '../set-diamond-and-pearl/starly';
import { Staravia as StaraviaBatch15 } from '../set-diamond-and-pearl/staravia';
import { Riolu as RioluBatch15 } from '../set-diamond-and-pearl/riolu';
import { Piplup as PiplupBatch15 } from '../set-diamond-and-pearl/piplup';
import { Pachirisu } from '../set-diamond-and-pearl/pachirisu';
import { Manaphy as ManaphyBatch15 } from '../set-diamond-and-pearl/manaphy';
import { Lucario as LucarioBatch15 } from '../set-diamond-and-pearl/lucario';
import { Drifloon } from '../set-diamond-and-pearl/drifloon';
import { Chimchar } from '../set-diamond-and-pearl/chimchar';
import { Cherubi } from '../set-diamond-and-pearl/cherubi';
import { Round28BunearyDP73 as Buneary } from '../set-diamond-and-pearl/buneary';
import { Bidoof } from '../set-diamond-and-pearl/bidoof';
import { Bastiodon } from '../set-mysterious-treasures/bastiodon';
import { Lucario } from '../set-diamond-and-pearl/lucario';
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

export class BastiodonP6 extends Bastiodon {
  public set: string = 'P6';
  public setNumber: string = '1';
  public fullName: string = 'Bastiodon P6';
}

export class LucarioP6 extends Lucario {
  public set: string = 'P6';
  public setNumber: string = '2';
  public fullName: string = 'Lucario P6';
}

export class RampardosP6 extends Rampardos {
  public set: string = 'P6';
  public setNumber: string = '5';
  public fullName: string = 'Rampardos P6';
}

export class DrifloonP6 extends Drifloon {
  public set: string = 'P6';
  public setNumber: string = '6';
  public fullName: string = 'Drifloon P6';
}

export class BidoofP6 extends Bidoof {
  public set: string = 'P6';
  public setNumber: string = '11';
  public fullName: string = 'Bidoof P6';
}

export class CherubiP6 extends Cherubi {
  public set: string = 'P6';
  public setNumber: string = '13';
  public fullName: string = 'Cherubi P6';
}

export class ChimcharP6 extends Chimchar {
  public set: string = 'P6';
  public setNumber: string = '14';
  public fullName: string = 'Chimchar P6';
}
