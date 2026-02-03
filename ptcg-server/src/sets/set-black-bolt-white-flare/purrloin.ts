import { Card, CardType, ChooseCardsPrompt, GameMessage, PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

function* useInviteEvil(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = effect.opponent;

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { cardType: CardType.DARK },
    { min: 0, max: 3, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Purrloin extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Invite Evil',
      cost: [D],
      damage: 0,
      text: 'Search your deck for up to 3 {D} Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
    },
  ];

  public regulationMark: string = 'I';
  public set = 'WHT';
  public setNumber = '55';
  public cardImage = 'assets/cardback.png';
  public name = 'Purrloin';
  public fullName = 'Purrloin SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Invite Evil
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useInviteEvil(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
