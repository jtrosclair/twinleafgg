import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Heracross extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: 20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Pitch',
    cost: [C],
    damage: 10,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  },
{
    name: 'Horn Slash',
    cost: [G, G],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 damage plus 30 more damage.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Heracross';
  public fullName: string = 'Heracross DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pitch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Ref: set-ascended-heroes/mightyena.ts (opponent chooses after damage).
      opponentSwitchAfterAttack(state, effect, this);
    }

    // Ref: set-diamond-and-pearl/skorupi.ts (coin-gated bonus).
    // Horn Slash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
    }

    return state;
  }
}
