import { CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, RetreatEffect, RetreatStartEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Player } from '../../game/store/state/player';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { StoreLike } from '../../game/store/store-like';
import { COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { resolveAfterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN as LOCK } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

function game() {
  return setupGame({ turn: 2, player1: { active: { card: 'Staravia DP', energy: ['Water Energy SVE', 'Water Energy SVE'] }, deck: padDeck(15) }, player2: { active: { card: 'Charmander BS' }, bench: [{ card: 'Squirtle BS' }], deck: padDeck(15) } });
}
function apply(g: ReturnType<typeof game>) {
  const source = g.player1.active.getPokemonCard()!;
  const attack = new AttackEffect(g.player1, g.player2, source.attacks[1]);
  g.store.reduceEffect(g.state, attack);
  expect(g.player2.active.marker.hasMarker(LOCK)).toBe(false);
  resolveAfterAttackDamage(() => undefined, g.store, g.state, attack).next();
  return source;
}
function blocked(g: ReturnType<typeof game>) {
  expect(() => g.store.reduceEffect(g.state, new RetreatStartEffect(g.player2))).toThrow();
  expect(() => g.store.reduceEffect(g.state, new RetreatEffect(g.player2, 0))).toThrow();
}

describe('Staravia DP Clutch: attack-created retreat lock', () => {
  it('registers the printed identity and attacks', () => {
    const c = getCardByName('Staravia DP') as PokemonCard;
    expect(c.setNumber).toBe('64'); expect(c.hp).toBe(70); expect(c.evolvesFrom).toBe('Starly');
    expect(c.weakness).toEqual([{ type: CardType.LIGHTNING, value: 20 }]);
    expect(c.resistance).toEqual([{ type: CardType.FIGHTING, value: -20 }]);
    expect(c.attacks.map(a => a.name)).toEqual(['Whirlwind', 'Clutch']);
  });
  it('applies only after damage and continues to block both retreat paths after its attacker enters the Lost Zone', () => {
    const g = game(); const source = apply(g);
    expect(g.player2.active.marker.hasMarker(LOCK)).toBe(true);
    g.player1.active.moveCardTo(source, g.player1.lostzone);
    blocked(g);
  });
  it('expires on the affected player’s accepted end turn, not the attacker’s', () => {
    const g = game(); apply(g); g.state.phase = GamePhase.FINISHED;
    g.store.reduceEffect(g.state, new EndTurnEffect(g.player1)); blocked(g);
    g.state.activePlayer = 1;
    g.store.reduceEffect(g.state, new EndTurnEffect(g.player2));
    expect(g.player2.active.marker.hasMarker(LOCK)).toBe(false);
  });
  it('survives a rejected end turn', () => {
    const g = game(); apply(g);
    class EndBlocker extends PokemonCard { name = 'EndBlocker'; fullName = 'EndBlocker TEST'; set = 'TEST'; reduceEffect(_s: StoreLike, state: State, e: Effect): State { if (e instanceof EndTurnEffect) e.preventDefault = true; return state; } }
    g.player1.bench[0].cards.push(new EndBlocker()); g.state.activePlayer = 1;
    g.store.reduceEffect(g.state, new EndTurnEffect(g.player2)); blocked(g);
  });
  it('clears when the affected Pokémon leaves the Active Spot and remains cleared if it returns', () => {
    const g = game(); apply(g); const affected = g.player2.active;
    g.player2.switchPokemon(g.player2.bench[0]);
    expect(affected.marker.hasMarker(LOCK)).toBe(false);
    g.player2.switchPokemon(g.player2.bench[0]);
    expect(g.player2.active.marker.hasMarker(LOCK)).toBe(false);
  });
  it('clears when the affected Pokémon evolves', () => {
    const g = game(); apply(g); g.player2.canEvolve = true; g.player2.active.pokemonPlayedTurn = 0;
    const evolution = getCardByName('Charmeleon BS') as PokemonCard; g.player2.hand.cards.push(evolution);
    g.store.reduceEffect(g.state, new PlayPokemonEffect(g.player2, evolution, g.player2.active));
    expect(g.player2.active.getPokemonCard()!.name).toBe('Charmeleon');
    expect(g.player2.active.marker.hasMarker(LOCK)).toBe(false);
  });
  it('rejects both retreat effects before other card reducers can observe them', () => {
    const g = game(); apply(g); let observed = 0;
    class Observer extends PokemonCard { name = 'Observer'; fullName = 'Observer TEST'; set = 'TEST'; reduceEffect(_s: StoreLike, state: State, e: Effect): State { if (e instanceof RetreatEffect || e instanceof RetreatStartEffect) observed++; return state; } }
    g.player1.bench[0].cards.push(new Observer()); blocked(g); expect(observed).toBe(0);
  });
  it('does not apply to a replacement in the defending slot', () => {
    const g = game(), source = g.player1.active.getPokemonCard()!;
    const attack = new AttackEffect(g.player1, g.player2, source.attacks[1]);
    g.store.reduceEffect(g.state, attack);
    g.player2.active.cards = [getCardByName('Squirtle BS')];
    resolveAfterAttackDamage(() => undefined, g.store, g.state, attack).next();
    expect(g.player2.active.marker.hasMarker(LOCK)).toBe(false);
  });
  it('respects protection against effects of attacks', () => {
    const g = game(); g.player2.active.preventEffectsOfAttacksNextTurn = true; apply(g);
    expect(g.player2.active.marker.hasMarker(LOCK)).toBe(false);
  });
  it('respects an ability that prevents effects of attacks', () => {
    const g = game();
    class Protector extends PokemonCard { name = 'Protector'; fullName = 'Protector TEST'; set = 'TEST'; reduceEffect(_s: StoreLike, state: State, e: Effect): State { if (e instanceof EffectOfAttackEffect) e.preventDefault = true; return state; } }
    g.player2.bench[1].cards.push(new Protector()); apply(g);
    expect(g.player2.active.marker.hasMarker(LOCK)).toBe(false);
  });
  it('copies Clutch onto the actual opposing Pokémon', () => {
    const g = setupGame({ turn: 2, player1: { active: { card: 'Mew ex MEW' }, deck: padDeck(15) }, player2: { active: { card: 'Staravia DP' }, bench: [{ card: 'Squirtle BS' }], deck: padDeck(15) } });
    const source = g.player2.active.getPokemonCard()!;
    g.state.playerLastAttack[g.player2.id] = { sourceCard: source, attack: source.attacks[1] };
    COPY_OPPONENTS_LAST_ATTACK(g.store, g.state, new AttackEffect(g.player1, g.player2, { name: 'Mimic', cost: [], damage: 0, text: '' }));
    expect(g.player2.active.marker.hasMarker(LOCK)).toBe(true);
    expect(g.player1.active.marker.hasMarker(LOCK)).toBe(false);
    expect(() => g.store.reduceEffect(g.state, new RetreatStartEffect(g.player2))).toThrow();
  });
  it('deals Clutch damage in an actual attack before adding the lock', () => {
    const g = game(); useAttack(g.store, g.state, 0, 'Clutch');
    expect(g.player2.active.damage).toBe(20);
    expect(g.player2.active.marker.hasMarker(LOCK)).toBe(true);
  });
  it('Whirlwind damages the original defender and lets the opponent switch', () => {
    const g = game(); useAttack(g.store, g.state, 0, 'Whirlwind');
    expect(g.player2.active.getPokemonCard()!.name).toBe('Squirtle');
    expect(g.player2.bench[0].getPokemonCard()!.name).toBe('Charmander');
    expect(g.player2.bench[0].damage).toBe(20);
  });
  it('persists through a real ClientSimulator snapshot with the attacker in the Lost Zone', () => {
    ensureClientCards();
    const state = new State(); state.phase = GamePhase.PLAYER_TURN; state.turn = 2; state.players = [new Player(), new Player()];
    const add = (list: CardList, name: string) => { const card = CardManager.getInstance().getCardByName(name)!; card.id = state.cardNames.length; state.cardNames.push(card.fullName); list.cards.push(card); };
    state.players.forEach((p, index) => {
      p.id = index + 1; p.bench = Array.from({ length: 5 }, () => new PokemonCardList()); p.prizes = Array.from({ length: 6 }, () => new CardList());
      p.prizes.forEach(prize => add(prize, 'Fire Energy SVE'));
      for (let i = 0; i < 5; i++) add(p.deck, 'Fire Energy SVE');
      add(p.active, index === 0 ? 'Staravia DP' : 'Charmander BS');
      add(p.bench[0], 'Squirtle BS');
      if (index === 1) add(p.hand, 'Charmeleon BS');
    });
    const sim = new ClientSimulator(); sim.loadSnapshot({ stateData: new Base64().encode(new StateSerializer().serialize(state)) });
    const p1 = sim.state.players[0], p2 = sim.state.players[1], store = (sim as any).store;
    const source = p1.active.getPokemonCard()!, attack = new AttackEffect(p1, p2, source.attacks[1]);
    store.reduceEffect(sim.state, attack); resolveAfterAttackDamage(() => undefined, store, sim.state, attack).next();
    p1.switchPokemon(p1.bench[0]); p1.bench[0].moveCardTo(source, p1.lostzone);
    const snapshot = sim.getStateData();
    const restored = new ClientSimulator(); restored.loadSnapshot({ stateData: snapshot });
    const player = restored.state.players[1], restoredStore = (restored as any).store;
    expect(restored.state.players[0].lostzone.cards.some(c => c.fullName === 'Staravia DP')).toBe(true);
    expect(player.active.marker.hasMarker(LOCK)).toBe(true);
    expect(() => restoredStore.reduceEffect(restored.state, new RetreatStartEffect(player))).toThrow();
    expect(() => restoredStore.reduceEffect(restored.state, new RetreatEffect(player, 0))).toThrow();
    player.switchPokemon(player.bench[0]);
    expect(player.active.marker.hasMarker(LOCK)).toBe(false);
    expect(player.bench[0].marker.hasMarker(LOCK)).toBe(false);
    const evolvedSim = new ClientSimulator(); evolvedSim.loadSnapshot({ stateData: snapshot });
    const evolving = evolvedSim.state.players[1], evolution = evolving.hand.cards[0] as PokemonCard;
    evolving.canEvolve = true; evolving.active.pokemonPlayedTurn = 0;
    (evolvedSim as any).store.reduceEffect(evolvedSim.state, new PlayPokemonEffect(evolving, evolution, evolving.active));
    expect(evolving.active.getPokemonCard()!.name).toBe('Charmeleon');
    expect(evolving.active.marker.hasMarker(LOCK)).toBe(false);
    const turnSim = new ClientSimulator(); turnSim.loadSnapshot({ stateData: snapshot });
    const turnStore = (turnSim as any).store, attacker = turnSim.state.players[0], defender = turnSim.state.players[1];
    turnSim.state.phase = GamePhase.FINISHED;
    turnStore.reduceEffect(turnSim.state, new EndTurnEffect(attacker));
    expect(defender.active.marker.hasMarker(LOCK)).toBe(true);
    class EndBlocker extends PokemonCard { name = 'EndBlocker'; fullName = 'EndBlocker TEST'; set = 'TEST'; reduceEffect(_s: StoreLike, state: State, e: Effect): State { if (e instanceof EndTurnEffect) e.preventDefault = true; return state; } }
    attacker.bench[1].cards.push(new EndBlocker()); turnSim.state.activePlayer = 1;
    turnStore.reduceEffect(turnSim.state, new EndTurnEffect(defender));
    expect(defender.active.marker.hasMarker(LOCK)).toBe(true);
    attacker.bench[1].cards = [];
    turnStore.reduceEffect(turnSim.state, new EndTurnEffect(defender));
    expect(defender.active.marker.hasMarker(LOCK)).toBe(false);
  });
});
