import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Marshadow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Shadowy Side Kick',
    cost: [F, F],
    damage: 60,
    text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = 'Marshadow';
  public fullName: string = 'Marshadow M1L';
  public regulationMark = 'I';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-lost-thunder/beautifly.ts (one-turn protection after lethal attack damage)
    if (WAS_ATTACK_USED(effect, 0, this)) effect.protectAttackerOnDamageKnockOut = true;
    return state;
  }
}
