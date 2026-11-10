import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { COIN_FLIP_PROMPT, DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Chatot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = C;
  public weakness = [{ type: L, value: 10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Me First',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
{
    name: 'Tone-Deaf',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Chatot';
  public fullName: string = 'Chatot DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/goldeen.ts (post-damage action timing).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamage(state, effect, (_postStore, postState) => {
        DRAW_CARDS(effect.player, 1);
        return postState;
      });
    }

    // Ref: set-diamond-and-pearl/skorupi.ts (coin-gated condition).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const target = effect.opponent.active;
      const defender = target.getPokemonCard();
      afterAttackDamage(state, effect, (postStore, postState) =>
        COIN_FLIP_PROMPT(postStore, postState, effect.player, result => {
          if (!result || !defender || effect.opponent.active !== target || target.getPokemonCard() !== defender) return;
          const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          condition.target = target;
          postStore.reduceEffect(postState, condition);
        })
      );
    }

    return state;
  }
}
