import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_TOOL_BLOCKED, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';

export class ReversalTrigger extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public tags = [CardTag.TEAM_PLASMA];
  public set: string = 'PLB';
  public setNumber: string = '86';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Reversal Trigger';
  public fullName: string = 'Reversal Trigger PLB';
  public text: string = 'When the Team Plasma Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, search your deck for a card and put it into your hand. Shuffle your deck afterward.';

  public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard
      && effect.target.tools.includes(this) && effect.target.getPokemonCard()?.tags.includes(CardTag.TEAM_PLASMA)
      && !IS_TOOL_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      effect.beforeDiscard.set(this, {
        label: this.name,
        canResolve: () => player.deck.cards.length > 0,
        resolve: () => SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, {}, { max: 1, allowCancel: false }, effect)
      });
    }
    return state;
  }
}
