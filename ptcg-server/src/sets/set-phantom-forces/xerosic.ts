import { GameError, GameMessage, PlayerType, SelectPrompt, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { chooseTrainerAttachment, chooseTrainerAttachmentTarget, getAttachedSpecialEnergy, moveTrainerAttachments } from '../../game/store/prefabs/trainer-attachments';

export class Xerosic extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PHF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '110';

  public name: string = 'Xerosic';

  public fullName: string = 'Xerosic PHF';

  public text: string =
    'Choose a Pokémon Tool or Special Energy card attached to a Pokémon in play (yours or your opponent\'s) and discard it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;

    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    const targets = [...player.getPokemonInPlay(), ...opponent.getPokemonInPlay()];

    const options: { message: GameMessage, action: () => void }[] = [];
    // Ref: set-pokemon-151/giovannis-charisma.ts (check Trainer protection at the chosen target).
    const choose = (attachments: typeof getAttachedSpecialEnergy): void => {
      chooseTrainerAttachmentTarget(store, state, effect, PlayerType.ANY, attachments, target => {
        chooseTrainerAttachment(store, state, effect, target, attachments, GameMessage.CHOOSE_CARD_TO_DISCARD, card => {
          if (!card) return;
          const owner = StateUtils.findOwner(state, target);
          moveTrainerAttachments(store, state, effect, target, owner.discard, [card]);
        }, true);
      });
    };

    if (targets.some(slot => slot.tools.length > 0)) {
      options.push({ message: GameMessage.CHOICE_TOOL, action: () => choose(slot => slot.tools) });
    }
    if (targets.some(slot => getAttachedSpecialEnergy(slot).length > 0)) {
      options.push({ message: GameMessage.CHOICE_SPECIAL_ENERGY, action: () => choose(getAttachedSpecialEnergy) });
    }
    if (options.length === 0) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    return store.prompt(state, new SelectPrompt(
      player.id, GameMessage.CHOOSE_OPTION, options.map(option => option.message), { allowCancel: false }
    ), selected => options[selected]?.action());
  }
}
