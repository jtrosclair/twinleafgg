import { Card } from './card';
import { SuperType } from './card-types';
import { State } from '../state/state';
import { PokemonCardList } from '../state/pokemon-card-list';

/** Trusted card definitions opt in; no mutable form flags are accepted from wire data. */
export interface PokemonEnergyRole {
  isEnergyWhenAttached(): boolean;
}

type Zone = { cards: Card[]; energies?: { cards: Card[] } };

export function supportsPokemonEnergyRole(card: Card): boolean {
  return card instanceof Card &&
    typeof (card as unknown as Partial<PokemonEnergyRole>).isEnergyWhenAttached === 'function' &&
    (card as unknown as PokemonEnergyRole).isEnergyWhenAttached() === true;
}

/** Restore derived form after all Ref aliases exist; ambiguous legacy placements stay untouched. */
export function restorePokemonEnergyRoles(state: State): void {
  if (!state || !Array.isArray(state.players)) { return; }
  const primary = new Map<Card, { count: number; zone: Zone }>();
  const mirrors = new Map<Card, number>();
  const slots: PokemonCardList[] = [];
  const visit = (zone: Zone | undefined) => {
    if (!zone || !Array.isArray(zone.cards)) { return; }
    for (const card of zone.cards) {
      const seen = primary.get(card);
      primary.set(card, { count: (seen?.count ?? 0) + 1, zone });
    }
  };
  for (const player of state.players) {
    if (!player || typeof player !== 'object') { continue; }
    for (const zone of [player.hand, player.deck, player.discard, player.lostzone,
      player.stadium, player.supporter, ...(Array.isArray(player.prizes) ? player.prizes : [])]) { visit(zone); }
    for (const slot of [player.active, ...(Array.isArray(player.bench) ? player.bench : [])]) {
      visit(slot);
      if (!(slot instanceof PokemonCardList) || !Array.isArray(slot.cards) ||
        !slot.cards.every(card => card instanceof Card) || !Array.isArray(slot.tools) ||
        !Array.isArray(slot.energies?.cards)) { continue; }
      slots.push(slot);
      for (const card of Array.isArray(slot.tools) ? slot.tools : []) { visit({ cards: [card] }); }
      for (const card of slot.energies.cards) { mirrors.set(card, (mirrors.get(card) ?? 0) + 1); }
    }
  }
  for (const slot of slots) {
    // An attachment needs a distinct current holder; preserve malformed self-only
    // or empty-slot legacy data without inventing an Energy form. Use trusted
    // class behavior rather than a similarly named field supplied on the wire.
    if (PokemonCardList.prototype.getPokemons.call(slot).length === 0) { continue; }
    for (const card of slot.energies!.cards) {
      const placement = primary.get(card);
      if (placement?.count === 1 && placement.zone === slot && mirrors.get(card) === 1 && supportsPokemonEnergyRole(card)) {
        card.superType = SuperType.ENERGY;
      }
    }
  }
}
