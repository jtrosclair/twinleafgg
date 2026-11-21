import { LostZoneCardsEffect } from '../../game/store/effects/attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { flipLegacyCoinsUntilTails } from '../../game/store/prefabs/attack-coin-reflip';
import { ChooseCardsPrompt, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import {CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect} from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';
import {IS_POKEBODY_BLOCKED, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class DialgaGLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  public evolvesFrom = 'Dialga G';
  public cardType: CardType = M;
  public tags = [ CardTag.POKEMON_LV_X, CardTag.POKEMON_SP ];
  public hp: number = 120;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'LV.X Rule',
      powerType: PowerType.LV_X_RULE,
      text: 'Put this card onto your Active Dialga G. Dialga G LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
    },
    {
      name: 'Time Crystal',
      powerType: PowerType.POKEBODY,
      text: 'Each Pokémon (both yours and your opponent\'s) (excluding Pokémon SP) can\'t use any Poké-Bodies.'
    }
  ];

  public attacks = [{
    name: 'Remove Lost',
    cost: [M, M, C, C],
    damage: 80,
    text: 'Flip a coin until you get tails. For each heads, remove an Energy card attached to the Defending Pokémon and put it in the Lost Zone.'
  }];

  public set: string = 'PL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '122';
  public name: string = 'Dialga G';
  public fullName: string = 'Dialga G LV.X PL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Time Crystal affects both players while Dialga G LV.X is in play.
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEBODY
      && !effect.card.tags.includes(CardTag.POKEMON_SP)) {
      const slot = StateUtils.findPokemonSlot(state, this);
      if (slot?.getPokemonCard() === this
        && !IS_POKEBODY_BLOCKED(store, state, StateUtils.findOwner(state, slot), this)) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Ref: set-mega-evolution/mega-kangaskhan-ex.ts (flip until tails, then apply the final series).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return flipLegacyCoinsUntilTails(store, state, effect.player, heads => {
        if (heads === 0) return;
        afterAttackDamage(state, effect, (store, state) => {
          const target = effect.opponent.active;
          const count = Math.min(heads, target.energies.cards.length);
          if (count === 0) return state;

          const move = new LostZoneCardsEffect(effect, []);
          store.reduceEffect(state, move);
          if (move.preventDefault) return state;
          return store.prompt(state, new ChooseCardsPrompt(effect.player, GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            target.energies, { superType: SuperType.ENERGY }, { min: count, max: count, allowCancel: false }), cards => {
            move.cards = cards;
            store.reduceEffect(state, move);
          });
        });
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