import { CardType } from '../card/card-types';
import type { EnergyCard } from '../card/energy-card';
import { ApplyWeaknessEffect } from '../effects/attack-effects';
import { CheckPokemonTypeEffect } from '../effects/check-effects';
import type { Effect } from '../effects/effect';
import type { PokemonCardList } from '../state/pokemon-card-list';
import type { State } from '../state/state';
import type { StoreLike } from '../store-like';

export function hasDarknessType(store: StoreLike, state: State, slot: PokemonCardList): boolean {
  const type = new CheckPokemonTypeEffect(slot);
  store.reduceEffect(state, type);
  return type.cardTypes.includes(CardType.DARK);
}

export function hasDarkInName(slot: PokemonCardList): boolean {
  return slot.getPokemonCard()?.name.startsWith('Dark ') === true;
}

/** Apply this printing's bonus in the attacking Pokémon's damage step. */
export function applySpecialDarknessEnergyBonus(
  store: StoreLike, state: State, effect: Effect, energy: EnergyCard, allowDarkInName = false
): void {
  if (!(effect instanceof ApplyWeaknessEffect) || effect.damage <= 0 || !effect.source.cards.includes(energy)
    || (effect.target !== effect.opponent.active && !(effect.source === effect.player.active && effect.target === effect.source))) return;

  if ((allowDarkInName && hasDarkInName(effect.source)) || hasDarknessType(store, state, effect.source)) {
    effect.damage += 10;
  }
}
