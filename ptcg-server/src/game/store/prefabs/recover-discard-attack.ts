import { Card } from '../card/card';
import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import { AttackEffect } from '../effects/game-effects';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../prompts/show-cards-prompt';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { MOVE_CARDS } from './prefabs';

/** Search a public discard pile, reveal the chosen cards, and put them in hand. */
export function RECOVER_DISCARD_BY_ATTACK(
  store: StoreLike, state: State, effect: AttackEffect,
  predicate: (card: Card) => boolean, max: number, optional: boolean,
): State {
  const player = effect.player;
  const source = player.discard;
  const eligible = source.cards.filter(predicate).length;
  if (eligible === 0) return state;
  const limit = Math.min(max, eligible);
  // Capture the actual attacker before copy delegation restores printed attacks.
  const attacker = effect.source.getPokemonCard();
  const blocked = source.cards.map((card, index) => predicate(card) ? -1 : index).filter(index => index >= 0);
  return store.prompt(state, new ChooseCardsPrompt(
    player, GameMessage.CHOOSE_CARD_TO_HAND, source, {},
    { min: optional ? 0 : limit, max: limit, allowCancel: optional, blocked }
  ), selected => {
    if (selected === null && optional) return;
    if (!Array.isArray(selected) || selected.length < (optional ? 0 : limit) || selected.length > limit ||
      new Set(selected).size !== selected.length || selected.some(card => !card || !source.cards.includes(card) || !predicate(card))) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    if (selected.length === 0) return;
    store.prompt(state, new ShowCardsPrompt(effect.opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => {
      MOVE_CARDS(store, state, source, player.hand, { cards: selected, sourceCard: attacker, sourceEffect: effect });
      selected.filter(card => player.hand.cards.includes(card)).forEach(card => {
        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
      });
    });
  });
}
