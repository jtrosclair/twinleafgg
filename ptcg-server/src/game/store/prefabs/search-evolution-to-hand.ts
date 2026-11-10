import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { PokemonCard } from '../card/pokemon-card';
import { Card } from '../card/card';
import { Stage, SuperType } from '../card/card-types';
import { AttackEffect } from '../effects/game-effects';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../prompts/show-cards-prompt';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { MOVE_CARDS, SHUFFLE_DECK } from './prefabs';

const EVOLUTION_STAGES = [Stage.STAGE_1, Stage.STAGE_2, Stage.VMAX, Stage.VSTAR, Stage.MEGA, Stage.BREAK];
const isEvolution = (card: unknown): card is PokemonCard => card instanceof PokemonCard && EVOLUTION_STAGES.includes(card.stage);

/** Search a private deck for an Evolution Pokémon, reveal it, and shuffle. */
export function searchEvolutionToHand(store: StoreLike, state: State, effect: AttackEffect, source: Card | undefined): State {
  const player = effect.player;
  if (!player.deck.cards.length) return state;
  const blocked = player.deck.cards.map((card, index) => isEvolution(card) ? -1 : index).filter(index => index >= 0);
  return store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_HAND, player.deck,
    { superType: SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
    if (!selected || selected.length > 1 || selected.some(card => !isEvolution(card) || !player.deck.cards.includes(card))) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    if (!selected.length) { SHUFFLE_DECK(store, state, player); return; }
    return store.prompt(state, new ShowCardsPrompt(effect.opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => {
      if (!player.deck.cards.includes(selected[0]) || !isEvolution(selected[0])) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      MOVE_CARDS(store, state, player.deck, player.hand, { cards: selected, sourceCard: source, sourceEffect: effect });
      SHUFFLE_DECK(store, state, player);
    });
  });
}
