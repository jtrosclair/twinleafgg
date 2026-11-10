import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

export class Diglett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = F;
  public weakness = [{ type: W, value: +10 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Down Draw',
    cost: [C],
    damage: 0,
    text: 'Draw a card from the bottom of your deck.'
  },
  {
    name: 'Mud Spatter',
    cost: [F, F],
    damage: 30,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Diglett';
  public fullName: string = 'Diglett SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-ex-dragon-frontiers/electabuzz.ts (draw the bottom card).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      afterAttackDamage(state, effect, (_store, nextState) => { player.deck.moveCardsTo(player.deck.cards.slice(-1), player.hand); return nextState; });
    }
    return state;
  }
}
