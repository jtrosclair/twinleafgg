import { CardTag, CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { PowerType, Power } from '../../game/store/card/pokemon-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonPowersEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { State, GamePhase } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { StoreLike } from '../../game/store/store-like';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

abstract class LegendaryHalf extends TrainerCard {
  public trainerType = TrainerType.STADIUM;
  public tags = [CardTag.DUAL_STADIUM];
  public regulationMark = 'J';
  public set = 'DLR';
  public cardImage = 'assets/cardback.png';
  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    return player.hand.cards.includes(this) && player.hand.cards.some(card => card !== this
      && card.name === this.name && card.set === this.set && card.tags.includes(CardTag.DUAL_STADIUM)
      && card.setNumber !== this.setNumber);
  }
}

// LV.X keeps the previous level's Evolution Stage; Restored, LEGEND and
// V-UNION are not Evolution Pokémon (including when represented as stacks).
function isEvolutionPokemon(slot: PokemonCardList): boolean {
  const cards = slot.getPokemons();
  let top = cards[cards.length - 1];
  if (!top) return false;
  if (top.stage === Stage.LV_X) {
    top = [...cards].reverse().find(card => card.stage !== Stage.LV_X)!;
    if (!top) return false;
  }
  return [Stage.STAGE_1, Stage.STAGE_2, Stage.VMAX, Stage.VSTAR, Stage.MEGA, Stage.BREAK].includes(top.stage);
}

export class LegendaryLavaLakeLeft extends LegendaryHalf {
  public setNumber = '94'; public name = 'Legendary Pyroduct'; public fullName = 'Legendary Lava Lake (Left) M6';
  public text = "Evolution Pokémon in play (both yours and your opponent's) have no Abilities.";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (StateUtils.getStadiumCard(state) !== this) return state;
    const locked = (power: Power) => power.powerType === PowerType.ABILITY && !power.exemptFromAbilityLock && !power.useFromHand && !power.useFromDiscard;
    if (effect instanceof CheckPokemonPowersEffect && effect.target) {
      const slot = StateUtils.findPokemonSlot(state, effect.target);
      if (slot && isEvolutionPokemon(slot) && !IS_STADIUM_EFFECT_BLOCKED(store, state, StateUtils.findOwner(state, slot), slot, this)) effect.powers = effect.powers.filter(power => !locked(power));
    }
    if (effect instanceof PowerEffect && locked(effect.power)) {
      const slot = StateUtils.findPokemonSlot(state, effect.card);
      if (slot && isEvolutionPokemon(slot) && !IS_STADIUM_EFFECT_BLOCKED(store, state, StateUtils.findOwner(state, slot), slot, this)) throw new GameError(GameMessage.CANNOT_USE_POWER);
    }
    return state;
  }
}
export class LegendaryLavaLakeRight extends LegendaryLavaLakeLeft { public setNumber = '95'; public fullName = 'Legendary Lava Lake (Right) M6'; }

export class LegendarySummitLeft extends LegendaryHalf {
  public setNumber = '96'; public name = 'Legendary Summit'; public fullName = 'Legendary Summit (Left) M6';
  public text = "Whenever a [C] Pokémon (yours or your opponent's) is Knocked Out by damage from an attack from the opponent's Pokémon, that player takes 1 fewer Prize card.";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof KnockOutEffect) || StateUtils.getStadiumCard(state) !== this || state.phase !== GamePhase.ATTACK) return state;
    const ko = effect.target.attackDamageKnockOut;
    const owner = effect.player, attacker = StateUtils.getOpponent(state, owner);
    if (!ko || ko.turn !== state.turn || ko.playerId !== attacker.id || state.players[state.activePlayer] !== attacker || IS_STADIUM_EFFECT_BLOCKED(store, state, owner, effect.target, this)) return state;
    const check = new CheckPokemonTypeEffect(effect.target); store.reduceEffect(state, check);
    if (check.cardTypes.includes(CardType.COLORLESS) && effect.prizeCount > 0) effect.prizeCount--;
    return state;
  }
}
export class LegendarySummitRight extends LegendarySummitLeft { public setNumber = '97'; public fullName = 'Legendary Summit (Right) M6'; }

export class LegendaryOceanTrenchLeft extends LegendaryHalf {
  public setNumber = '98'; public name = 'Legendary Trench'; public fullName = 'Legendary Ocean Trench (Left) M6';
  public text = "Whenever a Pokémon (yours or your opponent's) is healed, double the amount of damage healed.";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof HealEffect && StateUtils.getStadiumCard(state) === this && !IS_STADIUM_EFFECT_BLOCKED(store, state, StateUtils.findOwner(state, effect.target), effect.target, this)) effect.damage *= 2;
    return state;
  }
}
export class LegendaryOceanTrenchRight extends LegendaryOceanTrenchLeft { public setNumber = '99'; public fullName = 'Legendary Ocean Trench (Right) M6'; }
