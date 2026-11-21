import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, IS_POKEBODY_BLOCKED, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MachampLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  public evolvesFrom = 'Machamp';
  public cardType: CardType = F;
  public tags = [CardTag.POKEMON_LV_X];
  public hp: number = 150;
  public weakness = [{ type: P, value: 40 }];
  public retreat = [C, C, C];

  public powers = [
    {
      name: 'LV.X Rule',
      powerType: PowerType.LV_X_RULE,
      text: 'Put this card onto your Active Machamp. Machamp LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
    },
    {
      name: 'No Guard',
      powerType: PowerType.POKEBODY,
      text: 'As long as Machamp is your Active Pokémon, each of Machamp\'s attacks does 60 more damage to the Active Pokémon (before applying Weakness and Resistance) and any damage done to Machamp by your opponent\'s Pokémon is increased by 60 (after applying Weakness and Resistance).'
    }
  ];

  public attacks = [{
    name: 'Strong-Willed',
    cost: [F, C, C],
    damage: 20,
    text: 'During your opponent\'s next turn, if Machamp would be Knocked Out by damage from an attack, flip a coin. If heads, Machamp is not Knocked Out and its remaining HP becomes 10 instead.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Machamp';
  public fullName: string = 'Machamp LV.X SF';

  public readonly PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-scarlet-and-violet/vitality-band.ts (attacking Active bonus before Weakness).
    if (effect instanceof DealDamageEffect && effect.damage > 0 && effect.source === effect.player.active
      && effect.source.getPokemonCard() === this && (effect.target === effect.opponent.active || effect.target === effect.source)
      && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      effect.damage += 60;
    }

    // Ref: set-twilight-masquerade/cornerstone-mask-ogerpon-ex.ts (the Active defender).
    if (effect instanceof PutDamageEffect && effect.damage > 0 && !effect.ignoresDefendingDamageEffects
      && effect.target === effect.opponent.active && effect.target.getPokemonCard() === this
      && !IS_POKEBODY_BLOCKED(store, state, effect.opponent, this)) {
      effect.damage += 60;
    }

    // Ref: game/store/prefabs/attack-after-damage.ts (survival after all attack effects).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const attacker = effect.source.getPokemonCard();
      if (attacker) ADD_MARKER(MarkerConstants.STRONG_WILLED, effect.source, attacker);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this);

    if (effect instanceof EndTurnEffect) {
      //Remove the marker at the end of the opponent's turn.
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        REMOVE_MARKER(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, cardList, this);
      });
    }

    //Lv. X Stuff
    // making sure it gets put on the active pokemon
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) { throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }
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

    if (effect instanceof CheckPokemonPowersEffect) {
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