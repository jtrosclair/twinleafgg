import { GameMessage } from '../../game-message';
import { SpecialCondition } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Power } from '../card/pokemon-types';
import { AddSpecialConditionsPowerEffect } from '../effects/check-effects';
import { EffectOfAbilityEffect } from '../effects/game-effects';
import { SelectPrompt } from '../prompts/select-prompt';
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
  return !!effect.target;
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
    if (condition === undefined || !CAN_APPLY_ABILITY_TO_TARGET(store, state, abilityOwner, power, card, target)) {
      return;
    }
    store.reduceEffect(state, new AddSpecialConditionsPowerEffect(abilityOwner, card, target, [condition]));
  });
}
