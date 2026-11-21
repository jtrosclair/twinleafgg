import { GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CopiedSupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_OUT_OPPONENT_ACTIVE_POKEMON, TRAINER_TARGET_BLOCKED } from '../../game/store/prefabs/prefabs';
import { switchOpponentActiveFromAttack } from '../../game/store/prefabs/opponent-switch-after-attack';

export class Ryme extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '194';

  public regulationMark = 'G';

  public name: string = 'Ryme';

  public fullName: string = 'Ryme OBF';

  public text: string =
    'Draw 3 cards. Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const { player } = effect;
    if (player.supporterTurn > 0) {
      throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
    }

    const opponent = StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some(slot => slot.cards.length > 0);
    if (!hasBench && player.deck.cards.length === 0) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    player.deck.moveTo(player.hand, 3);
    if (!hasBench) return state;
    if (effect instanceof CopiedSupporterEffect && effect.attackSource) {
      return switchOpponentActiveFromAttack(store, state, effect.attackSource, effect.attackSource.source.getPokemonCard());
    }
    // The old Active receives the effect. The opponent is choosing a replacement.
    if (TRAINER_TARGET_BLOCKED(store, state, effect, opponent.active)) return state;
    return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player);
  }
}
