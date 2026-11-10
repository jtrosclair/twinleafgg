import { Card } from '../card/card';
import { SuperType } from '../card/card-types';
import { CheckProvidedEnergyEffect } from '../effects/check-effects';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';

/** Only a card class that owns both implementations may opt into this query. */
export function ownsMirrorEnergyQuery(card: Card): boolean {
  if (Object.prototype.hasOwnProperty.call(card, 'reduceEffect') || Object.prototype.hasOwnProperty.call(card, 'reduceMirrorOnlyEnergyEffect')) return false;
  let prototype = Object.getPrototypeOf(card), reducerOwner: object | undefined, queryOwner: object | undefined;
  while (prototype && prototype !== Object.prototype) {
    if (!reducerOwner && Object.prototype.hasOwnProperty.call(prototype, 'reduceEffect')) reducerOwner = prototype;
    if (!queryOwner && Object.prototype.hasOwnProperty.call(prototype, 'reduceMirrorOnlyEnergyEffect')) queryOwner = prototype;
    prototype = Object.getPrototypeOf(prototype);
  }
  return !!queryOwner && queryOwner === reducerOwner;
}

/** Return unambiguous mirror-only cards; never modify their slot or wire state. */
export function mirrorOnlyEnergyForQuery(state: State, effect: CheckProvidedEnergyEffect): Card[] {
  const source = effect.source;
  if (!(source instanceof PokemonCardList) || !source.getPokemonCard()) return [];
  const candidates = source.energies.cards.filter(card => card.superType === SuperType.ENERGY
    && !source.cards.includes(card) && ownsMirrorEnergyQuery(card));
  if (!candidates.length) return [];
  const physical = new Set<Card>(), mirrorCount = new Map<Card, number>();
  const add = (card: Card) => {
    if (physical.has(card)) return;
    physical.add(card);
    if (card.cards && Array.isArray(card.cards.cards)) card.cards.cards.forEach(add);
  };
  for (const player of state.players) {
    for (const list of [player.deck, player.hand, player.discard, player.lostzone, player.stadium, player.supporter, ...player.prizes]) list.cards.forEach(add);
    for (const slot of [player.active, ...player.bench]) {
      slot.cards.forEach(add); slot.tools.forEach(add);
      slot.energies.cards.forEach(card => mirrorCount.set(card, (mirrorCount.get(card) ?? 0) + 1));
    }
  }
  return candidates.filter(card => !physical.has(card) && mirrorCount.get(card) === 1);
}
