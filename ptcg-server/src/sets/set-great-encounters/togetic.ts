import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { GameMessage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

export class Togetic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Togepi';
  public hp: number = 70;
  public cardType: CardType = C;
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Speed Dive',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Sweet Kiss',
    cost: [C, C, C],
    damage: 50,
    text: 'Your opponent may draw a card.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Togetic';
  public fullName: string = 'Togetic GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-mysterious-treasures/snover.ts (post-damage action), set-call-of-legends/cheerleaders-cheer.ts (opponent may draw).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      afterAttackDamage(state, effect, (postStore, postState) => {
        if (!opponent.deck.cards.length) return postState;
        return CONFIRMATION_PROMPT(postStore, postState, opponent, choice => {
          if (choice) DRAW_CARDS(opponent, 1);
        }, GameMessage.WANT_TO_DRAW_CARDS);
      });
    }
    return state;
  }
}
