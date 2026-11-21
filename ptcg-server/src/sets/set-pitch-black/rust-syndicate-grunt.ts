import { GameError, GameMessage, Player, PlayerType, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { getPhysicalAttachedEnergy } from '../../game/store/prefabs/attack-effects';
import { MOVE_CARDS, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../game/store/prefabs/prefabs';
import { chooseTrainerAttachment, chooseTrainerAttachmentTarget } from '../../game/store/prefabs/trainer-attachments';

export class RustSyndicateGrunt extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'J';
  public set: string = "PBL";
  public setNumber: string = "81";
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rust Syndicate Grunt';
  public fullName: string = 'Rust Syndicate Grunt M5';
  public text: string = `You may only play this card if 1 of your Pokémon was Knocked Out during your opponent\'s last turn.\n\nDiscard 1 Energy attached to 1 of your opponent\'s Pokémon.`;

  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    return WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(player)
      && opponent.getPokemonInPlay().some(slot => getPhysicalAttachedEnergy(slot).length > 0);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;

    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (!this.canPlay(store, state, player)) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    // Ref: set-pokemon-151/giovannis-charisma.ts (check Trainer protection before moving an attachment).
    return chooseTrainerAttachmentTarget(store, state, effect, PlayerType.TOP_PLAYER, getPhysicalAttachedEnergy, target => {
      chooseTrainerAttachment(store, state, effect, target, getPhysicalAttachedEnergy, GameMessage.CHOOSE_CARD_TO_DISCARD, card => {
        if (card) MOVE_CARDS(store, state, target, opponent.discard, { cards: [card], sourceCard: this, sourceEffect: effect });
      });
    });
  }
}
