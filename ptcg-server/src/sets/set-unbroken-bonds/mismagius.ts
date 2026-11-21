import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { SelfKnockOutEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { DRAW_CARDS, IS_ABILITY_BLOCKED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Mismagius extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Misdreavus';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 110;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Mysterious Message',
    useWhenInPlay: true,
    knocksOutSelf: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may draw cards until you have 7 cards in your hand. If you drew any cards in this way, this Pokémon is Knocked Out.'
  }];

  public attacks = [{
    name: 'Hypnoblast',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 70,
    text: 'Your opponent\'s Active Pokemon is now Asleep.'
  }];

  public set: string = 'UNB';
  public setNumber: string = '78';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mismagius';
  public fullName: string = 'Mismagius UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      if (player.hand.cards.length >= 7 || player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      DRAW_CARDS(player, 7 - player.hand.cards.length);
      return store.reduceEffect(state, new SelfKnockOutEffect(player, this));
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}