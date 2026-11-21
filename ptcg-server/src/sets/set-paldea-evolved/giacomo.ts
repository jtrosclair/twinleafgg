import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { chooseTrainerAttachment, getAttachedSpecialEnergy } from '../../game/store/prefabs/trainer-attachments';

export class Giacomo extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '182';

  public name: string = 'Giacomo';

  public fullName: string = 'Giacomo PAL';

  public text: string =
    'Discard a Special Energy from each of your opponent\'s Pokémon.';

  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    return StateUtils.getOpponent(state, player).getPokemonInPlay().some(slot => getAttachedSpecialEnergy(slot).length > 0);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    if (!this.canPlay(store, state, effect.player)) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    const opponent = StateUtils.getOpponent(state, effect.player);
    const targets = opponent.getPokemonInPlay().filter(slot => getAttachedSpecialEnergy(slot).length > 0);
    // Ref: set-pokemon-151/giovannis-charisma.ts (resolve Trainer protection per target).
    const choose = (index: number): void => {
      const target = targets[index];
      if (!target) return;
      chooseTrainerAttachment(store, state, effect, target, getAttachedSpecialEnergy, GameMessage.CHOOSE_CARD_TO_DISCARD, card => {
        if (card) MOVE_CARDS(store, state, target, opponent.discard, { cards: [card], sourceCard: this, sourceEffect: effect });
        choose(index + 1);
      });
    };
    choose(0);
    return state;
  }
}
