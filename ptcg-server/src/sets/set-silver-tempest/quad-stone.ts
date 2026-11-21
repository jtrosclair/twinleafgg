import { GameError, GameMessage, SelectOptionPrompt, State, StoreLike } from '../../game';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class QuadStone extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public setNumber: string = '163';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Quad Stone';
  public fullName: string = 'Quad Stone SIT 163';
  public text: string = 'You may use 4 Quad Stone cards at once.\n• If you used 1 card, heal 10 damage from your Active Pokémon.\n• If you used 4 cards, heal all damage from each of your Pokémon. (This effect works one time for 4 cards.) You may play any number of Item cards during your turn.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;

    const { player } = effect;
    const remaining = player.hand.cards.filter(card => card !== this && card.name === this.name).slice(0, 3);
    const canHealActive = player.active.damage > 0;
    const canHealAll = remaining.length === 3 && player.getPokemonInPlay().some(slot => slot.damage > 0);

    const healActive = () => store.reduceEffect(state, new HealEffect(player, player.active, 10));
    const healAll = () => {
      MOVE_CARDS(store, state, player.hand, player.discard, { cards: remaining, sourceCard: this });
      for (const slot of player.getPokemonInPlay()) {
        if (slot.damage > 0) store.reduceEffect(state, new HealEffect(player, slot, slot.damage));
      }
      return state;
    };

    if (canHealActive && canHealAll) {
      return store.prompt(state, new SelectOptionPrompt(player.id, GameMessage.CHOOSE_OPTION, [
        'Play 1 card: Heal 10 damage from your Active Pokémon.',
        'Play 4 cards: Heal all damage from each of your Pokémon.'
      ], { allowCancel: false, defaultValue: 0 }), choice => {
        if (choice === 0) healActive();
        else healAll();
      });
    }
    if (canHealAll) return healAll();
    if (canHealActive) return healActive();
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
}
