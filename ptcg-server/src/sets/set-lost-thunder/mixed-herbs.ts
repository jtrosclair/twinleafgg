import { Card, ConfirmPrompt, GameError, GameMessage, SelectPrompt, State, StoreLike } from '../../game';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class MixedHerbs extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'LOT';
  public setNumber: string = '184';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mixed Herbs';
  public fullName: string = 'Mixed Herbs LOT';
  public text: string = 'You may play 2 Mixed Herbs cards at once.\n\u2022 If you played 1 card, remove a Special Condition from your Active Pok\u00e9mon.\n\u2022 If you played 2 cards, heal 90 damage and remove all Special Conditions from your Active Pok\u00e9mon. (This effects works one time for 2 cards.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;

    const { player } = effect;
    const active = player.active;
    const conditions = active.specialConditions.filter(condition => condition <= SpecialCondition.BURNED);
    const second = player.hand.cards.find(card => card !== this && card.name === this.name);
    const canCure = conditions.length > 0;
    const canPlayBoth = !!second && (canCure || active.damage > 0);
    const cureOne = () => {
      if (conditions.length === 1) {
        active.removeSpecialCondition(conditions[0]);
        return state;
      }
      return store.prompt(state, new SelectPrompt(
        player.id, GameMessage.CHOOSE_SPECIAL_CONDITION, conditions.map(condition => 'GAME_MESSAGES.SPECIAL_CONDITION_' + SpecialCondition[condition]), { allowCancel: false }
      ), choice => {
        active.removeSpecialCondition(conditions[choice]);
      });
    };
    const playBoth = (companion: Card) => {
      MOVE_CARDS(store, state, player.hand, player.discard, { cards: [companion], sourceCard: this });
      active.clearAllSpecialConditions();
      return store.reduceEffect(state, new HealEffect(player, active, 90));
    };

    if (canCure && canPlayBoth) {
      return store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE), both => {
        if (both) playBoth(second);
        else cureOne();
      });
    }
    if (canPlayBoth) return playBoth(second);
    if (canCure) return cureOne();
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
}
