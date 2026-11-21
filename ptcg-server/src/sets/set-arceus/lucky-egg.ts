import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, IS_TOOL_BLOCKED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class LuckyEgg extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'AR';
  public name: string = 'Lucky Egg';
  public fullName: string = 'Lucky Egg AR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';

  public text: string =
    'When the Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack and put into your discard pile, draw cards until you have 7 cards in your hand.';

  public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.target.tools.includes(this)
      && !IS_TOOL_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const draw = () => DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 7);
      if (this.set === 'AR') {
        // The Arceus erratum requires the actual discard to have happened.
        const pokemon = effect.target.getPokemonCard();
        effect.afterDiscard.set(this, { resolve: () => {
          if (pokemon && player.discard.cards.includes(pokemon)) draw();
        } });
      } else if (effect.resolveBeforeDiscard) {
        effect.beforeDiscard.set(this, {
          label: this.name,
          canResolve: () => player.hand.cards.length < 7 && player.deck.cards.length > 0,
          resolve: draw
        });
      }
    }
    return state;
  }
}
