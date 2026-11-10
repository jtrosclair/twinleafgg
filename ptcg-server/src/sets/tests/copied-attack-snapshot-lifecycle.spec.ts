import { deepClone } from '../../utils/utils';
import { Clamperl2DRI } from '../set-destined-rivals/other-prints';
import { ClientSimulator } from '../../client/simulator';
import { Base64 } from '../../utils/base64';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { PowerEffect, AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Onix } from '../set-evolutions/onix';
import { Unown } from '../set-30th-celebration/unown';
import { CastformSnowyForm } from '../set-chilling-reign/castform-snowy-form';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Drednaw } from '../set-stellar-crown/drednaw';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';

class OwnershipEnergy extends EnergyCard {
  public name = 'Ownership Energy'; public fullName = 'Ownership Energy'; public set = 'TEST';
}
class OwnershipDefender extends PokemonCard {
  public name = 'Ownership Defender'; public fullName = 'Ownership Defender'; public set = 'TEST';
  public hp = 400;
}
// Adversarial legacy fixtures: both branches share one handler and the same event.
// They model the absent ownership boundary; they are not replacement card implementations.
class MixedOwnershipSource extends Onix {
  public powers = [{ name: 'Fixture Shell', powerType: PowerType.ABILITY, text: 'Prevent incoming damage of 200 or more.' }];
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    state = super.reduceEffect(store, state, effect);
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this) && effect.damage >= 200) {
      effect.damage = 0;
    }
    return state;
  }
}
class InitialOwnershipSource extends OwnershipDefender {
  public powers = [{ name: 'Fixture Boost', powerType: PowerType.ABILITY, text: 'This Pokémon attacks do 40 more damage.' }];
  public attacks = [{ name: 'Fixture Attack', cost: [], damage: 40, text: 'This attack does 10 more damage.' }];
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += 10; // Attack-owned branch.
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += 40; // Ability-owned branch, intentionally no PowerEffect hook.
    }
    return state;
  }
}
function battle() {
  const state = new State(); const player = new Player(); const opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2;
  state.phase = GamePhase.ATTACK;
  const mew = new Mewex(); player.active.cards = [mew]; opponent.active.cards = [new OwnershipDefender()];
  for (let i = 0; i < 3; i++) {
    const energy = new OwnershipEnergy(); energy.provides = [CardType.PSYCHIC]; player.active.cards.push(energy);
  }
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, store, mew };
}
function resolve(b: ReturnType<typeof battle>, result: any) {
  const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
  if (!prompt) throw new Error('Expected pending prompt');
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, result));
}
function copy(b: ReturnType<typeof battle>, source: PokemonCard, index = 0) {
  const slot = new PokemonCardList(); slot.cards = [source]; b.player.bench.push(slot);
  b.store.reduceEffect(b.state, new PowerEffect(b.player, b.mew.powers[0], b.mew));
  resolve(b, source.attacks[index]);
  // Run the actual animation callback, excluding unrelated legacy next-turn initialization.
  b.state.phase = GamePhase.FINISHED; resolve(b, null);
  b.state.activePlayer = 1; b.state.phase = GamePhase.ATTACK;
}
function hit(b: ReturnType<typeof battle>, damage: number) {
  const attack = new AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage, text: '' });
  b.store.reduceEffect(b.state, new DealDamageEffect(attack, damage));
}


class DuplicateAttackSource extends PokemonCard {
  public name = 'Duplicate Source'; public fullName = 'Duplicate Source TEST'; public set = 'TEST'; public hp = 100;
  public attacks = [
    {name:'Twin', cost:[], damage:0, text:'first', effect: (_store: StoreLike, state: State) => { (state as any).attackFunction = 'first'; }},
    {name:'Twin', cost:[], damage:0, text:'second', effect: (_store: StoreLike, state: State) => { (state as any).attackFunction = 'second'; }}
  ];
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterAttackEffect && effect.attack === this.attacks[1] && effect.attack.effect) {
      effect.attack.effect(store, state, new AttackEffect(effect.player, effect.opponent, effect.attack));
    }
    return state;
  }
}
class ReprintOnix extends Onix { public fullName = 'Onix REPRINT'; public set = 'REPRINT'; }

function restoreBattle(b: ReturnType<typeof battle>) {
  const cards = [...b.player.active.cards, ...b.player.bench.flatMap(slot => slot.cards), ...b.opponent.active.cards, ...b.player.discard.cards, ...b.player.lostzone.cards];
  cards.forEach((card, index) => card.id = index);
  b.state.cardNames = cards.map(card => card.fullName);
  StateSerializer.setKnownCards([new Mewex(), new OwnershipEnergy(), new OwnershipDefender(), new Onix(), new ReprintOnix(), new Clamperl2DRI(), new DuplicateAttackSource()]);
  const serializer = new StateSerializer();
  const serialized = serializer.serialize(b.state);
  const state = serializer.deserialize(serialized);
  const store = new Store({ onStateChange: () => undefined });
  store.restoreState(state);
  return { state, store, player: state.players[0], opponent: state.players[1] };
}

