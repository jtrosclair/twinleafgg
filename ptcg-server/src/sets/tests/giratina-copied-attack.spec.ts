import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardList } from '../../game/store/state/card-list';
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
import { GiratinaLVX } from '../set-platinum/giratina-lv-x';
import { checkState } from '../../game/store/effect-reducers/check-effect';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';

class OwnershipEnergy extends EnergyCard {
  public name = 'Ownership Energy'; public fullName = 'Ownership Energy'; public set = 'TEST';
}
class OwnershipBoost extends PokemonCard {
  public name = 'Damage Boost'; public fullName = 'Damage Boost'; public set = 'TEST';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() instanceof Mewex) effect.damage += 10;
    return state;
  }
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

describe('Giratina LV.X Darkness Lost routing', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());

  it('executes the direct attack on opposing benched Pokemon', () => {
    const b = battle(); const giratina = new GiratinaLVX();
    b.player.active.cards = [giratina];
    const bench = new PokemonCardList(); bench.cards = [new OwnershipDefender()]; b.opponent.bench.push(bench);
    b.store.reduceEffect(b.state, new AttackEffect(b.player, b.opponent, giratina.attacks[0]));
    expect(bench.damage).toBe(30);
  });

  it('executes the copied attack as Mew on opposing benched Pokemon', () => {
    const b = battle(); const giratina = new GiratinaLVX();
    const extraEnergy = new OwnershipEnergy(); extraEnergy.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extraEnergy);
    const bench = new PokemonCardList(); bench.cards = [new OwnershipDefender()]; b.opponent.bench.push(bench);
    copy(b, giratina);
    expect(bench.damage).toBe(30);
  });

  it('still blocks an opposing attack when Invisible Tentacles cannot discard', () => {
    const b = battle(); b.opponent.active.cards = [new GiratinaLVX()];
    const attack = new AttackEffect(b.player, b.opponent, b.mew.attacks[0]);
    expect(() => b.store.reduceEffect(b.state, attack)).toThrow();
  });

  it('still prompts an opposing attacker with cards to discard', () => {
    const b = battle(); b.opponent.active.cards = [new GiratinaLVX()];
    b.player.hand.cards = [new OwnershipEnergy()];
    const attack = new AttackEffect(b.player, b.opponent, b.mew.attacks[0]);
    b.store.reduceEffect(b.state, attack);
    expect(b.state.prompts.filter(p => p.result === undefined).length).toBe(1);
  });

  it('does not block when Invisible Tentacles is suppressed', () => {
    const b = battle(); b.opponent.active.cards = [new GiratinaLVX()];
    const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PowerEffect) throw new Error('blocked');
      return reduce(state, effect);
    });
    const attack = new AttackEffect(b.player, b.opponent, b.mew.attacks[0]);
    expect(() => b.store.reduceEffect(b.state, attack)).not.toThrow();
  });
  it('damages the active by 30 when Darkness Lost is copied', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    copy(b, new GiratinaLVX()); expect(b.opponent.active.damage).toBe(30);
  });

  it('applies weakness to the active damage of copied Darkness Lost', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    b.opponent.active.getPokemonCard()!.weakness = [{ type: CardType.PSYCHIC }];
    copy(b, new GiratinaLVX()); expect(b.opponent.active.damage).toBe(60);
  });

  it('applies resistance to the active damage of copied Darkness Lost', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    b.opponent.active.getPokemonCard()!.resistance = [{ type: CardType.PSYCHIC, value: -20 }];
    copy(b, new GiratinaLVX()); expect(b.opponent.active.damage).toBe(10);
  });

  it('respects protection on the active against copied Darkness Lost', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    b.opponent.active.preventDamageNextTurn = true;
    copy(b, new GiratinaLVX()); expect(b.opponent.active.damage).toBe(0);
  });
  it('routes a copied Darkness Lost damage knockout on the active to the Lost Zone', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    b.opponent.active.getPokemonCard()!.hp = 20;
    copy(b, new GiratinaLVX());
    expect(b.opponent.active.damage).toBe(30);
    expect(b.opponent.active.attackDamageKnockOut?.destination).toBe('lostzone');
  });

  it('does not record a Lost Zone knockout when active damage is prevented', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    b.opponent.active.getPokemonCard()!.hp = 20; b.opponent.active.preventDamageNextTurn = true;
    copy(b, new GiratinaLVX());
    expect(b.opponent.active.damage).toBe(0);
    expect(b.opponent.active.attackDamageKnockOut).toBeUndefined();
  });
  it('preserves other effects that increase the copied active damage', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    const boost = new PokemonCardList(); boost.cards = [new OwnershipBoost()]; b.player.bench.push(boost);
    copy(b, new GiratinaLVX()); expect(b.opponent.active.damage).toBe(40);
  });

  it('does not apply weakness to bench damage from copied Darkness Lost', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    const defender = new OwnershipDefender(); defender.weakness = [{ type: CardType.PSYCHIC }];
    const bench = new PokemonCardList(); bench.cards = [defender]; b.opponent.bench.push(bench);
    copy(b, new GiratinaLVX()); expect(bench.damage).toBe(30);
  });

  it('marks a bench attack knockout for the Lost Zone', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    const defender = new OwnershipDefender(); defender.hp = 20;
    const bench = new PokemonCardList(); bench.cards = [defender]; b.opponent.bench.push(bench);
    copy(b, new GiratinaLVX());
    expect(bench.damage).toBe(30);
    expect(bench.attackDamageKnockOut?.destination).toBe('lostzone');
  });
  it('does not send a later unrelated knockout to the Lost Zone after bench protection', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    const defender = new OwnershipDefender(); const bench = new PokemonCardList(); bench.cards = [defender];
    bench.preventDamageNextTurn = true; b.opponent.bench.push(bench);
    copy(b, new GiratinaLVX());
    expect(bench.damage).toBe(0);
    b.state.activePlayer = 0; b.state.phase = GamePhase.ATTACK;
    b.store.reduceEffect(b.state, new KnockOutEffect(b.opponent, bench));
    expect(b.opponent.discard.cards).toContain(defender);
    expect(b.opponent.lostzone.cards).not.toContain(defender);
  });
  it('moves a bench damage knockout and attached Energy to the Lost Zone during state checking', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    const defender = new OwnershipDefender(); defender.hp = 20;
    const attached = new OwnershipEnergy(); const bench = new PokemonCardList(); bench.cards = [defender, attached]; b.opponent.bench.push(bench);
    copy(b, new GiratinaLVX()); b.state.activePlayer = 0; b.state.phase = GamePhase.ATTACK;
    const makePrize = () => { const prize = new CardList(); prize.cards = [new OwnershipEnergy()]; return prize; };
    b.player.prizes = [makePrize(), makePrize()]; b.opponent.prizes = [makePrize()];
    checkState(b.store, b.state);
    expect(b.opponent.lostzone.cards).toContain(defender);
    expect(b.opponent.lostzone.cards).toContain(attached);
    expect(b.opponent.discard.cards).not.toContain(attached);
  });
  it('preserves a serialized legacy marker for a copied attack', () => {
    const b = battle(); const extra = new OwnershipEnergy(); extra.provides = [CardType.PSYCHIC]; b.player.active.cards.push(extra);
    const defender = new OwnershipDefender(); const bench = new PokemonCardList(); bench.cards = [defender]; b.opponent.bench.push(bench);
    const giratina = new GiratinaLVX(); copy(b, giratina);
    bench.marker.addMarker(giratina.DARKNESS_LOST_MARKER, b.mew);
    b.state.activePlayer = 0; b.state.phase = GamePhase.ATTACK;
    const cards = Array.from(new Set(b.state.players.flatMap(p => [p.active, ...p.bench, p.deck, p.hand, p.discard, p.lostzone, p.stadium, p.supporter, ...p.prizes]).flatMap(list => list.cards)));
    cards.forEach((card, index) => card.id = index); b.state.cardNames = cards.map(card => card.fullName);
    StateSerializer.setKnownCards(cards);
    const serializer = new StateSerializer(); const restored = serializer.deserialize(serializer.serialize(b.state));
    const store = new Store({ onStateChange: () => undefined }); store.restoreState(restored);
    const mew = restored.players[0].active.getPokemonCard()!; const target = restored.players[1].bench[0]; const targetCard = target.getPokemonCard()!;
    expect(target.marker.hasMarker(giratina.DARKNESS_LOST_MARKER, mew)).toBe(true);
    store.reduceEffect(restored, new KnockOutEffect(restored.players[1], target));
    expect(restored.players[1].lostzone.cards).toContain(targetCard);
  });
  it('preserves a serialized legacy marker for the original Giratina', () => {
    const b = battle(); const giratina = new GiratinaLVX(); b.player.active.cards = [giratina];
    const defender = new OwnershipDefender(); const bench = new PokemonCardList(); bench.cards = [defender]; b.opponent.bench.push(bench);
    bench.marker.addMarker(giratina.DARKNESS_LOST_MARKER, giratina);
    b.state.activePlayer = 0; b.state.phase = GamePhase.ATTACK;
    const cards = Array.from(new Set(b.state.players.flatMap(p => [p.active, ...p.bench, p.deck, p.hand, p.discard, p.lostzone, p.stadium, p.supporter, ...p.prizes]).flatMap(list => list.cards)));
    cards.forEach((card, index) => card.id = index); b.state.cardNames = cards.map(card => card.fullName);
    StateSerializer.setKnownCards(cards);
    const serializer = new StateSerializer(); const restored = serializer.deserialize(serializer.serialize(b.state));
    const store = new Store({ onStateChange: () => undefined }); store.restoreState(restored);
    const source = restored.players[0].active.getPokemonCard()!; const target = restored.players[1].bench[0]; const targetCard = target.getPokemonCard()!;
    expect(target.marker.hasMarker(giratina.DARKNESS_LOST_MARKER, source)).toBe(true);
    store.reduceEffect(restored, new KnockOutEffect(restored.players[1], target));
    expect(restored.players[1].lostzone.cards).toContain(targetCard);
  });
});
