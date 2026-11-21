import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { SuperType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Effect } from '../effects/effect';
import { PokemonReplacedEffect } from '../effects/game-effects';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { StateUtils } from '../state-utils';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { getBlockedPokemonPlacementIndices } from './bench-play-reactions';
import { inheritLegacyPokemonAbilityUse } from './in-play-ability-use';
import { canReturnPokemonToHand, swapInPlayPokemon } from './pokemon-replacement';
import { ABILITY_USED, IS_ABILITY_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED } from './prefabs';

export function applyStanceChange(store: StoreLike, state: State, effect: Effect, card: PokemonCard, marker: string): State {
  if (effect instanceof PokemonReplacedEffect && effect.previousPokemon === card) {
    inheritLegacyPokemonAbilityUse(effect, marker, card.powers[0].name);
  }
  REMOVE_MARKER_AT_END_OF_TURN(effect, marker, card);
  if (!WAS_POWER_USED(effect, 0, card)) return state;

  const player = effect.player;
  const target = StateUtils.findPokemonSlot(state, card);
  if (IS_ABILITY_BLOCKED(store, state, player, card)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  if (!target || target.getPokemonCard() !== card || !canReturnPokemonToHand(store, state, player, target)) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const ineligible = player.hand.cards.flatMap((candidate, index) =>
    candidate instanceof PokemonCard && candidate.name === 'Aegislash' ? [] : [index]);
  const blocked = getBlockedPokemonPlacementIndices(store, state, player, player.hand, ineligible, card);
  if (blocked.length === player.hand.cards.length) throw new GameError(GameMessage.CANNOT_USE_POWER);

  USE_ABILITY_ONCE_PER_TURN(player, marker, card, effect.power.name);
  ABILITY_USED(player, card);
  return store.prompt(state, new ChooseCardsPrompt(
    player, GameMessage.CHOOSE_CARD_TO_HAND, player.hand,
    { superType: SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked }
  ), selected => {
    const replacement = selected?.[0];
    if (replacement instanceof PokemonCard) {
      swapInPlayPokemon(store, state, player, target, player.hand, replacement, player.hand, card);
    }
  });
}