describe('copied attack lifecycle survives stable snapshots', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  it('retains Harden protection when a copied attack is restored', () => {
    const b = battle(); (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, new Onix());
    const restored = restoreBattle(b);
    const attack = new AttackEffect(restored.opponent, restored.player, {name:'Hit',cost:[],damage:40,text:''});
    restored.store.reduceEffect(restored.state, new DealDamageEffect(attack, 40));
    expect(restored.player.active.damage).toBe(0);
  });
  it('continues to allow damage above Harden threshold after restore', () => {
    const b = battle(); (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, new Onix());
    const restored = restoreBattle(b);
    const attack = new AttackEffect(restored.opponent, restored.player, {name:'Hit',cost:[],damage:70,text:''});
    restored.store.reduceEffect(restored.state, new DealDamageEffect(attack, 70));
    expect(restored.player.active.damage).toBe(70);
  });
  it('keeps source identity and attack behavior after a reprint moves to the Lost Zone', () => {
    const b = battle(), source = new ReprintOnix();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING]; copy(b, source);
    b.player.bench[0].moveCardTo(source, b.player.lostzone);
    const restored = restoreBattle(b);
    expect(restored.state.copiedAttackCheckpoints![0].sourceCard.fullName).toBe('Onix REPRINT');
    expect(restored.state.copiedAttackCheckpoints![0].sourceCard).toBe(restored.player.lostzone.cards[0] as PokemonCard);
    const attack = new AttackEffect(restored.opponent, restored.player, {name:'Hit',cost:[],damage:40,text:''});
    restored.store.reduceEffect(restored.state, new DealDamageEffect(attack, 40));
    expect(restored.player.active.damage).toBe(0);
  });
  it('expires the restored effect at the end of the opponent turn', () => {
    const b = battle(); (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING]; copy(b, new Onix());
    const restored = restoreBattle(b);
    restored.state.phase = GamePhase.FINISHED;
    restored.store.reduceEffect(restored.state, new EndTurnEffect(restored.opponent));
    expect(restored.player.active.marker.hasMarker('ONIX_EVO_HARDEN_MARKER', restored.player.active.getPokemonCard())).toBe(false);
    restored.state.phase = GamePhase.ATTACK;
    const attack = new AttackEffect(restored.opponent, restored.player, {name:'Hit',cost:[],damage:40,text:''});
    restored.store.reduceEffect(restored.state, new DealDamageEffect(attack, 40));
    expect(restored.player.active.damage).toBe(40);
  });
  it('preserves compact emitted snapshots, custom win conditions and native pushState', () => {
    const simulator = new ClientSimulator();
    spyOn<any>(simulator, 'settle').and.stub();
    const b = battle(); (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING]; copy(b, new Onix());
    b.state.winConditions = { selfDeckOut: true, cardsInDeck: 2 };
    (b.state as any).customCheckpoint = { someFutureField: 'kept' };
    b.state.phase = GamePhase.PLAYER_TURN; b.state.activePlayer = 0;
    const r = restoreBattle(b);
    const initial = new Base64().encode(new StateSerializer().serialize(r.state));
    simulator.loadSnapshot({stateData: initial});
    const emitted = simulator.getStateData();
    simulator.pushState(emitted);
    expect(simulator.state.winConditions).toEqual({selfDeckOut:true,cardsInDeck:2});
    expect((simulator.state as any).customCheckpoint).toEqual({someFutureField:'kept'});
    simulator.state.phase = GamePhase.ATTACK; simulator.state.activePlayer = 1;
    const player = simulator.state.players[0], opponent = simulator.state.players[1];
    const attack = new AttackEffect(opponent, player, {name:'Hit',cost:[],damage:40,text:''});
    (simulator as any).store.reduceEffect(simulator.state, new DealDamageEffect(attack, 40));
    expect(player.active.damage).toBe(0);
    simulator.cleanup();
  });
  it('omits checkpoint fields from states without a copied attack', () => {
    const b = battle(); const r = restoreBattle(b);
    expect(JSON.parse(new StateSerializer().serialize(r.state))[1].copiedAttackCheckpoints).toBeUndefined();
  });

  it('undo and reset do not leak copied sessions between restored State instances', () => {
    const simulator = new ClientSimulator(); spyOn<any>(simulator, 'settle').and.stub();
    const original = battle(); original.state.phase = GamePhase.PLAYER_TURN; original.state.activePlayer = 0;
    const originalState = restoreBattle(original).state;
    const initial = new Base64().encode(new StateSerializer().serialize(originalState));
    const b = battle(); (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING]; copy(b, new Onix());
    b.state.phase = GamePhase.PLAYER_TURN; b.state.activePlayer = 0;
    const copied = new Base64().encode(new StateSerializer().serialize(restoreBattle(b).state));
    simulator.loadSnapshot({stateData: initial}); simulator.pushState(copied);
    const emitted = simulator.getStateData();
    (simulator as any).history.push(emitted);
    simulator.state.players[0].active.damage = 20;
    expect(simulator.undo()).toBe(true);
    expect(simulator.state.players[0].active.damage).toBe(0);
    expect(simulator.state.copiedAttackCheckpoints!.length).toBe(1);
    simulator.state.phase = GamePhase.ATTACK; simulator.state.activePlayer = 1;
    const player = simulator.state.players[0], opponent = simulator.state.players[1];
    const attack = new AttackEffect(opponent, player, {name:'Hit',cost:[],damage:40,text:''});
    (simulator as any).store.reduceEffect(simulator.state, new DealDamageEffect(attack, 40));
    expect(player.active.damage).toBe(0);
    // The native reset path reloads the original snapshot via pushState.
    simulator.pushState(initial);
    expect(simulator.state.copiedAttackCheckpoints).toBeUndefined();
    expect(simulator.state.players[0].active.marker.hasMarker('ONIX_EVO_HARDEN_MARKER')).toBe(false);
    simulator.cleanup();
  });
  it('round-trips new and unknown fields through production gz1 and gz2 payload transports', () => {
    const simulator = new ClientSimulator(); spyOn<any>(simulator, 'settle').and.stub();
    const b = battle(); (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING]; copy(b, new Onix());
    b.state.phase = GamePhase.PLAYER_TURN; b.state.activePlayer = 0;
    b.state.winConditions = { mustLose: true }; (b.state as any).futureCustomField = { answer: 42 };
    const input = new Base64().encode(new StateSerializer().serialize(restoreBattle(b).state));
    simulator.loadSnapshot({stateData: input});
    const json = new Base64().decode(simulator.getStateData());
    const fs = require('fs'), path = require('path');
    const fixtures = fs.realpathSync(path.resolve(process.cwd(), '../tools/fixtures'));
    const codec = require(path.join(fixtures, '../gzip-puzzle-payload.cjs')); 
    for (const payload of [codec.encodeGzipJson(json), codec.encodeFieldCodeGzipJson(json)]) {
      const decoded = codec.decoder()(payload);
      simulator.pushState(decoded);
      expect(simulator.state.winConditions!.mustLose).toBe(true);
      expect((simulator.state as any).futureCustomField).toEqual({answer:42});
      expect(simulator.state.copiedAttackCheckpoints!.length).toBe(1);
      simulator.state.phase = GamePhase.ATTACK; simulator.state.activePlayer = 1;
      const player = simulator.state.players[0], opponent = simulator.state.players[1];
      const attack = new AttackEffect(opponent, player, {name:'Hit',cost:[],damage:40,text:''});
      (simulator as any).store.reduceEffect(simulator.state, new DealDamageEffect(attack, 40));
      expect(player.active.damage).toBe(0);
    }
    simulator.cleanup();
  });

  it('restores a real Clamperl DRI reprint from Lost Zone with its copied attack', () => {
    const b = battle(), source = new Clamperl2DRI();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.WATER]; copy(b, source);
    b.player.bench[0].moveCardTo(source, b.player.lostzone);
    const restored = restoreBattle(b);
    expect(restored.state.copiedAttackCheckpoints![0].sourceCard).toBe(restored.player.lostzone.cards[0] as PokemonCard);
    expect(restored.state.copiedAttackCheckpoints![0].sourceCard.fullName).toBe('Clamperl2 DRI');
    const attack = new AttackEffect(restored.opponent, restored.player, {name:'Hit',cost:[],damage:40,text:''});
    restored.store.reduceEffect(restored.state, new DealDamageEffect(attack, 40));
    expect(restored.player.active.damage).toBe(30);
  });
  it('persists and eventually removes the turn budget across repeated saves', () => {
    const b = battle(); (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING]; copy(b, new Onix());
    let restored = restoreBattle(b); const serializer = new StateSerializer();
    const initialBudget = restored.state.copiedAttackCheckpoints![0].endTurnsRemaining;
    expect(initialBudget).toBeGreaterThan(0);
    for (let remaining = initialBudget - 1; remaining >= 0; remaining--) {
      restored.state.phase = GamePhase.FINISHED;
      restored.store.reduceEffect(restored.state, new EndTurnEffect(restored.player));
      if (remaining) expect(restored.state.copiedAttackCheckpoints![0].endTurnsRemaining).toBe(remaining);
      else expect(restored.state.copiedAttackCheckpoints).toBeUndefined();
      const state = serializer.deserialize(serializer.serialize(restored.state));
      const store = new Store({onStateChange:()=>undefined}); store.restoreState(state);
      restored = { state, store, player:state.players[0], opponent:state.players[1] };
    }
  });

  it('restores function-valued attack effects for a selected second attack with a duplicate name', () => {
    const b = battle(), source = new DuplicateAttackSource(); copy(b, source, 1);
    expect(b.state.copiedAttackCheckpoints![0].attackIndex).toBe(1);
    (b.state as any).attackFunction = '';
    const restored = restoreBattle(b);
    const attack = restored.state.playerLastAttack[restored.player.id].attack;
    // Restore may eagerly rebuild sessions while checking Bench size.
    expect(typeof attack.effect).toBe('function');
    restored.store.reduceEffect(restored.state, new AfterAttackEffect(restored.player, restored.opponent, attack));
    expect(typeof attack.effect).toBe('function');
    expect((restored.state as any).attackFunction).toBe('second');
    expect(() => new StateSerializer().serialize(restored.state)).not.toThrow();
  });
  it('does not confuse an unrelated same-name later attack for the copied attack after restore', () => {
    const b = battle(), source = new DuplicateAttackSource(); copy(b, source, 1);
    (b.state as any).attackFunction = '';
    b.state.playerLastAttack[b.player.id] = { sourceCard:b.mew, attack:{name:'Twin',cost:[],damage:999,text:'unrelated'} };
    const restored = restoreBattle(b);
    const unrelated = restored.state.playerLastAttack[restored.player.id].attack;
    restored.store.reduceEffect(restored.state, new AfterAttackEffect(restored.player, restored.opponent, unrelated));
    expect((restored.state as any).attackFunction).toBe('');
    expect(unrelated.effect).toBeUndefined();
    const selected = restored.state.copiedAttackCheckpoints![0].selectedAttack!;
    restored.store.reduceEffect(restored.state, new AfterAttackEffect(restored.player, restored.opponent, selected));
    expect((restored.state as any).attackFunction).toBe('second');
  });

  it('omits function properties, preserves array positions and keeps shared cyclic references', () => {
    const b = battle(); const restored = restoreBattle(b);
    const shared: any = { label:'shared', callback: () => 'not serialized' }; shared.self = shared;
    (restored.state as any).futurePayload = { shared, alias:shared, array:[() => 1, shared, () => 2] };
    const serializer = new StateSerializer(), json = serializer.serialize(restored.state);
    const wire = JSON.parse(json)[1].futurePayload;
    expect(wire.shared.callback).toBeUndefined();
    expect(wire.array[0]).toBeNull(); expect(wire.array[2]).toBeNull();
    expect(json.includes('not serialized')).toBe(false);
    const next = serializer.deserialize(json), future = (next as any).futurePayload;
    expect(future.shared).toBe(future.alias); expect(future.shared.self).toBe(future.shared);
    expect(future.array[1]).toBe(future.shared); expect(future.array[0]).toBeNull();
  });

  it('preserves callable functions and graph identity during deep cloning', () => {
    const callback = () => 42; const shared:any = { callback }; shared.self = shared;
    const clone = deepClone({ shared, other:shared, array:[callback,shared,callback] });
    expect(clone.shared).toBe(clone.other); expect(clone.shared.self).toBe(clone.shared);
    expect(clone.shared.callback).toBe(callback); expect(clone.array[0]).toBe(callback);
    expect(clone.array[2]).toBe(callback); expect(clone.shared.callback()).toBe(42);
  });

  it('loads a provisional checkpoint without selected-attack identity without guessing', () => {
    const b = battle(); (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING]; copy(b, new Onix());
    delete b.state.copiedAttackCheckpoints![0].selectedAttack;
    const restored = restoreBattle(b);
    const attack = new AttackEffect(restored.opponent, restored.player, {name:'Hit',cost:[],damage:40,text:''});
    restored.store.reduceEffect(restored.state, new DealDamageEffect(attack, 40));
    expect(restored.player.active.damage).toBe(0);
  });

  it('does not guess a source for legacy snapshots with a copied marker but no checkpoint', () => {
    const b = battle(); (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING]; copy(b, new Onix());
    delete b.state.copiedAttackCheckpoints;
    const restored = restoreBattle(b);
    expect(restored.player.active.marker.hasMarker('ONIX_EVO_HARDEN_MARKER', restored.player.active.getPokemonCard())).toBe(true);
    const attack = new AttackEffect(restored.opponent, restored.player, {name:'Hit',cost:[],damage:40,text:''});
    restored.store.reduceEffect(restored.state, new DealDamageEffect(attack, 40));
    expect(restored.player.active.damage).toBe(40);
    expect(restored.state.copiedAttackCheckpoints).toBeUndefined();
  });

});
