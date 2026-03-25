import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, ShuffleDeckPrompt, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Delibird extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public regulationMark = 'I';
  public cardType: CardType = CardType.COLORLESS;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public hp: number = 90;
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Quick Gift',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'If you go first, you can use this attack during your first turn. Search your deck for a card and put it into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Gentle Slap',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'ME1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Delibird';
  public fullName: string = 'Delibird ME1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Quick Gift attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Check if it's the first turn and player went first
      if (state.turn !== 1 || state.players[0] !== player) {
        return state;
      }

      // Check if deck has cards
      if (player.deck.cards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    return state;
  }
}
