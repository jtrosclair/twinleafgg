import { PokemonCard } from '../../game/store/card/pokemon-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, PutDamageEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { AntiqueShieldFossil } from '../set-pitch-black/antique-shield-fossil';
import { Garbodor } from '../set-dragons-exalted/garbodor';
import { BraveryCharm } from '../set-paldea-evolved/bravery-charm';
import { RareFossil } from '../set-darkness-ablaze/rare-fossil';

class Dummy extends PokemonCard {
  public name = 'Dummy'; public fullName = 'Dummy TEST'; public set = 'TEST'; public hp = 500;
  public attacks = [{ name: 'Hit', cost: [], damage: 40, text: '' }];
}
class OtherItem extends TrainerCard { public name = 'Ordinary Item'; public fullName = 'Ordinary Item TEST'; public set = 'TEST'; public trainerType = TrainerType.ITEM; }
function setup() {
  const state = new State(), defender = new Player(), attacker = new Player();
  const fossil = new AntiqueShieldFossil(), opponent = new Dummy(), benched = new Dummy();
  defender.id = 1; attacker.id = 2; state.players = [defender, attacker]; state.activePlayer = 1; state.phase = GamePhase.ATTACK; state.turn = 3;
  defender.active.cards = [fossil]; attacker.active.cards = [opponent];
  const bench = new PokemonCardList(); bench.cards = [benched]; defender.bench = [bench];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  const attack = new AttackEffect(attacker, defender, opponent.attacks[0]);
  return { state, defender, attacker, fossil, opponent, benched, bench, store, attack };
}
describe('Antique Shield Fossil M5', () => {
  it('recognizes the fossil as a Pokemon while leaving ordinary Items unrecognized', () => {
    const b = setup(); expect(b.defender.active.getPokemonCard()).toBe(b.fossil as any);
    const item = new OtherItem(); b.defender.active.cards.push(item); b.defender.active.tools.push(item);
    expect(b.defender.active.getPokemonCard()).toBe(b.fossil as any);
    const ordinary = new PokemonCardList(); ordinary.cards = [item]; expect(ordinary.getPokemonCard()).toBeUndefined();
    const misplaced = new PokemonCardList(); misplaced.cards = [b.fossil]; misplaced.tools = [b.fossil]; expect(misplaced.getPokemonCard()).toBeUndefined();
  });
  it('reduces attack damage to the Active once, after weakness and resistance', () => {
    const b = setup(); b.store.reduceEffect(b.state, new DealDamageEffect(b.attack, 40));
    expect(b.defender.active.damage).toBe(30);
  });
  for (const mode of ['deal', 'put'] as const) {
    it(`reduces ${mode} damage after an imposed Weakness`, () => {
      const b = setup(); b.opponent.cardType = CardType.PSYCHIC;
      (b.fossil as any).weakness = [{ type: CardType.PSYCHIC }];
      const damage = mode === 'deal' ? new DealDamageEffect(b.attack, 40) : new PutDamageEffect(b.attack, 40);
      b.store.reduceEffect(b.state, damage); expect(b.defender.active.damage).toBe(70);
    });
    it(`reduces ${mode} damage after an imposed Resistance`, () => {
      const b = setup(); b.opponent.cardType = CardType.PSYCHIC;
      (b.fossil as any).resistance = [{ type: CardType.PSYCHIC, value: -30 }];
      const damage = mode === 'deal' ? new DealDamageEffect(b.attack, 50) : new PutDamageEffect(b.attack, 50);
      b.store.reduceEffect(b.state, damage); expect(b.defender.active.damage).toBe(10);
    });
  }
  it('reduces damage to a Benched Pokemon once', () => {
    const b = setup(); const damage = new PutDamageEffect(b.attack, 40); damage.target = b.bench;
    b.store.reduceEffect(b.state, damage); expect(b.bench.damage).toBe(30);
  });
  it('does not reduce damage counters placed by an attack', () => {
    const b = setup(); const counters = new PutCountersEffect(b.attack, 40); counters.target = b.bench;
    b.store.reduceEffect(b.state, counters); expect(b.bench.damage).toBe(40);
  });
  it('does not reduce damage from a player to their own Pokemon', () => {
    const b = setup(); const ownAttack = new AttackEffect(b.defender, b.attacker, b.opponent.attacks[0]);
    const damage = new PutDamageEffect(ownAttack, 40); damage.target = b.bench;
    b.store.reduceEffect(b.state, damage); expect(b.bench.damage).toBe(40);
  });
  it('does not protect when Benched', () => {
    const b = setup(); b.defender.switchPokemon(b.bench);
    b.store.reduceEffect(b.state, new DealDamageEffect(b.attack, 40)); expect(b.defender.active.damage).toBe(40);
  });
  it('does not protect when Ability use is blocked', () => {
    const b = setup(); const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => { if (effect instanceof PowerEffect) throw new Error('blocked'); return reduce(state, effect); });
    b.store.reduceEffect(b.state, new DealDamageEffect(b.attack, 40)); expect(b.defender.active.damage).toBe(40);
  });
  it('respects Garbotoxin from the opposing Bench', () => {
    const b = setup(); const garbodor = new Garbodor(), tool = new BraveryCharm(), bench = new PokemonCardList();
    bench.cards = [garbodor, tool]; bench.tools = [tool]; b.attacker.bench = [bench];
    b.store.reduceEffect(b.state, new DealDamageEffect(b.attack, 40)); expect(b.defender.active.damage).toBe(40);
  });
  it('can be played from hand onto an empty Bench', () => {
    const b = setup(); b.defender.active.cards = [new Dummy()]; b.defender.hand.cards = [b.fossil];
    b.defender.bench = [new PokemonCardList()]; b.state.activePlayer = 0; b.state.phase = GamePhase.PLAYER_TURN;
    b.store.reduceEffect(b.state, new PlayItemEffect(b.defender, b.fossil));
    expect(b.defender.hand.cards).not.toContain(b.fossil);
    expect(b.defender.bench[0].getPokemonCard()).toBe(b.fossil as any);
  });
  it('switches into the Active and out normally', () => {
    const b = setup(); b.defender.switchPokemon(b.bench);
    expect(b.defender.bench[0].getPokemonCard()).toBe(b.fossil as any);
    b.defender.switchPokemon(b.defender.bench[0]);
    expect(b.defender.active.getPokemonCard()).toBe(b.fossil as any);
  });
  it('is discarded on Knock Out and yields one Prize', () => {
    const b = setup(); const ko = new KnockOutEffect(b.defender, b.defender.active);
    b.store.reduceEffect(b.state, ko);
    expect(b.defender.active.cards).toEqual([]); expect(b.defender.discard.cards).toContain(b.fossil); expect(ko.prizeCount).toBe(1);
  });
  for (const fossil of [new AntiqueShieldFossil(), new RareFossil()]) {
    it(`sends ${fossil.name} to the Lost Zone and discards its Tool under Lost City`, () => {
      const b = setup(), tool = new BraveryCharm();
      b.defender.active.cards = [fossil, tool]; b.defender.active.tools = [tool];
      b.defender.active.marker.addMarkerToState('LOST_CITY_MARKER');
      b.store.reduceEffect(b.state, new KnockOutEffect(b.defender, b.defender.active));
      expect(b.defender.lostzone.cards).toEqual([fossil]);
      expect(b.defender.discard.cards).toEqual([tool]);
      expect(b.defender.active.cards).toEqual([]);
    });
  }
  it('sends an ordinary Knocked Out Pokemon to the Lost Zone and discards its Tool', () => {
    const b = setup(), pokemon = new Dummy(), tool = new BraveryCharm();
    b.defender.active.cards = [pokemon, tool]; b.defender.active.tools = [tool];
    b.defender.active.marker.addMarkerToState('LOST_CITY_MARKER');
    b.store.reduceEffect(b.state, new KnockOutEffect(b.defender, b.defender.active));
    expect(b.defender.lostzone.cards).toEqual([pokemon]);
    expect(b.defender.discard.cards).toEqual([tool]);
  });
  it('round-trips an existing fossil snapshot without changing its printed identity', () => {
    const b = setup(); const serializer = new StateSerializer();
    b.fossil.id = 0; b.opponent.id = 1; b.benched.id = 2;
    b.state.cardNames = [b.fossil.fullName, b.opponent.fullName, b.benched.fullName];
    StateSerializer.setKnownCards([b.fossil, b.opponent]);
    const before = serializer.serialize(b.state); const restored = serializer.deserialize(before);
    expect(serializer.serialize(restored)).toBe(before);
    expect(restored.players[0].active.getPokemonCard()?.fullName).toBe('Antique Shield Fossil M5');
  });
});
