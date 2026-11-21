import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { CardTag } from '../card/card-types';
import { CheckPrizesDestinationEffect } from '../effects/check-effects';
import { DrawPrizesEffect, PrizeReaction } from '../effects/game-effects';
import { GameStatsTracker } from '../game-stats-tracker';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { ChoosePrizePrompt } from '../prompts/choose-prize-prompt';
import { ConfirmPrompt } from '../prompts/confirm-prompt';
import { SelectPrompt } from '../prompts/select-prompt';
import { CardList } from '../state/card-list';
import { Player } from '../state/player';
import { GamePhase, State } from '../state/state';
import { StoreLike } from '../store-like';

export interface TakeSpecificPrizesOptions {
  destination?: CardList;
  skipReduce?: boolean;
  reservedPrizes?: readonly CardList[];
}

export interface TakeXPrizesOptions extends TakeSpecificPrizesOptions {
  promptOptions?: {
    allowCancel?: boolean;
    blocked?: number[];
  };
}

export function isPrizeOwnerTurn(state: State, player: Player): boolean {
  return state.players[state.activePlayer] === player
    && (state.phase === GamePhase.PLAYER_TURN || state.phase === GamePhase.ATTACK);
}

export function countPrizesTaken(player: Player, count: number): void {
  if (count <= 0) return;
  player.prizesTaken += count;
  player.prizesTakenThisTurn += count;
  GameStatsTracker.trackPrizeTaken(player, count);
}

export function takePrizeTo(player: Player, prize: CardList, destination: CardList): void {
  const count = prize.cards.length;
  if (destination === player.discard) {
    prize.moveCardsTo(prize.cards.filter(card => card.tags.includes(CardTag.PRISM_STAR)), player.lostzone);
  }
  prize.moveTo(destination);
  countPrizesTaken(player, count);
}

function resolvePrizeReactions(store: StoreLike, state: State, player: Player, pending: PrizeReaction[], finish: () => void): void {
  const eligible = pending.filter(reaction => reaction.prize.cards.includes(reaction.card) && reaction.canUse());
  if (!eligible.length) {
    finish();
    return;
  }

  const ask = (reaction: PrizeReaction): void => {
    store.prompt(state, new ConfirmPrompt(player.id, reaction.message), accepted => {
      const next = () => resolvePrizeReactions(store, state, player, pending.filter(entry => entry !== reaction), finish);
      if (!accepted || !reaction.prize.cards.includes(reaction.card) || !reaction.canUse()) {
        next();
        return;
      }
      // Schedule the sibling after this reaction, including any waits or
      // additional Prize reactions it creates.
      store.waitPrompt(state, next);
      reaction.use();
    });
  };

  if (eligible.length === 1) {
    ask(eligible[0]);
    return;
  }

  store.prompt(state, new SelectPrompt(player.id, GameMessage.CHOOSE_PRIZE_EFFECT_ORDER,
    eligible.map(reaction => reaction.card.name), { allowCancel: false }), index => {
    if (!Number.isInteger(index) || !eligible[index]) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    ask(eligible[index]);
  });
}

export function TAKE_SPECIFIC_PRIZES(
  store: StoreLike, state: State, player: Player, prizes: CardList[], options: TakeSpecificPrizesOptions = {},
  onComplete?: () => void,
): void {
  const selected = prizes.filter(prize => player.prizes.includes(prize) && prize.cards.length > 0);
  if (!selected.length || options.skipReduce) {
    for (const prize of selected) takePrizeTo(player, prize, player.hand);
    onComplete?.();
    return;
  }

  const destinationCheck = new CheckPrizesDestinationEffect(player, options.destination ?? player.hand);
  store.reduceEffect(state, destinationCheck);
  const destination = destinationCheck.preventDefault ? options.destination ?? player.hand : destinationCheck.destination;
  // Billowing Smoke and Lost Block apply to each Prize individually. The
  // player sees the awarded cards and chooses which go to the discard pile.
  if (options.destination === player.discard && destination === player.lostzone) {
    const choices = new CardList();
    choices.cards = selected.flatMap(prize => prize.cards);
    store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_PRIZES_TO_DISCARD_OR_LOST_ZONE,
      choices, {}, { min: 0, max: choices.cards.length, allowCancel: false }), discarded => {
      for (const prize of selected) {
        takePrizeTo(player, prize, discarded?.includes(prize.cards[0]) ? player.discard : player.lostzone);
      }
      onComplete?.();
    });
    return;
  }

  const effect = new DrawPrizesEffect(player, selected, destination, [...(options.reservedPrizes ?? []), ...selected]);
  store.reduceEffect(state, effect);
  if (effect.preventDefault) {
    onComplete?.();
    return;
  }

  const finish = (): void => {
    for (const prize of selected) takePrizeTo(player, prize, effect.destination);
    onComplete?.();
  };
  resolvePrizeReactions(store, state, player, [...effect.reactions.values()], finish);
}

export function TAKE_X_PRIZES(
  store: StoreLike, state: State, player: Player, count: number, options: TakeXPrizesOptions = {},
  callback?: (chosenPrizes: CardList[]) => void,
): State {
  const { promptOptions = {}, reservedPrizes = [], ...takeOptions } = options;
  const available = player.prizes.filter(prize => prize.cards.length > 0);
  const blocked = available.flatMap((prize, index) =>
    reservedPrizes.includes(prize) || promptOptions.blocked?.includes(index) ? [index] : []);
  const amount = Math.min(count, available.length - blocked.length);
  if (amount <= 0) {
    callback?.([]);
    return state;
  }
  const prompt = new ChoosePrizePrompt(player.id, GameMessage.CHOOSE_PRIZE_CARD,
    { count: amount, allowCancel: false, ...promptOptions, blocked });
  return store.prompt(state, prompt, result => {
    if (!prompt.validate(result, state)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    if (result == null) {
      callback?.([]);
      return;
    }
    TAKE_SPECIFIC_PRIZES(store, state, player, result, { ...takeOptions, reservedPrizes }, () => callback?.(result));
  });
}

export function takeBonusPrize(store: StoreLike, state: State, effect: DrawPrizesEffect): State {
  return TAKE_X_PRIZES(store, state, effect.player, 1, { reservedPrizes: effect.reservedPrizes });
}
