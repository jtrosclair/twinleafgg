import { Card, CardList, GamePhase, Player, PokemonCard, State, StateUtils, StoreLike } from '../../game';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';

function isBasicEnergy(card: Card): boolean {
  return card.superType === SuperType.ENERGY && card.energyType === EnergyType.BASIC;
}

function isRecoverable(card: Card): boolean {
  // Diamond & Pearl rules update: older wording covers all Pokémon cards.
  return isBasicEnergy(card) || card instanceof PokemonCard;
}

function recoveryCounts(cards: Card[]) {
  return {
    energies: Math.min(3, cards.filter(isBasicEnergy).length),
    pokemon: Math.min(3, cards.filter(card => card instanceof PokemonCard).length),
  };
}

export class HolonFarmer extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public tags = [CardTag.DELTA_SPECIES];
  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Holon Farmer';
  public fullName: string = 'Holon Farmer DS';

  public text: string =
    'Discard a card from your hand. If you can\'t discard a card from your hand, you can\'t play this card.\n\nSearch your discard pile for 3 basic Energy cards and any combination of 3 Basic Pokémon or Evolution cards, show them to your opponent, and put them on top of your deck. Shuffle your deck afterward.';

  private costChoices(player: Player): Card[] {
    const canRecover = player.discard.cards.some(isRecoverable);
    return player.hand.cards.filter(card => card !== this &&
      (canRecover || (isRecoverable(card) && !card.tags.includes(CardTag.PRISM_STAR))));
  }

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    return this.costChoices(player).length > 0;
  }

  public paySupporterCost(
    store: StoreLike, state: State, effect: TrainerEffect, onPaid: (state: State) => State,
  ): State {
    return this.resolveCost(store, state, effect, onPaid, true);
  }

  private resolveCost(
    store: StoreLike, state: State, effect: TrainerEffect, onPaid: (state: State) => State, fromHand: boolean,
  ): State {
    const { player } = effect;
    const turn = state.turn;
    const choices = this.costChoices(player);
    if (choices.length === 0) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    const pay = (card: Card) => {
      const next = MOVE_CARDS(store, state, player.hand, player.discard, {
        cards: [card], sourceCard: this, sourceEffect: effect,
      });
      // Discarding a Prism Star redirects it to the Lost Zone and still pays.
      if (!player.discard.cards.includes(card) && !player.lostzone.cards.includes(card)) return next;
      store.log(next, GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
      return onPaid(next);
    };

    if (choices.length === 1) return pay(choices[0]);

    // Ref: Ultra Ball SVI (a stable list of the other cards available for payment).
    const offerCost = (available: Card[]): State => {
      const list = new CardList();
      list.cards = available;
      return store.prompt(state, new ChooseCardsPrompt(
        player, GameMessage.CHOOSE_CARD_TO_DISCARD, list, {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        // Sandbox edits can move the Supporter or change the available payment.
        if (fromHand && (!player.hand.cards.includes(this) || state.turn !== turn ||
          state.phase !== GamePhase.PLAYER_TURN || state.players[state.activePlayer] !== player)) return;
        const currentChoices = this.costChoices(player);
        if (selected?.length === 1 && currentChoices.includes(selected[0])) {
          pay(selected[0]);
        } else if (currentChoices.length > 0) {
          offerCost(currentChoices);
        }
      });
    };
    return offerCost(choices);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    if (!effect.supporterCostPaid) {
      return this.resolveCost(store, state, effect, paidState => this.recover(store, paidState, effect), false);
    }
    return this.recover(store, state, effect);
  }

  private recover(store: StoreLike, state: State, effect: TrainerEffect): State {
    const { player } = effect;
    const source = player.discard;
    const targets = source.cards.filter(isRecoverable);
    const { energies, pokemon } = recoveryCounts(targets);
    const count = energies + pokemon;
    if (count === 0) return state;

    // Ref: PUI Rules Team, Dec 8, 2005 (count the discard pile after the cost,
    // including the card just discarded, and take as many as possible per type).
    const list = new CardList();
    list.cards = targets;
    const opponent = StateUtils.getOpponent(state, player);
    const isCurrentChoice = (cards: Card[]): boolean => {
      const current = recoveryCounts(source.cards);
      return new Set(cards).size === cards.length &&
        cards.every(card => source.cards.includes(card) && isRecoverable(card)) &&
        cards.filter(isBasicEnergy).length === current.energies &&
        cards.filter(card => card instanceof PokemonCard).length === current.pokemon;
    };
    return store.prompt(state, new ChooseCardsPrompt(
      player, GameMessage.CHOOSE_CARD_TO_DECK, list, {},
      { min: count, max: count, allowCancel: false, maxPokemons: pokemon, maxEnergies: energies }
    ), (selected: Card[] | null) => {
      if (!selected || !isCurrentChoice(selected)) {
        return this.recover(store, state, effect);
      }
      store.prompt(state, new ShowCardsPrompt(
        opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected, { sourcePlayerId: player.id }
      ), () => {
        if (!isCurrentChoice(selected)) return this.recover(store, state, effect);
        const next = MOVE_CARDS(store, state, source, player.deck, {
          cards: selected, toTop: true, sourceCard: this, sourceEffect: effect,
        });
        SHUFFLE_DECK(store, next, player);
      });
    });
  }
}
