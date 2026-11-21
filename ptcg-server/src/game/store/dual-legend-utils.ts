import { CardTag } from './card/card-types';
import { PokemonCard } from './card/pokemon-card';
import { Player } from './state/player';

/** Returns the complementary LEGEND halves in stacking order, bottom first. */
export function getDualLegendHalvesInHand(player: Player, source: PokemonCard): PokemonCard[] {
  if (!player.hand.cards.includes(source)) return [];
  const partner = player.hand.cards.find(card => card !== source
    && card instanceof PokemonCard
    && card.name === source.name
    && card.set === source.set
    && card.setNumber !== source.setNumber
    && card.tags.includes(CardTag.LEGEND));
  // The top half is the in-play Pokémon and has the lower collector number.
  return partner instanceof PokemonCard ? [source, partner].sort((left, right) => Number(right.setNumber) - Number(left.setNumber)) : [];
}
