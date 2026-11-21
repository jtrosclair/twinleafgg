import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { GameMessage, ShowCardsPrompt, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sneasel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = D;
  public weakness = [{ type: F, value: +10 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rob',
    cost: [D],
    damage: 0,
    text: 'Look at your opponent\'s hand. If your opponent has any Pokémon Tool or Technical Machine cards in his or her hand, put those cards on top of his or her deck. Your opponent shuffles his or her deck afterward.'
  },
  {
    name: 'Slash',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '120';
  public name: string = 'Sneasel';
  public fullName: string = 'Sneasel LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rob
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hand = opponent.hand.cards.slice();
      if (hand.length === 0) return state;
      return store.prompt(state, new ShowCardsPrompt(
        player.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, hand, { sourcePlayerId: opponent.id }
      ), () => {
        const matchingCards = hand.filter(card => card instanceof TrainerCard
          && (card.trainerType === TrainerType.TOOL || card.tags.includes(CardTag.TECHNICAL_MACHINE)));
        if (matchingCards.length === 0) return;
        matchingCards.reverse().forEach(card => {
          opponent.hand.moveCardTo(card, opponent.deck);
        });
        SHUFFLE_DECK(store, state, opponent);
      });
    }

    return state;
  }
}
