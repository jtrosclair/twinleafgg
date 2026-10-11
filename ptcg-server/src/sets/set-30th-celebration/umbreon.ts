import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../game/store/prefabs/prefabs';

export class Umbreon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public hp: number = 110;
  public cardType: CardType = CardType.DARK;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Retaliate',
    cost: [CardType.DARK],
    damage: 30,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 100 more damage.'
  },
  {
    name: 'Darkness Fang',
    cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
    damage: 100,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Umbreon';
  public fullName: string = 'Umbreon 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-lost-thunder/umbreon.ts (Retaliate — REVENGE_MARKER)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(player, { byAttackDamage: true })) {
        effect.damage += 100;
      }
      return state;
    }

    return state;
  }
}
