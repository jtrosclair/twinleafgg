import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { State, GamePhase, GameWinner } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { StoreLike } from '../../game/store/store-like';
import { Mightyena } from '../set-ascended-heroes/mightyena';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

class Energy extends EnergyCard { public name = 'Test Energy'; public fullName = 'Test Energy TST'; public set = 'TST'; public provides = [CardType.DARK, CardType.DARK]; }
class Defender extends PokemonCard { public name = 'Defender'; public fullName = 'Defender TST'; public set = 'TST'; public hp = 300; public stage = Stage.BASIC; }
class Protected extends Defender {
  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EffectOfAttackEffect && effect.target.cards.includes(this)) effect.preventDefault = true;
    return state;
  }
}
class DamageSwitch extends Defender {
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.target.getPokemonCard() === this) {
      const target = effect.opponent.bench.find(slot => !!slot.getPokemonCard());
      if (target) effect.opponent.switchPokemon(target, store, state);
    }
    return state;
  }
}
class BenchSwitch extends Defender {
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.target === effect.opponent.active) {
      const slot = effect.opponent.bench.find(bench => bench.cards.includes(this));
      if (slot) effect.opponent.switchPokemon(slot, store, state);
    }
    return state;
  }
}
function battle(replaceOnDamage: boolean, withBench = true) {
  const state = new State(), player = new Player(), opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.phase = GamePhase.PLAYER_TURN; state.turn = 3; state.activePlayer = 0;
  const card = new Mightyena(), target = opponent.active;
  player.active.cards = [card, new Energy()]; target.cards = [replaceOnDamage ? new DamageSwitch() : new Defender()];
  const replacement = new PokemonCardList(); replacement.cards = [new Defender()]; opponent.bench = withBench ? [replacement] : [];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, card, target, replacement, store };
}
function attack(b: ReturnType<typeof battle>) {
  b.store.reduceEffect(b.state, new UseAttackEffect(b.player, b.card.attacks[0]));
  const wait = b.state.prompts.find(p => p instanceof WaitPrompt && p.result === undefined);
  if (!wait) throw new Error('Expected attack animation');
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(wait.id, null));
}
function copyAttack(b: ReturnType<typeof battle>) {
  const mew = new Mewex();
  b.player.active.cards = [mew, new Energy()];
  const source = new PokemonCardList(); source.cards = [b.card]; b.player.bench = [source];
  b.store.reduceEffect(b.state, new PowerEffect(b.player, mew.powers[0], mew));
  const choose = b.state.prompts.find(p => p instanceof ChooseAttackPrompt && p.result === undefined) as ChooseAttackPrompt;
  if (!choose) throw new Error('Expected copied attack choice');
  expect(choose.cards).toContain(b.card);
  const selected = choose.decode({ index: choose.cards.indexOf(b.card), attack: 'Kick Away' }, b.state);
  expect(selected).toBe(b.card.attacks[0]);
  expect(choose.validate(selected)).toBe(true);
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(choose.id, selected));
  expect(b.state.copiedAttackCheckpoints?.some(session =>
    session.copycatCard === mew && session.sourceCard === b.card && session.attackIndex === 0)).toBe(true);
  const wait = b.state.prompts.find(p => p instanceof WaitPrompt && p.result === undefined);
  // Delegated attacks may queue their switch choice before the outer attack
  // animation; an attack with no switch reaches the animation immediately.
  if (wait) (b.store as any).reducePrompt(b.state, new ResolvePromptAction(wait.id, null));
}
function seedGame(b: ReturnType<typeof battle>) {
  for (const player of [b.player, b.opponent]) {
    player.prizes = Array.from({ length: 2 }, () => { const prize = new CardList(); prize.cards = [new Energy()]; return prize; });
    player.deck.cards = [new Energy(), new Energy(), new Energy()];
  }
}

