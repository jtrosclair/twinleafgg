import { PlayerType, SlotType } from '../actions/play-card-action';
import { GameMessage } from '../../game-message';
import { SpecialCondition, SuperType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Power } from '../card/pokemon-types';
import { isBeforeWeaknessDamage } from '../effects/attack-effects';
import { Effect } from '../effects/effect';
import { IS_ABILITY_BLOCKED, MOVE_CARDS, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT } from './prefabs';
import { AddSpecialConditionsPowerEffect } from '../effects/check-effects';
import { EffectOfAbilityEffect } from '../effects/game-effects';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
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
  if (!isBeforeWeaknessDamage(effect)) {
    return;
  }
  if (effect.damage > 0 && effect.source === effect.player.active && owner !== effect.player
    && !IS_ABILITY_BLOCKED(store, state, owner, card)
    && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, card.powers[0], card, effect.source)) {
    effect.attackDamageReductionBeforeWeakness += amount;
  }
}

/** Retaliation that discards one of the original attacker's attached Energy cards. */
export function DISCARD_ATTACKER_ENERGY_FROM_ABILITY(
  store: StoreLike,
  state: State,
  effect: Effect,
  card: PokemonCard,
): State {
  if (!ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: card })
    || effect.target.getPokemonCard() !== card) return state;

  const owner = StateUtils.findOwner(state, effect.target);
  if (IS_ABILITY_BLOCKED(store, state, owner, card)) return state;
  return DISCARD_ENERGY_FROM_ABILITY(store, state, owner, card.powers[0], card, effect.source);
}

/** Let the Ability owner discard one Energy from a Pokémon it can affect. */
export function DISCARD_ENERGY_FROM_ABILITY(
  store: StoreLike,
  state: State,
  owner: Player,
  power: Power,
  card: PokemonCard,
  target: PokemonCardList,
): State {
  if (!target.cards.some(attached => attached.superType === SuperType.ENERGY)
    || !CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, power, card, target)) return state;

  const discard = StateUtils.findOwner(state, target).discard;
  return store.prompt(state, new ChooseCardsPrompt(
    owner, GameMessage.CHOOSE_CARD_TO_DISCARD, target,
    { superType: SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false },
  ), cards => MOVE_CARDS(store, state, target, discard, { cards, sourceCard: card, sourceEffect: power }));
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
