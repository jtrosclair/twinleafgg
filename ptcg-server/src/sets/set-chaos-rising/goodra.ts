import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatPaymentEffect } from '../../game/store/effects/check-effects';
import { PokemonCard, StateUtils, StoreLike, State } from '../../game';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { DISCARD_TOP_X_CARDS_FROM_YOUR_DECK, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Goodra extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Sliggoo';
  public hp: number = 160;
  public cardType: CardType = N;
  public weakness: { type: CardType }[] = [];
  public resistance: { type: CardType; value: number }[] = [];
  public retreat = [C, C, C];
  public powers = [{
    name: 'Slimy Sliding',
    powerType: PowerType.ABILITY,
    text: 'When your opponent\'s Active Pokémon retreats, your opponent flips a coin. If tails, Energy for its Retreat Cost is not discarded, and they don\'t switch Pokémon. The effect of Slimy Sliding doesn\'t stack.'
  }];
  public attacks = [{
    name: 'Dragon Pulse',
    cost: [W, P],
    damage: 160,
    text: 'Discard the top card of your deck.'
  }];
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public usSetNumber = 'CRI 68';
  public name: string = 'Goodra';
  public fullName: string = 'Goodra M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatPaymentEffect && !effect.requiresCoinFlip) {
      const owner = StateUtils.getOpponent(state, effect.player);
      if (StateUtils.isPokemonInPlay(owner, this) && !IS_ABILITY_BLOCKED(store, state, owner, this)
        && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, this.powers[0], this, effect.player.active)) {
        effect.requiresCoinFlip = true;
      }
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, effect.player, 1, this, effect);
    }
    return state;
  }
}
