import { PowerType } from '../../game/store/card/pokemon-types';
import { Phantump } from './phantump';

export class PhantumpBatch172 extends Phantump {
  public powers = [
    {
      name: 'Spiteful Evolution',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: "Once during your turn, you may use this Ability. Choose a card in your hand that evolves from this Pokémon and put it onto this Pokémon to evolve it. If you do, place 2 damage counters on the Pokémon you evolved in this way. You can't use this Ability during your first turn.",
    },
  ];

  public set = 'CRI';
  public setNumber = '38';
  public fullName = 'Phantump M4 38';
}
