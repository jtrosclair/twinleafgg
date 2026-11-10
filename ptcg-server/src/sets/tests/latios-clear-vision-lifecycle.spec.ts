import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { PowerEffect, AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { LatiosGx } from '../set-unified-minds/latios-gx';
import { Garbodor } from '../set-dragons-exalted/garbodor';
import { BraveryCharm } from '../set-paldea-evolved/bravery-charm';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';

class TestEnergy extends EnergyCard { public name = 'Energy'; public fullName = 'Energy TEST'; public set = 'TEST'; public provides = [CardType.PSYCHIC]; }
class TestMon extends PokemonCard { public name = 'Dummy'; public fullName = 'Dummy TEST'; public set = 'TEST'; public hp = 300; }
class ImmuneMon extends TestMon {
  public reduceEffect(_store: any, state: State, effect: Effect): State {
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) effect.preventDefault = true;
    return state;
  }
}
class SideEffectMon extends TestMon {
  public activated = false;
  public reduceEffect(_store: any, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.source.cards.includes(this)) this.activated = true;
    return state;
  }
}
function battle() {
  const state = new State(), player = new Player(), opponent = new Player(), mew = new Mewex(), latios = new LatiosGx();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.activePlayer = 0; state.turn = 3; state.phase = GamePhase.ATTACK;
  player.active.cards = [mew, new TestEnergy()]; opponent.active.cards = [new TestMon()];
  const slot = new PokemonCardList(); slot.cards = [latios]; player.bench = [slot];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, store, mew, latios };
}
function resolve(b: ReturnType<typeof battle>, value: any) {
  const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
  if (!prompt) throw new Error('Expected prompt');
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, value));
}
function useCopiedClearVision(b: ReturnType<typeof battle>) {
  b.store.reduceEffect(b.state, new PowerEffect(b.player, b.mew.powers[0], b.mew));
  resolve(b, b.latios.attacks[1]);
  b.state.phase = GamePhase.FINISHED; resolve(b, null);
  b.state.phase = GamePhase.ATTACK; b.state.activePlayer = 1;
}
function opposingAttack(b: ReturnType<typeof battle>, attack: { name: string; cost: CardType[]; damage: number; text: string; gxAttack?: boolean }) {
  return () => b.store.reduceEffect(b.state, new AttackEffect(b.opponent, b.player, attack));
}

