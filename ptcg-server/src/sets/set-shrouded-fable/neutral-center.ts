import { GameError, GameMessage, StateUtils } from '../../game';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { MoveCardsEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';

export class NeutralCenter extends TrainerCard {

  public trainerType = TrainerType.STADIUM;

  public tags = [CardTag.ACE_SPEC];

  public set = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '60';

  public regulationMark = 'H';

  public name = 'Neutralization Zone';

  public fullName = 'Neutralization Zone SFA';

  public text = `Prevent all damage done to Pokémon that don't have a Rule Box (both yours and your opponent's) by attacks from the opponent's Pokémon ex and Pokémon V. (Pokémon ex, Pokémon V, etc. have Rule Boxes.)

This card can't be put into your hand or deck from the discard pile. `;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof MoveCardsEffect) {
      const owner = state.players.find(player => player.discard === effect.source);
      if (owner && (effect.destination === owner.hand || effect.destination === owner.deck)) {
        const moving = effect.cards ?? effect.source.cards.slice(0, effect.count);
        if (moving.includes(this)) {
          effect.cards = moving.filter(card => card !== this);
          if (effect.cards.length === 0) effect.preventDefault = true;
        }
      }
      return state;
    }

    if (StateUtils.getStadiumCard(state) !== this) return state;
    if (effect instanceof UseStadiumEffect) throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    if (effect instanceof PutDamageEffect && state.phase === GamePhase.ATTACK
      && !effect.ignoresDefendingDamageEffects && !effect.target.hasRuleBox()
      && (effect.source.exPokemon() || effect.source.vPokemon())) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (owner !== effect.player && !IS_STADIUM_EFFECT_BLOCKED(store, state, owner, effect.target, this)) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}
