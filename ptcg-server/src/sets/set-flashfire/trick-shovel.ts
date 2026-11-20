import { GameError, GameMessage, Player, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN, SELECT_PROMPT_WITH_OPTIONS } from '../../game/store/prefabs/prefabs';

export class TrickShovel extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Trick Shovel';
  public fullName: string = 'Trick Shovel FLF';
  public text: string = 'Look at the top card of either player\'s deck. You may discard that card or return it to the top of the deck.';


  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0 || StateUtils.getOpponent(state, player).deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) {
      return state;
    }
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);
    const choices = [player, opponent].filter(owner => owner.deck.cards.length > 0);
    if (choices.length === 0) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    // Ref: set-journey-together/rockruff.ts (Dig It Up).
    if (choices.length === 1) {
      return LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store, state, player, choices[0]);
    }
    return SELECT_PROMPT_WITH_OPTIONS(store, state, player, GameMessage.CHOOSE_OPTION, choices.map(owner => ({
      message: owner === player ? GameMessage.REVEAL_YOUR_TOP_DECK : GameMessage.REVEAL_OPPONENT_TOP_DECK,
      action: () => LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store, state, player, owner),
    })));
  }
}
