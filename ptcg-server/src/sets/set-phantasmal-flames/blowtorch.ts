/* eslint-disable quotes */
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Card, CardList, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, GameError, GameMessage, PlayerType, PokemonCardList, SelectOptionPrompt, SlotType, StateUtils } from '../../game';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Blowtorch extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'I';
  public set: string = 'PFL';
  public name: string = 'Blowtorch';
  public fullName: string = 'Blowtorch M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';

  public text: string = `You can use this card only if you discard a Basic [R] Energy card from your hand. Discard a Pokémon Tool or Special Energy card from 1 of your opponent's Pokémon, or discard a Stadium in play.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has a Basic Fire Energy in hand
      const hasBasicFireEnergy = player.hand.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Fire Energy';
      });

      if (!hasBasicFireEnergy) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Count opponent's Pokemon with Tools or Special Energy
      let opponentPokemonsWithTargets = 0;
      const blocked: CardTarget[] = [];

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, _card, target) => {
        const hasTools = cardList.tools.length > 0;
        const hasSpecialEnergy = cardList.cards.some(c =>
          c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL
        );

        if (hasTools || hasSpecialEnergy) {
          opponentPokemonsWithTargets += 1;
        } else {
          blocked.push(target);
        }
      });

      const stadiumCard = StateUtils.getStadiumCard(state);

      // Check if there are any valid targets
      if (opponentPokemonsWithTargets === 0 && stadiumCard === undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Move card to supporter zone temporarily
      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      // Prompt to discard Basic Fire Energy
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          player.supporter.moveCardTo(this, player.hand);
          return state;
        }
        MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
      });

      // If both Pokemon targets and Stadium exist, give choice
      if (opponentPokemonsWithTargets >= 1 && stadiumCard !== undefined) {
        const options: { message: GameMessage, action: () => State }[] = [
          {
            message: GameMessage.CHOICE_TOOL,
            action: () => {
              return this.discardFromOpponentPokemon(store, state, player, opponent, blocked);
            }
          },
          {
            message: GameMessage.CHOICE_STADIUM,
            action: () => {
              const stadiumCard = StateUtils.getStadiumCard(state);
              if (stadiumCard === undefined) {
                throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
              }

              const cardList = StateUtils.findCardList(state, stadiumCard);
              const owner = StateUtils.findOwner(state, cardList);
              MOVE_CARDS(store, state, cardList, owner.discard, { sourceCard: this });

              player.supporter.moveCardTo(this, player.discard);
              return state;
            }
          }
        ];

        return store.prompt(state, new SelectOptionPrompt(
          player.id,
          GameMessage.DISCARD_STADIUM_OR_TOOL,
          options.map(c => c.message),
          { allowCancel: false }
        ), choice => {
          const result = options[choice].action();
          return result;
        });
      }

      // Only Stadium available
      if (opponentPokemonsWithTargets === 0 && stadiumCard !== undefined) {
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const owner = StateUtils.findOwner(state, cardList);
        MOVE_CARDS(store, state, cardList, owner.discard, { sourceCard: this });

        player.supporter.moveCardTo(this, player.discard);
        return state;
      }

      // Only Pokemon targets available
      if (opponentPokemonsWithTargets >= 1 && stadiumCard === undefined) {
        return this.discardFromOpponentPokemon(store, state, player, opponent, blocked);
      }

      player.supporter.moveCardTo(this, player.discard);
      return state;
    }
    return state;
  }

  private discardFromOpponentPokemon(
    store: StoreLike,
    state: State,
    player: any,
    opponent: any,
    blocked: CardTarget[]
  ): State {
    return store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      PlayerType.TOP_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { min: 1, max: 1, allowCancel: false, blocked }
    ), (results: PokemonCardList[]) => {
      const targets = results || [];

      if (targets.length === 0) {
        player.supporter.moveCardTo(this, player.discard);
        return state;
      }

      const target = targets[0];
      const tools = target.tools;
      const specialEnergies = target.cards.filter(c =>
        c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL
      );

      const discardableCards: Card[] = [...tools, ...specialEnergies];

      if (discardableCards.length === 0) {
        player.supporter.moveCardTo(this, player.discard);
        return state;
      }

      if (discardableCards.length === 1) {
        // Only one card, discard it directly
        target.moveCardTo(discardableCards[0], opponent.discard);
        player.supporter.moveCardTo(this, player.discard);
        return state;
      }

      // Multiple cards, prompt to choose one
      const cardList = new CardList();
      cardList.cards = [...discardableCards];

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        cardList,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selectedCards => {
        if (selectedCards && selectedCards.length === 1) {
          target.moveCardTo(selectedCards[0], opponent.discard);
        }
        player.supporter.moveCardTo(this, player.discard);
        return state;
      });
    });
  }
}
