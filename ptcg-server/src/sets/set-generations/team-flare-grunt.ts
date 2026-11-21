import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { getPhysicalAttachedEnergy } from '../../game/store/prefabs/attack-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { chooseTrainerAttachment } from '../../game/store/prefabs/trainer-attachments';

export class TeamFlareGrunt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'GEN';

  public name: string = 'Team Flare Grunt';

  public fullName: string = 'Team Flare Grunt GEN';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '73';

  public text: string =
    'Discard an Energy attached to your opponent\'s Active Pokémon.';

  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    return getPhysicalAttachedEnergy(opponent.active).length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;

    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (!this.canPlay(store, state, player)) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    // Ref: set-pokemon-151/giovannis-charisma.ts (check Trainer protection before moving an attachment).
    const target = opponent.active;
    return chooseTrainerAttachment(store, state, effect, target, getPhysicalAttachedEnergy, GameMessage.CHOOSE_CARD_TO_DISCARD, card => {
      if (card) MOVE_CARDS(store, state, target, opponent.discard, { cards: [card], sourceCard: this, sourceEffect: effect });
    });
  }
}
