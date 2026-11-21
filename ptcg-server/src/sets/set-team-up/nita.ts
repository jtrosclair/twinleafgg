import { GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { getPhysicalAttachedEnergy } from '../../game/store/prefabs/attack-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { chooseTrainerAttachment } from '../../game/store/prefabs/trainer-attachments';
import { Stage } from '../../game/store/card/card-types';

export class Nita extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TEU';
  public setNumber: string = '151';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nita';
  public fullName: string = 'Nita TEU';
  public text: string = 'You can play this card only if your opponent\'s Active Pokémon is a Basic Pokémon. Put an Energy from your opponent\'s Active Pokémon on top of their deck. You may play only 1 Supporter card during your turn (before your attack).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const opponent = StateUtils.getOpponent(state, effect.player);
    const { active } = opponent;
    if (!active.isStage(Stage.BASIC) || getPhysicalAttachedEnergy(active).length === 0) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Ref: set-scarlet-and-violet/team-star-grunt.ts (put one attached Energy on top).
    return chooseTrainerAttachment(store, state, effect, active, getPhysicalAttachedEnergy, GameMessage.CHOOSE_CARD_TO_DISCARD, card => {
      if (card) MOVE_CARDS(store, state, active, opponent.deck, { cards: [card], sourceCard: this, sourceEffect: effect, toTop: true });
    });
  }
}
