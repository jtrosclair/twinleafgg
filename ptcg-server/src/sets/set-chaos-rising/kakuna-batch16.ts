import { Kakuna } from './kakuna';
import { PowerType } from '../../game/store/card/pokemon-types';

export class KakunaBatch172 extends Kakuna {
  public set: string = 'CRI';
  public usSetNumber: string | undefined = undefined;
  public fullName: string = 'Kakuna M4 2';
  public powers = [{
    name: 'Exoskeleton',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon takes 20 less damage from attacks (after applying Weakness and Resistance).',
  }];
}
