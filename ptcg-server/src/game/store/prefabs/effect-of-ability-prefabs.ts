import { PlayerType, SlotType } from '../actions/play-card-action';
import { GameMessage } from '../../game-message';
import { SpecialCondition } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Power } from '../card/pokemon-types';
import { ApplyWeaknessEffect, PutDamageEffect } from '../effects/attack-effects';
import { Effect } from '../effects/effect';
import { IS_ABILITY_BLOCKED } from './prefabs';
import { AddSpecialConditionsPowerEffect } from '../effects/check-effects';
import { EffectOfAbilityEffect } from '../effects/game-effects';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { SelectPrompt } from '../prompts/select-prompt';
import { StateUtils } from '../state-utils';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Player } from '../state/player';
import { State } from '../state/state';
import { StoreLike } from '../store-like';

/** Probe target-side Ability protection before applying an Ability effect. */
export function CAN_APPLY_ABILITY_TO_TARGET(
  store: StoreLike,
  state: State,
  abilityOwner: Player,
  power: Power,
  card: PokemonCard,
  target: PokemonCardList,
): boolean {
  const effect = new EffectOfAbilityEffect(abilityOwner, power, card, target);
  store.reduceEffect(state, effect);
  return !effect.preventDefault && !!effect.target;
}

/** Choose an opposing Benched Pokémon, then apply Ability protection to that choice. */
export function GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
  store: StoreLike,
  state: State,
  player: Player,
  power: Power,
  card: PokemonCard,
): State {
  const opponent = StateUtils.getOpponent(state, player);
  if (!opponent.bench.some(slot => slot.getPokemonCard())) return state;

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.TOP_PLAYER,
    [SlotType.BENCH], { allowCancel: false },
  ), ([target]) => {
    if (target?.getPokemonCard() && opponent.bench.includes(target)
      && CAN_APPLY_ABILITY_TO_TARGET(store, state, player, power, card, target)) {
      opponent.switchPokemon(target, store, state);
    }
  });
}

/** Apply an attacker-side Ability reduction at the pre-Weakness stage. */
export function REDUCE_ATTACK_DAMAGE_FROM_ABILITY(
  store: StoreLike,
  state: State,
  effect: Effect,
  owner: Player,
  card: PokemonCard,
  amount: number,
): void {
  if (!(effect instanceof ApplyWeaknessEffect)
    && !(effect instanceof PutDamageEffect && !effect.weaknessApplied && effect.target !== effect.opponent.active)) {
    return;
  }
  if (effect.damage > 0 && effect.source === effect.player.active && owner !== effect.player
    && !IS_ABILITY_BLOCKED(store, state, owner, card)
    && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, card.powers[0], card, effect.source)) {
    effect.attackDamageReductionBeforeWeakness += amount;
  }
}

export function APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
  store: StoreLike,
  state: State,
  abilityOwner: Player,
  power: Power,
  card: PokemonCard,
  target: PokemonCardList,
  conditions: SpecialCondition[],
  poisonDamage?: number,
): State {
  if (!target.getPokemonCard() || !CAN_APPLY_ABILITY_TO_TARGET(store, state, abilityOwner, power, card, target)) {
    return state;
  }
  return store.reduceEffect(state,
    new AddSpecialConditionsPowerEffect(abilityOwner, card, target, conditions, poisonDamage));
}

/** Let the player choose and apply one Ability-sourced Special Condition. */
export function CHOOSE_SPECIAL_CONDITION_FROM_ABILITY(
  store: StoreLike,
  state: State,
  abilityOwner: Player,
  power: Power,
  card: PokemonCard,
  target: PokemonCardList,
  conditions: SpecialCondition[],
): State {
  const labels: Partial<Record<SpecialCondition, GameMessage>> = {
    [SpecialCondition.BURNED]: GameMessage.SPECIAL_CONDITION_BURNED,
    [SpecialCondition.CONFUSED]: GameMessage.SPECIAL_CONDITION_CONFUSED,
    [SpecialCondition.POISONED]: GameMessage.SPECIAL_CONDITION_POISONED,
    [SpecialCondition.ASLEEP]: GameMessage.SPECIAL_CONDITION_ASLEEP,
    [SpecialCondition.PARALYZED]: GameMessage.SPECIAL_CONDITION_PARALYZED,
  };
  const options = conditions.map(condition => labels[condition]).filter((label): label is GameMessage => !!label);
  return store.prompt(state, new SelectPrompt(
    abilityOwner.id,
    GameMessage.CHOOSE_SPECIAL_CONDITION,
    options,
    { allowCancel: false },
  ), choice => {
    const condition = conditions[choice];
    if (condition === undefined) {
      return;
    }
    return APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(store, state, abilityOwner, power, card, target, [condition]);
  });
}
