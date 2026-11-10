import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { StoreLike } from '../../game/store/store-like';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Pawniard } from '../set-ascended-heroes/pawniard';
import { Bisharp } from '../set-ascended-heroes/bisharp';
import { Kingambit } from '../set-ascended-heroes/kingambit';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { getCardByName } from './test-helpers';

class Metal extends EnergyCard { public name = 'Metal Test'; public fullName = 'Metal Test TST'; public set = 'TST'; public provides = [CardType.METAL, CardType.METAL]; }
class Defender extends PokemonCard { public name = 'Defender'; public fullName = 'Defender TST'; public set = 'TST'; public hp = 1000; public stage = Stage.BASIC; }
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
function game(card: PokemonCard, defender: PokemonCard = new Defender(), withBench = true) {
  const state = new State(), player = new Player(), opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.phase = GamePhase.PLAYER_TURN; state.turn = 3; state.activePlayer = 0;
  player.active.cards = [card, new Metal()]; opponent.active.cards = [defender];
  const original = opponent.active, replacement = new PokemonCardList(); replacement.cards = [new Defender()];
  opponent.bench = withBench ? [replacement] : [];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, store, card, original, replacement };
}
function useAttack(b: ReturnType<typeof game>) {
  b.store.reduceEffect(b.state, new UseAttackEffect(b.player, b.card.attacks[0]));
  const wait = b.state.prompts.find(p => p instanceof WaitPrompt && p.result === undefined);
  if (!wait) throw new Error('Missing animation prompt');
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(wait.id, null));
}
function copyAttack(b: ReturnType<typeof game>) {
  const mew = new Mewex(); b.player.active.cards = [mew, new Metal()];
  const source = new PokemonCardList(); source.cards = [b.card]; b.player.bench = [source];
  b.store.reduceEffect(b.state, new PowerEffect(b.player, mew.powers[0], mew));
  const choose = b.state.prompts.find(p => p instanceof ChooseAttackPrompt && p.result === undefined) as ChooseAttackPrompt;
  if (!choose) throw new Error('Missing copied attack choice');
  const attack = choose.decode({ index: choose.cards.indexOf(b.card), attack: b.card.attacks[0].name }, b.state);
  expect(choose.validate(attack)).toBe(true);
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(choose.id, attack));
  const wait = b.state.prompts.find(p => p instanceof WaitPrompt && p.result === undefined);
  if (wait) (b.store as any).reducePrompt(b.state, new ResolvePromptAction(wait.id, null));
}

describe('Ascended Heroes Pawniard evolution line', () => {
  it('registers the expected printing and evolution identities', () => {
    expect(['Pawniard ASC', 'Bisharp ASC', 'Kingambit ASC'].map(name => {
      const card = getCardByName(name) as PokemonCard;
      return [card.name, card.set, card.setNumber, card.evolvesFrom || ''];
    })).toEqual([['Pawniard','ASC','146',''], ['Bisharp','ASC','147','Pawniard'], ['Kingambit','ASC','148','Bisharp']]);
  });
  it('Push Down damages the original defender before the opponent chooses the replacement', () => {
    const b = game(new Pawniard()); useAttack(b); expect(b.original.damage).toBe(10);
    const p = b.state.prompts.find(x => x instanceof ChoosePokemonPrompt && x.result === undefined);
    expect(p).toBeDefined(); expect(p!.playerId).toBe(b.opponent.id);
    (b.store as any).reducePrompt(b.state, new ResolvePromptAction(p!.id, [b.replacement]));
    expect(b.opponent.active).toBe(b.replacement); expect(b.opponent.bench).toContain(b.original);
  });
  it('does not switch an already-replaced or attack-effect-protected defender', () => {
    const a = game(new Pawniard(), new DamageSwitch()); useAttack(a);
    expect(a.original.damage).toBe(10); expect(a.opponent.active).toBe(a.replacement);
    expect(a.state.prompts.some(p => p instanceof ChoosePokemonPrompt && p.result === undefined)).toBe(false);
    const b = game(new Pawniard(), new Protected()); useAttack(b);
    expect(b.original.damage).toBe(10); expect(b.opponent.active).toBe(b.original);
    expect(b.state.prompts.some(p => p instanceof ChoosePokemonPrompt && p.result === undefined)).toBe(false);
  });
  it('does not request a switch when the opponent has no Bench', () => {
    const b = game(new Pawniard(), new Defender(), false); useAttack(b);
    expect(b.original.damage).toBe(10); expect(b.opponent.active).toBe(b.original);
    expect(b.state.prompts.some(p => p instanceof ChoosePokemonPrompt && p.result === undefined)).toBe(false);
  });
  it('keeps the original defender when Mew copies Push Down', () => {
    const b = game(new Pawniard(), new DamageSwitch()); copyAttack(b);
    expect(b.original.damage).toBe(10); expect(b.opponent.active).toBe(b.replacement);
    expect(b.state.prompts.some(p => p instanceof ChoosePokemonPrompt && p.result === undefined)).toBe(false);
  });
  for (const count of [0, 1, 3]) {
    it(`Rapid Draw takes at most two cards from a deck containing ${count}`, () => {
      const b = game(new Bisharp()); const deck = Array.from({ length: count }, () => new Metal());
      b.player.deck.cards = [...deck];
      b.store.reduceEffect(b.state, new AttackEffect(b.player, b.opponent, b.card.attacks[0]));
      expect(b.player.hand.cards).toEqual(deck.slice(0, 2)); expect(b.player.deck.cards).toEqual(deck.slice(2));
    });
  }
  for (const taken of [0, 2, 5]) {
    it(`Supreme Overlord adds 30 damage for each of ${taken} opposing Prize cards taken`, () => {
      const card = new Kingambit(), b = game(card); b.opponent.prizesTaken = taken; b.state.phase = GamePhase.ATTACK;
      const attack = new AttackEffect(b.player, b.opponent, card.attacks[0]);
      b.store.reduceEffect(b.state, new DealDamageEffect(attack, 180));
      expect(b.original.damage).toBe(180 + 30 * taken);
    });
  }
  it('applies the Ability before Weakness and ignores it when blocked', () => {
    const card = new Kingambit(), target = new Defender(), b = game(card, target); b.opponent.prizesTaken = 2; b.state.phase = GamePhase.ATTACK;
    target.weakness = [{ type: CardType.METAL }];
    const attack = new AttackEffect(b.player, b.opponent, card.attacks[0]);
    b.store.reduceEffect(b.state, new DealDamageEffect(attack, 180)); expect(b.original.damage).toBe(480);
    b.original.damage = 0; const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PowerEffect) throw new Error('Ability blocked');
      return reduce(state, effect);
    });
    b.store.reduceEffect(b.state, new DealDamageEffect(attack, 180)); expect(b.original.damage).toBe(360);
  });
  it('does not add the Ability bonus to damage to a Bench or itself', () => {
    const card = new Kingambit(), b = game(card); b.opponent.prizesTaken = 3; b.state.phase = GamePhase.ATTACK;
    const attack = new AttackEffect(b.player, b.opponent, card.attacks[0]);
    const bench = new DealDamageEffect(attack, 30); bench.target = b.replacement;
    b.store.reduceEffect(b.state, bench); expect(b.replacement.damage).toBe(30);
    b.store.reduceEffect(b.state, attack); expect(b.player.active.damage).toBe(50);
  });
  it('does not copy Supreme Overlord when Mew copies Double-Edged Slash', () => {
    const b = game(new Kingambit()); b.opponent.prizesTaken = 3; copyAttack(b);
    expect(b.original.damage).toBe(180); expect(b.player.active.damage).toBe(50);
  });
});
