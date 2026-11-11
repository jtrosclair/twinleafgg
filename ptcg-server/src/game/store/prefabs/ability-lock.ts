import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { PowerType } from '../card/pokemon-types';
import { Effect } from '../effects/effect';
import { EffectOfAbilityEffect, PowerEffect } from '../effects/game-effects';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Player } from '../state/player';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { CardTarget, PlayerType } from '../actions/play-card-action';
import { Power } from '../card/pokemon-types';
import { StateUtils } from '../state-utils';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { SlotType } from '../actions/play-card-action';

export const POKEPOWER_TYPES: PowerType[] = [PowerType.POKEPOWER];

/** Apply a card-specific Ability lock when the simulator checks a Pokémon power. */
export function HANDLE_ABILITY_BLOCK(
  effect: Effect,
  isBlocked: (target: { player: Player; card: PokemonCardList | PokemonCard }) => boolean,
  options: { powerTypes: PowerType[]; error: GameMessage },
): void {
  if (!(effect instanceof PowerEffect) || !options.powerTypes.includes(effect.power.powerType)) {
    return;
  }
  if (isBlocked({ player: effect.player, card: effect.target ?? effect.card })) {
    throw new GameError(options.error);
  }
}

/** Whether this card is currently in either player's play area. */
export function IS_ABILITY_LOCKER_IN_PLAY(state: State, player: Player, locker: PokemonCard): boolean {
  const opponent = state.players.find(candidate => candidate !== player);
  return [player, opponent].filter((candidate): candidate is Player => !!candidate).some(owner => {
    let found = false;
    owner.forEachPokemon(owner === player ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER, (_list, card) => {
      if (card === locker) found = true;
    });
    return found;
  });
}

/** Run the locker's own Poké-Power check, allowing existing blockers to suppress it. */
export function CAN_APPLY_LOCKER_ABILITY(
  store: StoreLike, state: State, player: Player, locker: PokemonCard, power: Power,
): boolean {
  try {
    store.reduceEffect(state, new PowerEffect(player, power, locker));
    return true;
  } catch {
    return false;
  }
}

/** Compatibility probe for card-specific lock callbacks in the upstream card code. */
export function CAN_APPLY_LOCK_TO_TARGET(
  store: StoreLike, state: State, owner: Player, locker: PokemonCard, power: Power,
  target: PokemonCardList | PokemonCard,
): boolean {
  try {
    const resolved = target instanceof PokemonCardList ? target : StateUtils.findCardList(state, target);
    if (!(resolved instanceof PokemonCardList)) return true;
    const cardList = resolved;
    const effect = new EffectOfAbilityEffect(owner, power, locker, cardList);
    store.reduceEffect(state, effect);
    return !!effect.target;
  } catch {
    // A card outside the play area has no attached target for protection to block.
    return true;
  }
}

/** Gust an opposing Benched Pokémon through an Ability and honor target-side protection. */
export function GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
  store: StoreLike, state: State, player: Player, power: Power, source: PokemonCard,
  options: { allowCancel?: boolean; blocked?: CardTarget[] } = {},
): State {
  const opponent = StateUtils.getOpponent(state, player);
  if (!opponent.bench.some(bench => bench.cards.length > 0)) return state;
  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.TOP_PLAYER,
    [SlotType.BENCH],
    { min: 1, max: 1, allowCancel: options.allowCancel ?? false, blocked: options.blocked ?? [] },
  ), selected => {
    const target = selected?.[0];
    if (!target) return;
    const effect = new EffectOfAbilityEffect(player, power, source, target);
    store.reduceEffect(state, effect);
    if (effect.target) opponent.switchPokemon(effect.target, store, state);
  });
}
