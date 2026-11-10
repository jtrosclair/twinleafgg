import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StateSerializer } from '../../game/serializer/state-serializer';
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
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Onix } from '../set-evolutions/onix';
import { Unown } from '../set-30th-celebration/unown';
import { CastformSnowyForm } from '../set-chilling-reign/castform-snowy-form';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Drednaw } from '../set-stellar-crown/drednaw';
import { Ursaring } from '../set-ex-unseen-forces/ursaring';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { clearCopyAttackSessionsForTests, cloneAttacks, openCopyAttackSession } from '../../game/store/prefabs/copy-attack-delegation';

class OwnershipEnergy extends EnergyCard {
  public name = 'Ownership Energy'; public fullName = 'Ownership Energy'; public set = 'TEST';
}
class OwnershipDefender extends PokemonCard {
  public name = 'Ownership Defender'; public fullName = 'Ownership Defender'; public set = 'TEST';
  public hp = 400;
}
// Adversarial fixtures retain mixed attack and Ability branches, including
// identical event predicates. The new explicit method marks attack ownership.
class MixedOwnershipSource extends Onix {
  public powers = [{ name: 'Fixture Shell', powerType: PowerType.ABILITY, text: 'Prevent incoming damage of 200 or more.' }];
  // This subclass explicitly owns the inherited attack behavior; its Ability
  // remains in reduceEffect and is deliberately not copied.
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, attackIndex: number): State {
    return Onix.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, attackIndex);
  }
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
  public reduceCopiedAttackEffect(_store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += 10; // Attack-owned branch.
    }
    return state;
  }
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    state = InitialOwnershipSource.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += 40; // Ability-owned branch, intentionally no PowerEffect hook.
    }
    return state;
  }
}
class MetadataReprint extends MixedOwnershipSource {}
class AttackDefinitionReprint extends Onix {
  public fullName = 'Onix Modified TEST'; public set = 'TEST';
  public attacks = [
    { name: 'Modified Harden', cost: [CardType.FIGHTING] as CardType.FIGHTING[], damage: 15, text: '',
      effect: (_store: StoreLike, state: State) => { (state as any).verifiedAttackFunction = 'trusted'; } },
    { name: 'Modified Rock Throw', cost: [CardType.FIGHTING, CardType.FIGHTING] as CardType.FIGHTING[], damage: 40, text: '' }
  ];
}
class MigratedOverrideSource extends Onix {
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    state = super.reduceEffect(store, state, effect);
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) effect.damage += 20;
    return state;
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, index: number): State {
    state = Onix.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, index);
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) effect.damage += 20;
    return state;
  }
}
class AttackOverriddenSource extends Onix {
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    state = super.reduceEffect(store, state, effect);
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) effect.damage += 20;
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

