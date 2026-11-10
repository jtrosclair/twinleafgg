import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChangeAvatarAction } from '../../game/store/actions/change-avatar-action';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { VolcanionEX } from '../set-steam-siege/volcanion-ex';
import { VolcanionEXXYP } from '../set-x-and-y-promos/other-prints';
import { Sizzlipede } from '../set-pitch-black/sizzlipede';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { ensureClientCards } from '../../client/cards';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';

class FireEnergy extends EnergyCard {
  public name = 'Fire Energy'; public fullName = 'Fire Energy TEST'; public set = 'TEST';
  public provides = [CardType.FIRE];
}
class OpposingDefender extends PokemonCard {
  public name = 'Defender'; public fullName = 'Defender TEST'; public set = 'TEST';
  public hp = 500;
}
function battle() {
  const state = new State(); const player = new Player(); const opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2;
  state.phase = GamePhase.ATTACK;
  const mew = new Mewex(); player.active.cards = [mew, new FireEnergy(), new FireEnergy(), new FireEnergy()];
  const attacker = new VolcanionEX(); opponent.active.cards = [attacker];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, store, mew, attacker };
}
function copy(b: ReturnType<typeof battle>, source: VolcanionEX) {
  const slot = new PokemonCardList(); slot.cards = [source]; b.player.bench.push(slot);
  b.store.reduceEffect(b.state, new PowerEffect(b.player, b.mew.powers[0], b.mew));
  let prompt = b.state.prompts.filter(p => p.result === undefined).pop()!;
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, source.attacks[0]));
  b.state.phase = GamePhase.FINISHED;
  prompt = b.state.prompts.filter(p => p.result === undefined).pop()!;
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, null));
  b.state.activePlayer = 1; b.state.phase = GamePhase.ATTACK;
}
function hit(b: ReturnType<typeof battle>, target = b.player.active) {
  const attack = new AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage: 100, text: '' });
  const damage = new DealDamageEffect(attack, 100); damage.target = target;
  b.store.reduceEffect(b.state, damage);
  return damage;
}

describe('Volcanion EX Steam Up marker ownership', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  it('retains the resolved effect from a real Steam Up activation', () => {
    const b = battle(); const energy = new FireEnergy(); b.opponent.hand.cards = [energy];
    b.state.phase = GamePhase.PLAYER_TURN; b.state.activePlayer = 1;
    b.store.reduceEffect(b.state, new PowerEffect(b.opponent, b.attacker.powers[0], b.attacker));
    const prompt = b.state.prompts.filter(p => p.result === undefined).pop()!;
    (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, [energy]));
    expect(b.opponent.discard.cards).toContain(energy);
    expect(b.opponent.marker.hasMarker(b.attacker.STEAM_UP_MARKER, b.attacker)).toBe(true);
    b.state.phase = GamePhase.ATTACK;
    expect(hit(b).damage).toBe(130);
  });
  it('applies the attacker\'s own resolved Steam Up once', () => {
    const b = battle(); b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    expect(hit(b).damage).toBe(130);
  });
  it('does not count one activation once per different Volcanion in play', () => {
    const b = battle(); const other = new VolcanionEXXYP();
    const bench = new PokemonCardList(); bench.cards = [other]; b.opponent.bench.push(bench);
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    expect(hit(b).damage).toBe(130);
  });
  it('stacks two distinct activated Volcanions', () => {
    const b = battle(); const other = new VolcanionEXXYP();
    const bench = new PokemonCardList(); bench.cards = [other]; b.opponent.bench.push(bench);
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    b.opponent.marker.addMarker(other.STEAM_UP_MARKER, other);
    expect(hit(b).damage).toBe(160);
  });
  it('does not add the opponent\'s boost twice through a copied Volcanic Heat', () => {
    const b = battle(); const source = new VolcanionEX(); copy(b, source);
    b.player.bench[0].cards = [];
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    expect(hit(b).damage).toBe(130);
  });
  it('applies a real player Steam Up once to a copied Volcanic Heat', () => {
    const b = battle(); const source = new VolcanionEX();
    b.mew.additionalCardTypes = [CardType.FIRE];
    b.player.marker.addMarker(source.STEAM_UP_MARKER, source);
    copy(b, source);
    expect(b.opponent.active.damage).toBe(160);
  });
});

