import { CardTag } from './card/card-types';
import { PokemonCard } from './card/pokemon-card';
import { Player } from './state/player';

/** Returns the current LEGEND card and its matching half from the player's hand. */
export function getDualLegendHalvesInHand(player: Player, source: PokemonCard): PokemonCard[] {
  const sourceIndex = player.hand.cards.indexOf(source);
  if (sourceIndex < 0) return [];
  const partner = player.hand.cards.find(card => card !== source
    && card instanceof PokemonCard
    && card.name === source.name
    && card.tags.includes(CardTag.DUAL_LEGEND));
  return partner instanceof PokemonCard ? [source, partner] : [];
}
