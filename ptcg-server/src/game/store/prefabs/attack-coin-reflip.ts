import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { AttackEffect } from '../effects/game-effects';
import { CheckAttackCoinReflipEffect, CoinFlipEffect } from '../effects/play-card-effects';
import { CoinFlipPrompt } from '../prompts/coin-flip-prompt';
import { ConfirmPrompt } from '../prompts/confirm-prompt';
import { Prompt } from '../prompts/prompt';
import { SelectPrompt } from '../prompts/select-prompt';
import { ShowCardsPrompt, publicAttackReveals } from '../prompts/show-cards-prompt';
import { Player } from '../state/player';
import { GamePhase, State } from '../state/state';
import { StoreLike } from '../store-like';
import { getAttackPayment } from './attack-after-damage';
import { currentCopiedAttackReflipBranch } from './copied-attack-reflip-branch';

export const COIN_REFLIP_AGAIN_USED = 'COIN_REFLIP_AGAIN_USED';
export const LEGACY_GLIMWOOD_REFLIP_USED = 'GLIMWOOD_REFLIP_USED';

// A defensive effect can request its own coins while an attack is in progress.
// Keep their origin through prompts opened by that effect.
const nonAttackFlips = new WeakSet<State>();
const sequencePrompts = new WeakSet<CoinFlipPrompt>();

export function withoutAttackReflips<T>(state: State, resolve: () => T): T {
  if (nonAttackFlips.has(state)) return resolve();
  nonAttackFlips.add(state);
  try {
    return resolve();
  } finally {
    nonAttackFlips.delete(state);
  }
}

export function suppressesAttackReflips(state: State): boolean {
  return nonAttackFlips.has(state);
}

function getReflipPlayer(state: State): Player | undefined {
  if (state.phase !== GamePhase.ATTACK || nonAttackFlips.has(state)) return undefined;
  const player = state.players[state.activePlayer];
  if (!player || player.marker.hasMarker(COIN_REFLIP_AGAIN_USED) || player.marker.hasMarker(LEGACY_GLIMWOOD_REFLIP_USED)) return undefined;
  return player;
}

function getReflipSources(store: StoreLike, state: State, flipperIds: readonly number[]) {
  const player = getReflipPlayer(state);
  const attack = player && getAttackPayment(state, player);
  if (!player || (!attack && !flipperIds.includes(player.id))) return;
  const check = new CheckAttackCoinReflipEffect(player, attack?.source ?? player.active, flipperIds.includes(player.id));
  store.reduceEffect(state, check);
  if (check.sources.size) return { player, options: [...check.sources] };
}

/** Offer one replacement for the whole set before any outcomes are applied. */
export function offerAttackCoinReflip(
  store: StoreLike, state: State, keep: () => void, repeat: () => void, flipperIds: readonly number[],
): void {
  const branch = !suppressesAttackReflips(state) && currentCopiedAttackReflipBranch(state);
  if (branch) {
    // The outer coin was flipped by the attacker even when the copied
    // attack asks the defender to flip (for example with Retry Badge).
    const attacker = state.players[state.activePlayer];
    branch.offer(keep, (accept, restart) => offerAttackCoinReflip(store, state, accept, restart,
      attacker ? [...flipperIds, attacker.id] : flipperIds));
    return;
  }
  const sources = getReflipSources(store, state, flipperIds);
  if (!sources) return keep();
  const { player, options } = sources;

  const use = ([label, card]: [string, Card]) => {
    player.marker.addMarkerToState(COIN_REFLIP_AGAIN_USED);
    if (card.name === 'Glimwood Tangle') store.log(state, GameLog.LOG_PLAYER_REFLIPS_WITH_GLIMWOOD_TANGLE, { name: player.name });
    else store.log(state, GameLog.LOG_PLAYER_REFLIPS_WITH_CARD, { name: player.name, card: label });
    repeat();
  };
  if (options.length === 1) {
    store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_REFLIP_ATTACK_COINS),
      accepted => accepted ? use(options[0]) : keep());
    return;
  }
  store.prompt(state, new SelectPrompt(player.id, GameMessage.CHOOSE_ATTACK_COIN_REFLIP,
    options.map(([label]) => label)), selection => {
    if (selection == null) return keep();
    if (!Number.isInteger(selection) || !options[selection]) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    use(options[selection]);
  });
}

/** A copy made on heads belongs to the same sequence as its first coin. */
export function flipToCopyAttack(
  store: StoreLike, state: State, effect: AttackEffect, copy: () => State, legacyPrompt = false,
): State {
  const resolve = (heads: boolean) => {
    if (!heads) return;
    if (store.runReflippableCopy && getReflipSources(store, state, [effect.player.id])) {
      store.runReflippableCopy(state, copy, flip);
    } else {
      copy();
    }
  };
  const flip = () => legacyPrompt
    ? store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), resolve)
    : store.reduceEffect(state, new CoinFlipEffect(effect.player, resolve));
  return flip();
}

/** A printed reveal is visible to both players before the next attack coin. */
export function revealCardsBeforeAttackCoins(
  store: StoreLike, state: State, effect: AttackEffect, cards: Card[], then: () => void,
): State {
  const options = { sourcePlayerId: effect.player.id };
  const owner = new ShowCardsPrompt(effect.player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, cards, options);
  const opponent = new ShowCardsPrompt(effect.opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards, options);
  publicAttackReveals.add(owner);
  publicAttackReveals.add(opponent);
  return store.prompt(state, [owner, opponent], then);
}

/** Legacy attack handlers submit one prompt or a single batch of coin prompts. */
export function legacyAttackCoinGroup(state: State, prompts: Prompt<any>[]): CoinFlipPrompt[] | undefined {
  const player = getReflipPlayer(state);
  if (!player || !getAttackPayment(state, player) || !prompts.length) return undefined;
  if (prompts.every(prompt => prompt instanceof CoinFlipPrompt && !sequencePrompts.has(prompt)
    && (prompt.message === GameMessage.COIN_FLIP || prompt.message === GameMessage.FLIP_COIN))) return prompts as CoinFlipPrompt[];
}

/** Keep the client coin prompts for older attacks that flip until tails. */
export function flipLegacyCoinsUntilTails(
  store: StoreLike, state: State, player: Player, apply: (heads: number) => void,
): State {
  const flip = (heads: number, finish: (count: number) => void): State => {
    const prompt = new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP);
    sequencePrompts.add(prompt);
    return store.prompt(state, prompt, result => {
      if (result) flip(heads + 1, finish);
      else finish(heads);
    });
  };
  return flip(0, heads => offerAttackCoinReflip(store, state, () => apply(heads), () => flip(0, apply), [player.id]));
}

/** Resolve the printed base or bonus once the player keeps a coin sequence. */
export function flipLegacyCoinsForDamage(
  store: StoreLike, state: State, effect: AttackEffect, damagePerHeads: number,
): State {
  return flipLegacyCoinsUntilTails(store, state, effect.player, heads => {
    const damage = heads * damagePerHeads;
    if (effect.attack.damageCalculation === '+') {
      effect.damage += damage;
    } else {
      effect.damage = damage === 0 ? 0 : Math.max(0, effect.damage + damage - effect.attack.damage);
    }
  });
}
