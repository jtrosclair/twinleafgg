import { GameLog, GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { checkpointPendingEffectKnockOuts } from '../effect-reducers/check-effect';
import { ChooseAttackPrompt } from '../prompts/choose-attack-prompt';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { CoinFlipPrompt } from '../prompts/coin-flip-prompt';
import { ConfirmPrompt } from '../prompts/confirm-prompt';
import { Prompt } from '../prompts/prompt';
import { SelectPrompt } from '../prompts/select-prompt';
import { WaitPrompt } from '../prompts/wait-prompt';
import { checkpointActiveAbilityLockOrder } from '../state/active-ability-lock-order';
import { CardList } from '../state/card-list';
import { PokemonCard } from '../card/pokemon-card';
import { attackEffectKnockOuts } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { checkpointAttackDamageScopes } from './attack-after-damage';
import { checkpointCopyAttackSessions } from './copy-attack-delegation';

type Continuation = () => void;

/** A pending reducer may hold CardList, Player and Card references across prompts. */
function checkpointBoard(state: State): Continuation {
  const captured = new Set<object>();
  const restore: Continuation[] = [checkpointPendingEffectKnockOuts(state),
    checkpointCopyAttackSessions(state), checkpointActiveAbilityLockOrder(state), checkpointAttackDamageScopes(state)];
  const visit = (value: any) => {
    if (value === null || typeof value !== 'object' || captured.has(value)) return;
    captured.add(value);
    if (value instanceof PokemonCard) {
      const hit = attackEffectKnockOuts.get(value);
      restore.push(() => {
        if (hit) attackEffectKnockOuts.set(value, hit);
        else attackEffectKnockOuts.delete(value);
      });
    }
    const publicStream = (key: string) => value === state && (key === 'logs' || key === 'prompts');
    const fields = new Map(Object.keys(value).filter(key => !publicStream(key)).map(key => [key, value[key]]));
    if (!Object.isFrozen(value)) {
      const length = Array.isArray(value) ? value.length : undefined;
      restore.push(() => {
        for (const key of Object.keys(value)) {
          if (!publicStream(key) && !fields.has(key)) delete value[key];
        }
        for (const [key, previous] of fields) if (value[key] !== previous) value[key] = previous;
        if (length !== undefined) value.length = length;
      });
    }
    for (const nested of fields.values()) visit(nested);
  };
  visit(state);
  return () => restore.forEach(apply => apply());
}

function publicTargets(state: State): string {
  return state.players.map(player => [player.active, ...player.bench]
    .map(slot => slot.cards.map(card => card.id).join(',')).join(';')).join('|');
}

const activeBranches = new WeakMap<State, CopiedAttackReflipBranch>();

export function currentCopiedAttackReflipBranch(state: State): CopiedAttackReflipBranch | undefined {
  return activeBranches.get(state);
}

/**
 * Hold a copied attack's effects while the player can restart the original
 * attack. Only its public choices and coin results are shown before commitment.
 */
export class CopiedAttackReflipBranch {
  private continuationCount = 0;
  private suspended?: Continuation;
  private committed = false;
  private canceled = false;
  private bufferedLogs: Continuation[] = [];
  private afterSuspend: Continuation[] = [];
  private targets = '';
  private publicCards = new Set<Card>();
  private publicLists = new Map<CardList, Card[]>();
  private waitingForChoice = false;
  private keepResults: Continuation[] = [];

  constructor(readonly state: State, private restart: Continuation, private onClose: Continuation) {}

  run<T>(callback: () => T): T {
    if (activeBranches.get(this.state) === this) return callback();
    const restore = this.committed ? undefined : checkpointBoard(this.state);
    if (restore) {
      this.targets = publicTargets(this.state);
      this.publicLists = new Map(this.state.players.flatMap(player => [player.active, ...player.bench,
        player.discard, player.lostzone, player.stadium].map(list => [list, list.cards.slice()] as const)));
      this.publicCards = new Set([...this.publicLists.values()].flat());
      this.suspended?.();
    }
    activeBranches.set(this.state, this);
    try {
      const result = callback();
      if (this.continuationCount === 0) {
        this.commit();
        this.onClose();
      } else if (!this.committed) {
        this.suspended = checkpointBoard(this.state);
        restore?.();
      }
      return result;
    } catch (error) {
      if (!this.committed) restore?.();
      this.cancel();
      throw error;
    } finally {
      activeBranches.delete(this.state);
      const callbacks = this.afterSuspend.splice(0);
      if (!this.canceled) callbacks.forEach(resume => resume());
    }
  }

  inspect<T>(query: () => T): T {
    if (this.committed || !this.suspended) return query();
    const restore = checkpointBoard(this.state);
    this.suspended();
    try {
      return query();
    } finally {
      restore();
    }
  }

  track<T extends unknown[]>(callback: (...args: T) => void): (...args: T) => void {
    this.continuationCount++;
    return (...args) => {
      if (this.canceled) return;
      this.continuationCount--;
      this.run(() => callback(...args));
    };
  }

  offer(keep: Continuation, offerRestart: (keep: Continuation, restart: Continuation) => void): void {
    if (this.committed) return keep();
    this.keepResults.push(this.track(keep));
    if (this.waitingForChoice) return;
    this.waitingForChoice = true;
    const apply = () => {
      this.waitingForChoice = false;
      const results = this.keepResults.splice(0);
      this.run(() => results.forEach(resume => resume()));
    };
    this.afterSuspend.push(() => offerRestart(apply, () => {
      this.cancel();
      this.restart();
    }));
  }

  beforePrompts(prompts: readonly Prompt<unknown>[]): void {
    if (this.committed) return;
    const publicChoice = (prompt: Prompt<unknown>): boolean => {
      if (prompt instanceof CoinFlipPrompt || prompt instanceof WaitPrompt || prompt instanceof ConfirmPrompt) return true;
      if (prompt instanceof SelectPrompt) return prompt.message === GameMessage.CHOOSE_HEADS_OR_TAILS;
      if (prompt instanceof ChoosePokemonPrompt) return publicTargets(this.state) === this.targets;
      if (prompt instanceof ChooseAttackPrompt) return prompt.cards.every(card => this.publicCards.has(card));
      if (prompt instanceof ChooseCardsPrompt) {
        const original = this.publicLists.get(prompt.cards);
        return !!original && original.length === prompt.cards.cards.length
          && original.every((card, index) => card === prompt.cards.cards[index]);
      }
      return false;
    };
    if (!prompts.every(publicChoice)) this.commit();
  }

  log(message: GameLog, write: Continuation): void {
    if (this.committed || message === GameLog.LOG_PLAYER_FLIPS_HEADS || message === GameLog.LOG_PLAYER_FLIPS_TAILS) write();
    else this.bufferedLogs.push(write);
  }

  cancel(): void {
    this.canceled = true;
    this.suspended = undefined;
    this.bufferedLogs.length = 0;
    this.keepResults.length = 0;
    this.onClose();
  }

  private commit(): void {
    this.committed = true;
    this.suspended = undefined;
    for (const log of this.bufferedLogs.splice(0)) log();
  }
}
