import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { DRAW_CARDS, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Nidoran extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = P;
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Collect',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Poison Skin',
    cost: [P],
    damage: 0,
    text: 'Flip 2 coins. If either of them is heads, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Nidoran ♂';
  public fullName: string = 'Nidoran ♂ SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/togetic.ts (post-damage draw for the correct player).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      afterAttackDamage(state, effect, (_store, nextState) => { DRAW_CARDS(player, 1); return nextState; });
    }
    // Ref: set-great-encounters/ge-attack-effects.ts (coin then original-defender condition).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const target = effect.opponent.active, defender = target.getPokemonCard();
      afterAttackDamage(state, effect, (postStore, nextState) => MULTIPLE_COIN_FLIPS_PROMPT(postStore, nextState, effect.player, 2, results => {
        if (!results.some(Boolean) || !defender || effect.opponent.active !== target || target.getPokemonCard() !== defender) return;
        const poison = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]); poison.target = target; postStore.reduceEffect(nextState, poison);
      }));
    }
    return state;
  }
}
