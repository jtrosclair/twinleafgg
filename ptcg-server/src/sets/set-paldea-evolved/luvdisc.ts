import { Card, CardType, ChooseCardsPrompt, GameLog, GameMessage, PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, SpecialCondition, Stage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Luvdisc extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark: string = 'G';
  public cardType: CardType = CardType.WATER;
  public hp: number = 70;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Matching',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Search your deck for up to 2 Supporter cards, reveal them, and put them into your hand. Then, shuffle your deck.'
  }, {
    name: 'Water Pulse',
    cost: [CardType.WATER],
    damage: 20,
    text: 'Your opponent\'s Active Pokémon is now Asleep.'
  }];

  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Luvdisc';
  public fullName: string = 'Luvdisc PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Water Pulse attack - apply Asleep condition
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    // Matching attack - search for up to 2 Supporter cards
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let supporters = 0;
      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER) {
          supporters += 1;
        } else {
          blocked.push(index);
        }
      });

      const maxSupporters = Math.min(supporters, 2);

      let cards: Card[] = [];

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: maxSupporters, allowCancel: false, maxSupporters },
      ), selected => {
        cards = selected || [];

        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, player.hand);
          store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
        });

        state = store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards), () => state
        );

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    return state;
  }
}
