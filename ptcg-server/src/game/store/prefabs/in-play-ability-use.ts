import { Card } from '../card/card';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonReplacedEffect } from '../effects/game-effects';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';

const inheritedUsePrefix = 'INHERITED_ABILITY_USE:';

function inPlaySlot(player: Player, source: Card): PokemonCardList | undefined {
  return player.getPokemonInPlay().find(slot => slot.getPokemonCard() === source);
}

export function namedAbilityUsed(slot: PokemonCardList, source: PokemonCard, abilityName: string): boolean {
  return slot.marker.hasMarker(inheritedUsePrefix + abilityName, source);
}

export function hasUsedPokemonAbility(player: Player, marker: string, source: Card, abilityName?: string): boolean {
  if (player.marker.hasMarker(marker, source)) return true;
  if (!(source instanceof PokemonCard) || !abilityName) return false;
  const slot = inPlaySlot(player, source);
  return !!slot && namedAbilityUsed(slot, source, abilityName);
}

export function recordPokemonAbilityUse(player: Player, marker: string, source: Card, abilityName?: string): void {
  if (abilityName && inPlaySlot(player, source)) {
    player.marker.addMarker(marker, source, 'ability-use', undefined, abilityName);
  } else {
    player.marker.addMarker(marker, source);
  }
}

export function clearRecordedPokemonAbilityUses(player: Player, cards: readonly PokemonCard[]): void {
  player.marker.markers = player.marker.markers.filter(marker =>
    !marker.abilityName || !cards.some(card => card === marker.source));
}

/** Keep the Ability's name with this in-play Pokémon, including through intermediate forms. */
export function inheritPokemonAbilityUses(effect: PokemonReplacedEffect): void {
  const { player, target, previousPokemon, pokemonCard } = effect;
  for (const marker of target.marker.markers) {
    if (marker.name.startsWith(inheritedUsePrefix) && marker.source === previousPokemon) {
      marker.source = pokemonCard;
    }
  }
  for (const marker of effect.previousMarkers) {
    if (marker.abilityName) {
      target.marker.addMarker(inheritedUsePrefix + marker.abilityName, pokemonCard, 'ability-use', 'pokemon');
    }
  }
  clearRecordedPokemonAbilityUses(player, [previousPokemon, pokemonCard]);
}

/** Saved boards can still contain a card's original marker without the Ability name. */
export function inheritLegacyPokemonAbilityUse(effect: PokemonReplacedEffect, marker: string, abilityName: string): void {
  const { player, target, previousPokemon, pokemonCard } = effect;
  if (effect.previousMarkers.some(item => item.name === marker)) {
    target.marker.addMarker(inheritedUsePrefix + abilityName, pokemonCard, 'ability-use', 'pokemon');
  }
  player.marker.removeMarker(marker, previousPokemon);
  player.marker.removeMarker(marker, pokemonCard);
}
