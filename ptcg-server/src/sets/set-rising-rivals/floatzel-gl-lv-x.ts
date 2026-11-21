import { ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import {CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckPokemonTypeEffect, CheckTableStateEffect} from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';
import { CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';

export class FloatzelGLLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  public evolvesFrom = 'Floatzel GL';
  public cardType: CardType = W;
  public tags = [ CardTag.POKEMON_LV_X, CardTag.POKEMON_SP ];
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [ ];

  public powers = [
    {
      name: 'LV.X Rule',
      powerType: PowerType.LV_X_RULE,
      text: 'Put this card onto your Active Floatzel GL. Floatzel GL LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
    },
    {
      name: 'Water Rescue',
      powerType: PowerType.POKEBODY,
      text: 'Whenever any of your [W] Pokémon (excluding any Floatzel GL) is Knocked Out by damage from your opponent\'s attack, you may put that Pokémon and all cards that were attached to it from your discard pile into your hand.'
    }
  ];

  public attacks = [{
    name: 'Energy Cyclone',
    cost: [W, W],
    damage: 20,
    damageCalculation: 'x',
    text: 'Choose as many Energy cards from your hand as you like and show them to your opponent. This attack does 20 damage times the number of Energy cards you chose. Put those Energy cards on top of your deck. Shuffle your deck afterward.'
  }];

  public set: string = 'RR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Floatzel GL';
  public fullName: string = 'Floatzel GL LV.X RR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-arceus/lucky-egg.ts (resolve after the Pokémon actually reaches the discard pile).
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard) {
      const { player, target } = effect;
      const pokemon = target.getPokemonCard();
      if (pokemon && pokemon.name !== this.evolvesFrom && StateUtils.isPokemonInPlay(player, this)
        && !IS_POKEBODY_BLOCKED(store, state, player, this)) {
        const type = new CheckPokemonTypeEffect(target);
        store.reduceEffect(state, type);
        if (type.cardTypes.includes(CardType.WATER)) {
          const cards = [...new Set([...target.cards, ...target.tools, ...target.energies.cards,
            ...target.cards.flatMap(card => card.cards?.cards ?? [])])];
          effect.afterDiscard.set(this, {
            recovery: true,
            resolve: () => {
              if (!player.discard.cards.includes(pokemon)) return;
              CONFIRMATION_PROMPT(store, state, player, accept => {
                if (!accept || !player.discard.cards.includes(pokemon)) return;
                const discarded = cards.filter(card => player.discard.cards.includes(card));
                MOVE_CARDS(store, state, player.discard, player.hand, { cards: discarded, sourceCard: this });
              });
            }
          });
        }
      }
    }

    // Energy Cyclone
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      const energiesInHand = player.hand.cards.filter(card => card instanceof EnergyCard && card.superType === SuperType.ENERGY);

      // Prompt player to choose cards to discard 
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: energiesInHand.length }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        SHOW_CARDS_TO_PLAYER(store, state, effect.opponent, cards);
        MOVE_CARDS(store, state, player.hand, player.deck, { cards: cards });
        SHUFFLE_DECK(store, state, player);

        effect.damage = (cards.length * 20);
        return state;
      });
    }

    // making sure it gets put on the active pokemon
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this){
      if (effect.target !== effect.player.active){ throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }
    }

    // Trying to get all of the previous stage's attacks and powers
    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
          player.showAllStageAbilities = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Add attacks from the previous stage to this one
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
          effect.attacks.push(...(evolutionCard.attacks || []));
        }
      }
    }

    if (effect instanceof CheckPokemonPowersEffect){
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Adds the powers from the previous stage
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
          effect.powers.push(...(evolutionCard.powers || []));
        }
      }
    }

    return state;
  }
}