describe('Steam Up expiration and scope exploration', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  it('expires at end of the activating player turn', () => {
    const b = battle();
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    b.state.phase = GamePhase.FINISHED; b.state.activePlayer = 1;
    b.store.reduceEffect(b.state, new EndTurnEffect(b.opponent));
    expect(b.opponent.marker.hasMarker(b.attacker.STEAM_UP_MARKER, b.attacker)).toBe(false);
  });
  it('still applies after the activator leaves play', () => {
    const b = battle();
    const other = new PokemonCardList(); other.cards = [b.attacker]; b.opponent.bench.push(other);
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    class FireAttacker extends OpposingDefender { public cardType = CardType.FIRE; }
    b.opponent.active.cards = [new FireAttacker()];
    other.moveCardTo(b.attacker, b.opponent.discard);
    expect(hit(b).damage).toBe(130);
  });
  it('does not boost damage to an opposing Benched Pokemon', () => {
    const b = battle();
    const target = new PokemonCardList(); target.cards = [new OpposingDefender()]; b.player.bench.push(target);
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    expect(hit(b, target).damage).toBe(100);
  });
  it('still applies if the activator goes to the Lost Zone', () => {
    const b = battle(); const source = b.attacker;
    const remaining = new VolcanionEXXYP();
    const bench = new PokemonCardList(); bench.cards = [remaining]; b.opponent.bench.push(bench);
    b.opponent.marker.addMarker(source.STEAM_UP_MARKER, source);
    class FireAttacker extends OpposingDefender { public cardType = CardType.FIRE; }
    b.opponent.active.moveCardTo(source, b.opponent.lostzone);
    b.opponent.active.cards = [new FireAttacker()];
    expect(hit(b).damage).toBe(130);
  });
  it('survives serialization when the marker source is in the Lost Zone', () => {
    ensureClientCards();
    const source = new VolcanionEX(); source.id = 0;
    const attacker = new VolcanionEXXYP(); attacker.id = 1;
    const target = new Mewex(); target.id = 2;
    const initial = new State(); initial.turn = 3; initial.phase = GamePhase.ATTACK;
    initial.cardNames = [source.fullName, attacker.fullName, target.fullName];
    const owner = new Player(); owner.id = 1; owner.active.cards = [attacker]; owner.lostzone.cards = [source];
    const opponent = new Player(); opponent.id = 2; opponent.active.cards = [target];
    initial.players = [owner, opponent]; owner.marker.addMarker(source.STEAM_UP_MARKER, source);
    const serializer = new StateSerializer(); const state = serializer.deserialize(serializer.serialize(initial));
    const store = new Store({ onStateChange: () => undefined }); store.restoreState(state);
    const restoredOwner = state.players[0], restoredOpponent = state.players[1];
    const attack = new AttackEffect(restoredOwner, restoredOpponent, { name: 'Hit', cost: [], damage: 100, text: '' });
    const damage = new DealDamageEffect(attack, 100); store.reduceEffect(state, damage);
    expect(damage.damage).toBe(130);
  });
  it('keeps the effect through a prevented end turn and expires on the next allowed end turn', () => {
    const b = battle(); b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    b.state.phase = GamePhase.FINISHED; b.state.activePlayer = 1;
    const blocked = new EndTurnEffect(b.opponent); blocked.preventDefault = true;
    b.store.reduceEffect(b.state, blocked);
    expect(b.opponent.marker.hasMarker(b.attacker.STEAM_UP_MARKER, b.attacker)).toBe(true);
    b.store.reduceEffect(b.state, new EndTurnEffect(b.opponent));
    expect(b.opponent.marker.hasMarker(b.attacker.STEAM_UP_MARKER, b.attacker)).toBe(false);
  });
  it('does not change prevented damage', () => {
    const b = battle(); b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    const attack = new AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage: 100, text: '' });
    const blocked = new DealDamageEffect(attack, 100); blocked.preventDefault = true;
    b.store.reduceEffect(b.state, blocked);
    expect(blocked.damage).toBe(100);
    expect(b.player.active.damage).toBe(0);
  });
  it('applies Steam Up in a cloned Trainer hint without altering the live board', () => {
    class DamageCheckingTrainer extends TrainerCard {
      public name = 'Damage Checking Trainer';
      public fullName = 'Damage Checking Trainer TEST';
      public set = 'TEST';
      public canPlay(store: StoreLike, state: State, owner: Player): boolean {
        const defender = state.players.find(player => player !== owner)!;
        const attack = new AttackEffect(owner, defender, { name: 'Hint check', cost: [], damage: 100, text: '' });
        const damage = new DealDamageEffect(attack, 100);
        store.reduceEffect(state, damage);
        return damage.damage === 130;
      }
    }
    const b = battle();
    b.state.phase = GamePhase.PLAYER_TURN; b.state.activePlayer = 1;
    const trainer = new DamageCheckingTrainer(); trainer.id = 12345;
    b.opponent.hand.cards = [trainer];
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);

    b.store.dispatch(new ChangeAvatarAction(b.opponent.id, 'avatar'));

    expect(b.opponent.playableCardIds).toContain(trainer.id);
    expect(b.player.active.damage).toBe(0);
    expect(b.opponent.marker.hasMarker(b.attacker.STEAM_UP_MARKER, b.attacker)).toBe(true);
    expect(b.state.prompts.length).toBe(0);
  });
  it('recognizes an additional Fire type', () => {
    const b = battle();
    class DualTypeAttacker extends OpposingDefender { public cardType = CardType.WATER; public additionalCardTypes = [CardType.FIRE]; }
    b.opponent.active.cards = [new DualTypeAttacker()];
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    expect(hit(b).damage).toBe(130);
  });
  it('recognizes a Fire type granted by another effect', () => {
    const b = battle();
    class TypeChangingAttacker extends OpposingDefender {
      public cardType = CardType.WATER;
      public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
        if (effect instanceof CheckPokemonTypeEffect && effect.target.cards.includes(this)) effect.cardTypes.push(CardType.FIRE);
        return state;
      }
    }
    b.opponent.active.cards = [new TypeChangingAttacker()];
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    expect(hit(b).damage).toBe(130);
  });
  it('does not add damage when Sizzlipede Bug Panic resolves to zero base damage', () => {
    const b = battle(); const source = new Sizzlipede();
    b.opponent.discard.cards.push(b.attacker); b.opponent.active.cards = [source];
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    const attack = new AttackEffect(b.opponent, b.player, source.attacks[1]);
    b.store.reduceEffect(b.state, attack);
    expect(attack.damage).toBe(0);
    // Standard attack dispatch does not emit this effect at zero; exercise it
    // directly as a defensive guard for card-specific emitters.
    const damage = new DealDamageEffect(attack, 0); b.store.reduceEffect(b.state, damage);
    expect(damage.damage).toBe(0);
  });
  it('boosts Sizzlipede Bug Panic once its 0+ attack text adds base damage', () => {
    const b = battle(); const source = new Sizzlipede();
    b.opponent.discard.cards.push(b.attacker); b.opponent.active.cards = [source];
    b.opponent.deck.cards = [new Sizzlipede()];
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    const attack = new AttackEffect(b.opponent, b.player, source.attacks[1]);
    b.store.reduceEffect(b.state, attack);
    expect(attack.damage).toBe(50);
    const damage = new DealDamageEffect(attack, attack.damage); b.store.reduceEffect(b.state, damage);
    expect(damage.damage).toBe(80);
  });
  it('applies the boost before a defender reduces damage, regardless of player order', () => {
    class Wall extends OpposingDefender {
      public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
        if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) effect.damage = Math.max(0, effect.damage - 120);
        return state;
      }
    }
    for (const reverse of [false, true]) {
      const b = battle(); b.player.active.cards = [new Wall()];
      b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
      if (reverse) { b.state.players.reverse(); b.state.activePlayer = 0; }
      expect(hit(b).damage).toBe(10);
      expect(b.player.active.damage).toBe(10);
    }
  });
  it('does not damage a defender that prevents the attack', () => {
    class Wall extends OpposingDefender {
      public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
        if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) effect.preventDefault = true;
        return state;
      }
    }
    const b = battle(); b.player.active.cards = [new Wall()];
    b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
    expect(hit(b).preventDefault).toBe(true);
    expect(b.player.active.damage).toBe(0);
  });
  it('applies Steam Up before Weakness and Resistance', () => {
    for (const [weak, expected] of [[true, 260], [false, 100]] as Array<[boolean, number]>) {
      const b = battle(); const target = new OpposingDefender();
      if (weak) target.weakness = [{ type: CardType.FIRE }];
      else target.resistance = [{ type: CardType.FIRE, value: -30 }];
      b.player.active.cards = [target];
      b.opponent.marker.addMarker(b.attacker.STEAM_UP_MARKER, b.attacker);
      hit(b);
      expect(b.player.active.damage).toBe(expected);
    }
  });
});