describe('Clear Vision GX game-long restriction', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  it('Mew can copy Clear Vision even though Latios’s Ability is not copied', () => {
    const b = battle(); useCopiedClearVision(b);
    expect(b.player.usedGX).toBe(true);
    expect(b.opponent.marker.hasMarker(b.latios.CLEAR_VISION_MARKER)).toBe(true);
  });
  it('continues to block opposing GX attacks after both source and copycat leave play', () => {
    const b = battle(); useCopiedClearVision(b);
    b.player.bench[0].moveCardTo(b.latios, b.player.lostzone);
    b.player.active.moveCardTo(b.mew, b.player.discard);
    b.player.active.cards.unshift(new TestMon());
    expect(opposingAttack(b, { name: 'Power-GX', cost: [], damage: 20, text: '', gxAttack: true })).toThrow();
    expect(opposingAttack(b, { name: 'Normal Hit', cost: [], damage: 20, text: '' })).not.toThrow();
  });
  it('keeps the restriction after a snapshot restore', () => {
    const b = battle(); useCopiedClearVision(b);
    b.player.bench[0].moveCardTo(b.latios, b.player.lostzone);
    b.player.active.moveCardTo(b.mew, b.player.discard); b.player.active.cards.unshift(new TestMon());
    const cards = [...b.player.active.cards, ...b.player.bench.flatMap(s => s.cards), ...b.opponent.active.cards, ...b.player.discard.cards, ...b.player.lostzone.cards];
    cards.forEach((card, index) => card.id = index); b.state.cardNames = cards.map(card => card.fullName);
    StateSerializer.setKnownCards([new Mewex(), new LatiosGx(), new TestMon(), new TestEnergy()]);
    const state = new StateSerializer().deserialize(new StateSerializer().serialize(b.state));
    const store = new Store({ onStateChange: () => undefined }); store.restoreState(state);
    const effect = new AttackEffect(state.players[1], state.players[0], { name: 'Power-GX', cost: [], damage: 20, text: '', gxAttack: true });
    expect(() => store.reduceEffect(state, effect)).toThrow();
  });
  it('keeps the player restriction when the copied attacker is Knocked Out', () => {
    const b = battle(); useCopiedClearVision(b);
    b.player.bench[0].moveCardTo(b.latios, b.player.lostzone);
    b.store.reduceEffect(b.state, new KnockOutEffect(b.player, b.player.active));
    expect(b.player.discard.cards).toContain(b.mew);
    b.player.active.cards = [new TestMon()];
    expect(opposingAttack(b, { name: 'Power-GX', cost: [], damage: 20, text: '' })).toThrow();
  });
  it('permits Latios to use its attack when its Power Bind Ability is blocked', () => {
    const b = battle(); b.player.active.cards = [b.latios]; b.player.bench = [];
    const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PowerEffect && effect.card === b.latios && effect.power.name === 'test') throw new Error('blocked');
      return reduce(state, effect);
    });
    b.store.reduceEffect(b.state, new AttackEffect(b.player, b.opponent, b.latios.attacks[1]));
    expect(b.player.usedGX).toBe(true);
    expect(b.opponent.marker.hasMarker(b.latios.CLEAR_VISION_MARKER)).toBe(true);
  });
  it('permits the attack under a real opposing Garbotoxin', () => {
    const b = battle(); b.player.active.cards = [b.latios]; b.player.bench = [];
    const garbodor = new Garbodor(), tool = new BraveryCharm(), bench = new PokemonCardList();
    bench.cards = [garbodor, tool]; bench.tools = [tool]; b.opponent.bench = [bench];
    b.store.reduceEffect(b.state, new AttackEffect(b.player, b.opponent, b.latios.attacks[1]));
    expect(b.player.usedGX).toBe(true);
    expect(b.opponent.marker.hasMarker(b.latios.CLEAR_VISION_MARKER)).toBe(true);
  });
  it('allows both players to use GX attacks when neither is affected', () => {
    const b = battle();
    const attack = { name: 'Power-GX', cost: [], damage: 20, text: '', gxAttack: true };
    expect(() => b.store.reduceEffect(b.state, new AttackEffect(b.player, b.opponent, attack))).not.toThrow();
    expect(() => b.store.reduceEffect(b.state, new AttackEffect(b.opponent, b.player, attack))).not.toThrow();
  });
  it('recognizes the existing legacy marker for either player, including attacks without a gxAttack flag', () => {
    for (const who of [0, 1]) {
      const b = battle(), locked = b.state.players[who], other = b.state.players[1 - who];
      locked.marker.addMarker('LATIOS_GX_UNM_CLEAR_VISION_MARKER', b.latios);
      expect(() => b.store.reduceEffect(b.state, new AttackEffect(locked, other, { name: 'Power-GX', cost: [], damage: 20, text: '' }))).toThrow();
      expect(() => b.store.reduceEffect(b.state, new AttackEffect(locked, other, { name: 'Power', cost: [], damage: 20, text: '', gxAttack: true }))).toThrow();
      expect(() => b.store.reduceEffect(b.state, new AttackEffect(other, locked, { name: 'Power-GX', cost: [], damage: 20, text: '' }))).not.toThrow();
    }
  });
  it('still enforces Power Bind when the Ability is active', () => {
    const b = battle(); b.player.active.cards = [b.latios]; b.player.bench = [];
    expect(() => b.store.reduceEffect(b.state, new AttackEffect(b.player, b.opponent, b.latios.attacks[1]))).toThrow();
    expect(b.player.usedGX).toBe(false);
    expect(b.opponent.marker.hasMarker(b.latios.CLEAR_VISION_MARKER)).toBe(false);
  });
  it('rejects the forbidden GX attack before any attack handler runs', () => {
    const b = battle(), attacker = new SideEffectMon(); b.opponent.active.cards = [attacker];
    b.opponent.marker.addMarker(b.latios.CLEAR_VISION_MARKER, b.latios);
    expect(opposingAttack(b, { name: 'Forbidden-GX', cost: [], damage: 20, text: '' })).toThrow();
    expect(attacker.activated).toBe(false);
  });
  it('does not throw for an attack that was already prevented', () => {
    const b = battle(); b.opponent.marker.addMarker(b.latios.CLEAR_VISION_MARKER, b.latios);
    const effect = new AttackEffect(b.opponent, b.player, { name: 'Power-GX', cost: [], damage: 20, text: '' });
    effect.preventDefault = true;
    expect(() => b.store.reduceEffect(b.state, effect)).not.toThrow();
    expect(b.player.active.damage).toBe(0);
    expect(b.opponent.usedGX).toBe(false);
    expect(b.opponent.marker.hasMarker(b.latios.CLEAR_VISION_MARKER)).toBe(true);
  });
  it('affects the opposing player even if their Active Pokémon prevents attack effects on itself', () => {
    const b = battle(); b.opponent.active.cards = [new ImmuneMon()];
    useCopiedClearVision(b);
    expect(b.opponent.marker.hasMarker(b.latios.CLEAR_VISION_MARKER)).toBe(true);
    expect(opposingAttack(b, { name: 'Power-GX', cost: [], damage: 20, text: '' })).toThrow();
  });
});
