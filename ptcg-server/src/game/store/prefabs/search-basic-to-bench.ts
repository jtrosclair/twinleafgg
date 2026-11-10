import { GameError, GameMessage, State, StoreLike } from '../..';
import { PokemonCard } from '../card/pokemon-card';
import { Stage, SuperType } from '../card/card-types';
import { AttackEffect } from '../effects/game-effects';
import { PlayPokemonFromDeckEffect } from '../effects/play-card-effects';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { SHUFFLE_DECK } from '../prefabs/prefabs';

/** Search private deck for Basic Pokémon and put the selected cards on the Bench. */
export function searchBasicsToBench(store: StoreLike, state: State, effect: AttackEffect, max: number, names?: string[]): State {
  const player = effect.player;
  if (!player.deck.cards.length) return state;
  const available = () => player.bench.filter(slot => slot.cards.length === 0).length;
  const limit = Math.min(max, available());
  if (!limit) return SHUFFLE_DECK(store, state, player);
  const blocked = player.deck.cards.map((card, i) => !(card instanceof PokemonCard) || card.stage !== Stage.BASIC || (names && !names.includes(card.name)) ? i : -1).filter(i => i >= 0);
  return store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC }, { min: 0, max: limit, allowCancel: false, blocked }), chosen => {
    if (!chosen || chosen.length > limit || chosen.length > available() || new Set(chosen).size !== chosen.length ||
      chosen.some(card => !(card instanceof PokemonCard) || card.stage !== Stage.BASIC || !player.deck.cards.includes(card) || (names && !names.includes(card.name)))) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    for (const card of chosen) {
      const slot = player.bench.find(candidate => candidate.cards.length === 0);
      if (!slot) throw new GameError(GameMessage.INVALID_TARGET);
      store.reduceEffect(state, new PlayPokemonFromDeckEffect(player, card as PokemonCard, slot));
    }
    SHUFFLE_DECK(store, state, player);
  });
}