describe('Mightyena ASC Kick Away', () => {
  it('does damage to the original Active before the opponent chooses a switch', () => {
    const b = battle(false); attack(b);
    expect(b.target.damage).toBe(50);
    const choose = b.state.prompts.find(p => p instanceof ChoosePokemonPrompt && p.result === undefined) as ChoosePokemonPrompt;
    expect(choose).toBeDefined(); expect(choose.playerId).toBe(b.opponent.id);
    (b.store as any).reducePrompt(b.state, new ResolvePromptAction(choose.id, [b.replacement]));
    expect(b.opponent.active).toBe(b.replacement);
    expect(b.opponent.bench).toContain(b.target);
  });
  it('does not switch a replacement that moved Active during damage', () => {
    const b = battle(true); attack(b);
    expect(b.target.damage).toBe(50);
    expect(b.opponent.active).toBe(b.replacement);
    expect(b.state.prompts.some(p => p instanceof ChoosePokemonPrompt && p.result === undefined)).toBe(false);
  });
  it('does not request a switch if the opponent has no Bench', () => {
    const b = battle(false, false); attack(b);
    expect(b.target.damage).toBe(50);
    expect(b.opponent.active).toBe(b.target);
    expect(b.state.prompts.some(p => p instanceof ChoosePokemonPrompt && p.result === undefined)).toBe(false);
  });
  it('respects the defender’s protection from effects of attacks', () => {
    const b = battle(false); b.target.cards = [new Protected()]; attack(b);
    expect(b.target.damage).toBe(50);
    expect(b.opponent.active).toBe(b.target);
    expect(b.state.prompts.some(p => p instanceof ChoosePokemonPrompt && p.result === undefined)).toBe(false);
  });
  for (const copied of [false, true]) {
    it(`${copied ? 'copied' : 'direct'} lethal damage switches first, then KOs the damaged Pokémon and awards one prize`, () => {
      const b = battle(false); seedGame(b);
      const prize = b.player.prizes[0].cards[0];
      const original = b.target.getPokemonCard()!; original.hp = 40;
      copied ? copyAttack(b) : attack(b);
      expect(b.target.damage).toBe(50);
      const choose = b.state.prompts.find(p => p instanceof ChoosePokemonPrompt && p.result === undefined);
      expect(choose).toBeDefined(); expect(choose!.playerId).toBe(b.opponent.id);
      b.store.dispatch(new ResolvePromptAction(choose!.id, [b.replacement]));
      const wait = b.state.prompts.find(p => p instanceof WaitPrompt && p.result === undefined);
      if (wait) b.store.dispatch(new ResolvePromptAction(wait.id, null));
      expect(b.opponent.active).toBe(b.replacement);
      expect(b.replacement.damage).toBe(0);
      expect(b.opponent.discard.cards).toContain(original);
      expect(b.player.getPrizeLeft()).toBe(1);
      expect(b.player.hand.cards).toContain(prize);
      expect(b.opponent.getPrizeLeft()).toBe(2);
    });
    it(`${copied ? 'copied' : 'direct'} lethal damage with no Bench needs no switch and ends the game`, () => {
      const b = battle(false, false); seedGame(b);
      const prize = b.player.prizes[0].cards[0];
      const original = b.target.getPokemonCard()!; original.hp = 40;
      copied ? copyAttack(b) : attack(b);
      expect(b.state.prompts.some(p => p instanceof ChoosePokemonPrompt && p.result === undefined)).toBe(false);
      expect(b.opponent.discard.cards).toContain(original);
      expect(b.player.getPrizeLeft()).toBe(1);
      expect(b.player.hand.cards).toContain(prize);
      expect(b.state.phase).toBe(GamePhase.FINISHED);
      expect(b.state.winner).toBe(GameWinner.PLAYER_1);
    });
  }
  it('offers the opposing player a switch when Mew copies the attack', () => {
    const b = battle(false); copyAttack(b);
    expect(b.target.damage).toBe(50);
    const choose = b.state.prompts.find(p => p instanceof ChoosePokemonPrompt && p.result === undefined);
    expect(choose).toBeDefined(); expect(choose!.playerId).toBe(b.opponent.id);
    (b.store as any).reducePrompt(b.state, new ResolvePromptAction(choose!.id, [b.replacement]));
    expect(b.opponent.active).toBe(b.replacement);
  });
  it('also keeps the original defender when Mew copies Kick Away', () => {
    const b = battle(true); copyAttack(b);
    expect(b.target.damage).toBe(50);
    expect(b.opponent.active).toBe(b.replacement);
    expect(b.state.prompts.some(p => p instanceof ChoosePokemonPrompt && p.result === undefined)).toBe(false);
  });
  it('also keeps the original defender when copying the opponent’s last attack', () => {
    const b = battle(false), source = new Mightyena();
    b.player.active.cards = [new Defender()]; b.target.cards = [source];
    b.replacement.cards = [new BenchSwitch()];
    b.state.playerLastAttack[b.opponent.id] = { attack: source.attacks[0], sourceCard: source };
    const mimic = new AttackEffect(b.player, b.opponent, { name: 'Mimic', cost: [], damage: 0, text: '' });
    COPY_OPPONENTS_LAST_ATTACK(b.store, b.state, mimic);
    expect(b.target.damage).toBe(50);
    expect(b.opponent.active).toBe(b.replacement);
    expect(b.state.prompts.some(p => p instanceof ChoosePokemonPrompt && p.result === undefined)).toBe(false);
  });
  it('offers the switch when copying the opponent’s last attack without a replacement', () => {
    const b = battle(false), source = new Mightyena();
    b.player.active.cards = [new Defender()]; b.target.cards = [source];
    b.state.playerLastAttack[b.opponent.id] = { attack: source.attacks[0], sourceCard: source };
    const mimic = new AttackEffect(b.player, b.opponent, { name: 'Mimic', cost: [], damage: 0, text: '' });
    COPY_OPPONENTS_LAST_ATTACK(b.store, b.state, mimic);
    expect(b.target.damage).toBe(50);
    const choose = b.state.prompts.find(p => p instanceof ChoosePokemonPrompt && p.result === undefined);
    expect(choose).toBeDefined(); expect(choose!.playerId).toBe(b.opponent.id);
  });
});