describe('explicit copied attack ownership', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());

  it('copies Hard Crunch without inheriting unguarded Impervious Shell on incoming 200 damage', () => {
    const b = battle(); const source = new Drednaw(); copy(b, source);
    expect(b.opponent.active.damage).toBe(80);
    hit(b, 200);
    expect(b.player.active.damage).toBe(200);
  });

  it('preserves the original Ability and attack when the source itself attacks', () => {
    const b = battle(), source = new InitialOwnershipSource();
    b.player.active.cards = [source];
    const attack = new AttackEffect(b.player, b.opponent, source.attacks[0]);
    source.reduceEffect(b.store, b.state, attack);
    expect(attack.damage).toBe(90);
  });

  it('inherits an explicitly owned attack through metadata-only reprints', () => {
    const b = battle();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, new MetadataReprint()); hit(b, 200);
    expect(b.player.active.damage).toBe(200);
  });

  it('uses the inherited callback when a reprint changes printed attack definitions', () => {
    const b = battle();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, new AttackDefinitionReprint());
    expect(b.opponent.active.damage).toBe(15);
    hit(b, 40); expect(b.player.active.damage).toBe(0);
  });

  it('restores inherited attack metadata and trusts only the registered checkpoint callback', () => {
    const b = battle(), source = new AttackDefinitionReprint();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, source);
    const cards = [...b.player.active.cards, ...b.player.bench.flatMap(slot => slot.cards), ...b.opponent.active.cards];
    cards.forEach((card, index) => card.id = index);
    b.state.cardNames = cards.map(card => card.fullName);
    StateSerializer.setKnownCards([new Mewex(), new OwnershipEnergy(), new OwnershipDefender(), new AttackDefinitionReprint()]);
    const serializer = new StateSerializer(), restored = serializer.deserialize(serializer.serialize(b.state));
    const savedAttack = restored.copiedAttackCheckpoints![0].selectedAttack!;
    savedAttack.effect = (_store: StoreLike, state: State) => { (state as any).verifiedAttackFunction = 'untrusted'; };
    clearCopyAttackSessionsForTests();
    const store = new Store({ onStateChange: () => undefined }); store.restoreState(restored);
    store.reduceEffect(restored, new EndTurnEffect(restored.players[1]));
    const trusted = restored.copiedAttackCheckpoints![0].sourceCard.attacks[0].effect!;
    expect(savedAttack.effect).toBe(trusted);
    savedAttack.effect!(store, restored, new AttackEffect(restored.players[0], restored.players[1], savedAttack));
    expect((restored as any).verifiedAttackFunction).toBe('trusted');
  });

  it('uses an explicitly overridden callback for changed subclass attack logic', () => {
    const b = battle();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, new MigratedOverrideSource());
    expect(b.opponent.active.damage).toBe(20);
    hit(b, 40); expect(b.player.active.damage).toBe(0);
  });

  it('uses legacy handling when a subclass changes an attack without opting in', () => {
    const b = battle();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, new AttackOverriddenSource());
    expect(b.opponent.active.damage).toBe(20);
    hit(b, 40); expect(b.player.active.damage).toBe(0);
  });

  it('copies Ursaring Rock Smash, including its heads bonus, without its Poké-Body', () => {
    const b = battle(); const source = new Ursaring();
    const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof CoinFlipEffect) { effect.callback!(true); return state; }
      return reduce(state, effect);
    });
    copy(b, source, 1);
    expect(b.opponent.active.damage).toBe(60);
  });

  it('copies Ursaring Drag Off and keeps its asynchronous switch choice', () => {
    const b = battle(), source = new Ursaring(), bench = new PokemonCardList();
    const target = new OwnershipDefender(); bench.cards = [target]; b.opponent.bench.push(bench);
    const sourceBench = new PokemonCardList(); sourceBench.cards = [source]; b.player.bench.push(sourceBench);
    const attacks = cloneAttacks(source.attacks);
    openCopyAttackSession(b.state, b.player, b.mew, source, attacks, attacks[0]);
    const attack = new AttackEffect(b.player, b.opponent, attacks[0]);
    b.store.reduceEffect(b.state, attack);
    resolve(b, true);
    resolve(b, [bench]);
    expect(b.opponent.active.getPokemonCard()).toBe(target);
    b.store.reduceEffect(b.state, new DealDamageEffect(attack, attack.damage));
    expect(b.opponent.active.damage).toBe(20);
  });

  it('copies Ursaring Rock Smash tails without adding damage', () => {
    const b = battle(); const source = new Ursaring();
    const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof CoinFlipEffect) { effect.callback!(false); return state; }
      return reduce(state, effect);
    });
    copy(b, source, 1);
    expect(b.opponent.active.damage).toBe(40);
  });

  it('retains Ursaring’s own heads bonus and its Poké-Body against opposing Basics', () => {
    const b = battle(); const source = new Ursaring();
    const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof CoinFlipEffect) { effect.callback!(true); return state; }
      return reduce(state, effect);
    });
    b.player.active.cards = [source];
    const attack = new AttackEffect(b.player, b.opponent, source.attacks[1]);
    b.store.reduceEffect(b.state, attack);
    expect(attack.damage).toBe(60);
    b.player.active.cards = [b.mew]; b.opponent.active.cards = [source];
    const basicAttack = new AttackEffect(b.player, b.opponent, b.mew.attacks[0]);
    expect(() => b.store.reduceEffect(b.state, basicAttack)).toThrow();
  });

  it('keeps an unguarded passive out of an explicitly owned copied Harden', () => {
    const b = battle(); const source = new MixedOwnershipSource();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, source);
    expect(b.player.active.marker.hasMarker(source.HARDEN_MARKER, b.mew)).toBe(true);
    hit(b, 200); expect(b.player.active.damage).toBe(200);
  });

  it('does not inherit an Ability from an explicitly owned initial attack', () => {
    const b = battle(); copy(b, new InitialOwnershipSource());
    expect(b.opponent.active.damage).toBe(50);
  });
});
