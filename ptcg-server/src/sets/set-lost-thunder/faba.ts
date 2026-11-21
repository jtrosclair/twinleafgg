import { GameError, GameMessage, PlayerType, SelectPrompt, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { chooseTrainerAttachment, chooseTrainerAttachmentTarget, getAttachedSpecialEnergy, moveTrainerAttachments } from '../../game/store/prefabs/trainer-attachments';

export class Faba extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'LOT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '173';

  public name: string = 'Faba';

  public fullName: string = 'Faba LOT';

  public text: string =
    'Choose a Pokémon Tool or Special Energy card attached to 1 of your opponent\'s Pokémon, or any Stadium card in play, and put it in the Lost Zone.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;

    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    const targets = opponent.getPokemonInPlay();

    const options: { message: GameMessage, action: () => void }[] = [];
    // Ref: set-pokemon-151/giovannis-charisma.ts (check Trainer protection at the chosen target).
    const choose = (attachments: typeof getAttachedSpecialEnergy): void => {
      chooseTrainerAttachmentTarget(store, state, effect, PlayerType.TOP_PLAYER, attachments, target => {
        chooseTrainerAttachment(store, state, effect, target, attachments, GameMessage.CHOOSE_CARD_TO_DISCARD, card => {
          if (!card) return;
          const owner = StateUtils.findOwner(state, target);
          moveTrainerAttachments(store, state, effect, target, owner.lostzone, [card]);
        }, true);
      });
    };

    if (targets.some(slot => slot.tools.length > 0)) {
      options.push({ message: GameMessage.CHOICE_TOOL, action: () => choose(slot => slot.tools) });
    }
    if (targets.some(slot => getAttachedSpecialEnergy(slot).length > 0)) {
      options.push({ message: GameMessage.CHOICE_SPECIAL_ENERGY, action: () => choose(getAttachedSpecialEnergy) });
    }

    const stadium = StateUtils.getStadiumCard(state);
    if (stadium) {
      options.push({
        message: GameMessage.CHOICE_STADIUM,
        action: () => {
          const source = StateUtils.findCardList(state, stadium);
          const owner = StateUtils.findOwner(state, source);
          MOVE_CARDS(store, state, source, owner.lostzone, { sourceCard: this, sourceEffect: effect });
        }
      });
    }
    if (options.length === 0) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    return store.prompt(state, new SelectPrompt(
      player.id, GameMessage.DISCARD_STADIUM_OR_TOOL_OR_SPECIAL_ENERGY, options.map(option => option.message), { allowCancel: false }
    ), selected => options[selected]?.action());
  }
}
