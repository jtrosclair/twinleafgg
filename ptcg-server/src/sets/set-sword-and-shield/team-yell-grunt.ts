import { GameError, GameMessage, Player, PlayerType, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { getPhysicalAttachedEnergy } from '../../game/store/prefabs/attack-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { chooseTrainerAttachment, chooseTrainerAttachmentTarget } from '../../game/store/prefabs/trainer-attachments';
import { canReturnPokemonToHand } from '../../game/store/prefabs/pokemon-replacement';

export class TeamYellGrunt extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'D';
  public set: string = 'SSH';
  public setNumber: string = '184';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Yell Grunt';
  public fullName: string = 'Team Yell Grunt SSH';
  public text: string = 'Put an Energy attached to 1 of your opponent\'s Pokémon into their hand. You may play only 1 Supporter card during your turn.';

  public canPlay(_store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    return opponent.getPokemonInPlay().some(slot => getPhysicalAttachedEnergy(slot).length > 0);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;

    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (!this.canPlay(store, state, player)) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    // Ref: set-pokemon-151/giovannis-charisma.ts (check Trainer protection before moving an attachment).
    return chooseTrainerAttachmentTarget(store, state, effect, PlayerType.TOP_PLAYER, getPhysicalAttachedEnergy, target => {
      if (!canReturnPokemonToHand(store, state, opponent, target)) return;
      chooseTrainerAttachment(store, state, effect, target, getPhysicalAttachedEnergy, GameMessage.CHOOSE_CARD_TO_HAND, card => {
        if (card) MOVE_CARDS(store, state, target, opponent.hand, { cards: [card], sourceCard: this, sourceEffect: effect });
      });
    });
  }
}
