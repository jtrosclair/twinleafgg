import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { compactSerializedState } from '../../game/serializer/compact-state';
import { RetreatAction, RetreatStartAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CAN_PLAY_TRAINER_CARD } from '../../game/store/prefabs/prefabs';
import { ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Player } from '../../game/store/state/player';
import { Rules } from '../../game/store/state/rules';
import { State, GamePhase } from '../../game/store/state/state';
import { Base64 } from '../../utils/base64';
import { ensureClientCards } from '../../client/cards';
import { ClientSimulator } from '../../client/simulator';
import { getCardByName, padDeck, setupGame } from './test-helpers';

function game(active = 'Staravia DP', bench = 'Staravia DP', hand: string[] = []) {
  return setupGame({ turn: 3, player1: { active: { card: active }, bench: [{ card: bench }], hand, deck: padDeck(10) }, player2: { active: { card: 'Squirtle BS' }, deck: padDeck(10) } });
}
function stadium(g: ReturnType<typeof game>, name: string) {
  const index = g.player1.hand.cards.findIndex(c => c.fullName === name);
  g.store.dispatch(new PlayCardAction(g.player1.id, index, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
}
const fields = ['oneRetreatPerTurn', 'oneStadiumPerTurn', 'allowSameNameStadium'] as const;

describe('opt-in upstream retro retreat and Stadium rules', () => {
  it('preserves legacy Rules wire shape and round-trips explicit boolean values', () => {
    const rules = new Rules(), serializer = new StateSerializer();
    for (const key of fields) expect(Object.prototype.hasOwnProperty.call(rules, key)).toBe(false);
    for (const value of [undefined, false, true]) {
      const state = new State(); if (value !== undefined) for (const key of fields) state.rules[key] = value;
      const compact = compactSerializedState(serializer.serialize(state)), restored = serializer.deserialize(compact);
      const serialized = JSON.parse(compact)[1].rules;
      for (const key of fields) { expect(restored.rules[key]).toBe(value); expect(Object.prototype.hasOwnProperty.call(serialized, key)).toBe(value !== undefined); }
    }
  });
  for (const viaStart of [false, true]) for (const rule of [undefined, true, false]) it(`${viaStart ? 'prompted' : 'direct'} retreat ${rule === false ? 'permits' : 'blocks'} a second retreat when rule=${rule}`, () => {
    const g = game(); if (rule !== undefined) g.state.rules.oneRetreatPerTurn = rule;
    const action = () => viaStart ? new RetreatStartAction(g.player1.id) : new RetreatAction(g.player1.id, 0);
    const first = g.player1.active.getPokemonCard()!;
    g.store.dispatch(action()); expect(g.player1.active.getPokemonCard()).not.toBe(first);
    if (rule === false) { g.store.dispatch(action()); expect(g.player1.active.getPokemonCard()).toBe(first); }
    else { expect(() => g.store.dispatch(action())).toThrow(); expect(g.player1.active.getPokemonCard()).not.toBe(first); }
  });
  it('unlimited retreats still require energy and pay it on every retreat', () => {
    const g = game('Ralts SIT', 'Ralts SIT'); g.state.rules.oneRetreatPerTurn = false;
    const first = getCardByName('Psychic Energy SVE'), second = getCardByName('Water Energy SVE');
    g.player1.active.cards.push(first); g.player1.active.energies.cards.push(first);
    g.player1.bench[0].cards.push(second); g.player1.bench[0].energies.cards.push(second);
    g.store.dispatch(new RetreatAction(g.player1.id, 0)); g.store.dispatch(new RetreatAction(g.player1.id, 0));
    expect(g.player1.discard.cards).toContain(first); expect(g.player1.discard.cards).toContain(second);
    expect(() => g.store.dispatch(new RetreatAction(g.player1.id, 0))).toThrow();
  });
  for (const condition of [SpecialCondition.ASLEEP, SpecialCondition.PARALYZED]) it('unlimited retreats do not bypass status ' + condition, () => {
    const g = game(); g.state.rules.oneRetreatPerTurn = false; g.player1.active.specialConditions = [condition];
    expect(() => g.store.dispatch(new RetreatAction(g.player1.id, 0))).toThrow();
    expect(() => g.store.dispatch(new RetreatStartAction(g.player1.id))).toThrow();
  });
  it('unlimited retreats do not bypass an attack-created retreat lock', () => {
    const g = game(); g.state.rules.oneRetreatPerTurn = false;
    g.player1.active.marker.addMarker(ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN, g.player2.active.getPokemonCard()!, 'attack', 'pokemon');
    expect(() => g.store.dispatch(new RetreatAction(g.player1.id, 0))).toThrow();
    expect(() => g.store.dispatch(new RetreatStartAction(g.player1.id))).toThrow();
  });
  for (const rule of [undefined, true, false]) it(`Stadium hints and actual play agree for second different Stadium when oneStadiumPerTurn=${rule}`, () => {
    const g = game('Staravia DP', 'Staravia DP', ['Training Court RCL', 'Beach Court SVI']);
    if (rule !== undefined) g.state.rules.oneStadiumPerTurn = rule;
    stadium(g, 'Training Court RCL'); const next = g.player1.hand.cards[0] as TrainerCard;
    expect(CAN_PLAY_TRAINER_CARD(g.store, g.state, g.player1, next)).toBe(rule === false);
    expect(g.player1.playableCardIds.includes(next.id)).toBe(rule === false);
    if (rule === false) { stadium(g, 'Beach Court SVI'); expect(g.player1.stadium.cards[0].fullName).toBe('Beach Court SVI'); expect(g.player1.discard.cards.some(c => c.fullName === 'Training Court RCL')).toBe(true); }
    else expect(() => stadium(g, 'Beach Court SVI')).toThrow();
  });
  for (const same of [undefined, false, true]) for (const perTurn of [undefined, false]) it(`same-name replacement requires the independent allowances: same=${same}, perTurn=${perTurn}`, () => {
    const g = game('Staravia DP', 'Staravia DP', ['Training Court RCL', 'Training Court RCL']);
    if (same !== undefined) g.state.rules.allowSameNameStadium = same;
    if (perTurn !== undefined) g.state.rules.oneStadiumPerTurn = perTurn;
    stadium(g, 'Training Court RCL'); const next = g.player1.hand.cards[0] as TrainerCard, allowed = same === true && perTurn === false;
    expect(CAN_PLAY_TRAINER_CARD(g.store, g.state, g.player1, next)).toBe(allowed);
    if (allowed) { stadium(g, 'Training Court RCL'); expect(g.player1.stadium.cards.length).toBe(1); expect(g.player1.discard.cards.length).toBe(1); }
    else expect(() => stadium(g, 'Training Court RCL')).toThrow();
  });
  it('same-name flag permits replacement of opponent’s Stadium without granting a second play', () => {
    const g = game('Staravia DP', 'Staravia DP', ['Training Court RCL']);
    const opposing = getCardByName('Training Court RCL'); g.player2.stadium.cards.push(opposing);
    g.state.rules.allowSameNameStadium = true;
    expect(CAN_PLAY_TRAINER_CARD(g.store, g.state, g.player1, g.player1.hand.cards[0] as TrainerCard)).toBe(true);
    stadium(g, 'Training Court RCL'); expect(g.player2.discard.cards).toContain(opposing);
  });
  it('the same-name allowance covers different printings of the same Stadium', () => {
    ensureClientCards();
    const g = game('Staravia DP', 'Staravia DP', ['Training Court FST 282']);
    const opposing = getCardByName('Training Court RCL'); g.player2.stadium.cards.push(opposing);
    expect(CAN_PLAY_TRAINER_CARD(g.store, g.state, g.player1, g.player1.hand.cards[0] as TrainerCard)).toBe(false);
    g.state.rules.allowSameNameStadium = true;
    expect(CAN_PLAY_TRAINER_CARD(g.store, g.state, g.player1, g.player1.hand.cards[0] as TrainerCard)).toBe(true);
    stadium(g, 'Training Court FST 282'); expect(g.player2.discard.cards).toContain(opposing);
  });
  it('same-name replacement of a Prism Star Stadium still sends the original to the Lost Zone', () => {
    const g = game('Staravia DP', 'Staravia DP', ['Thunder Mountain ◇ LOT', 'Thunder Mountain ◇ LOT']);
    g.state.rules.oneStadiumPerTurn = false;
    stadium(g, 'Thunder Mountain ◇ LOT'); const prism = g.player1.stadium.cards[0];
    expect(CAN_PLAY_TRAINER_CARD(g.store, g.state, g.player1, g.player1.hand.cards[0] as TrainerCard)).toBe(false);
    g.state.rules.allowSameNameStadium = true;
    expect(CAN_PLAY_TRAINER_CARD(g.store, g.state, g.player1, g.player1.hand.cards[0] as TrainerCard)).toBe(true);
    stadium(g, 'Thunder Mountain ◇ LOT');
    expect(g.player1.lostzone.cards).toContain(prism); expect(g.player1.discard.cards).not.toContain(prism);
  });
  for (const value of [undefined, true]) it(`Hyperrogue Ange Floette can replace Prism Tower in the same turn when oneStadiumPerTurn=${value}`, () => {
    const g = game('Staravia DP', 'Staravia DP', ['Prism Tower M4', 'Hyperrogue Ange Floette M4']);
    if (value !== undefined) g.state.rules.oneStadiumPerTurn = value;
    stadium(g, 'Prism Tower M4'); const next = g.player1.hand.cards[0] as TrainerCard;
    expect(CAN_PLAY_TRAINER_CARD(g.store, g.state, g.player1, next)).toBe(true);
    stadium(g, 'Hyperrogue Ange Floette M4');
    expect(g.player1.stadium.cards[0].fullName).toBe('Hyperrogue Ange Floette M4');
    expect(g.player1.discard.cards.some(c => c.fullName === 'Prism Tower M4')).toBe(true);
  });
  it('Stadium flags cannot bypass an attack-created Stadium lock', () => {
    const g = game('Staravia DP', 'Staravia DP', ['Training Court RCL']);
    g.state.rules.oneStadiumPerTurn = false; g.state.rules.allowSameNameStadium = true;
    g.player1.marker.addMarkerToState(g.player1.ATTACK_EFFECT_STADIUM_LOCK);
    expect(() => stadium(g, 'Training Court RCL')).toThrow();
    expect(g.player1.hand.cards.length).toBe(1); expect(g.player1.stadium.cards.length).toBe(0);
  });
  it('ClientSimulator restores the opt-in flags and rejects malformed values', () => {
    ensureClientCards(); const state = new State(); state.phase = GamePhase.PLAYER_TURN; state.turn = 3; state.players = [new Player(), new Player()];
    const add = (list: CardList, name: string) => { const c = CardManager.getInstance().getCardByName(name)!; c.id = state.cardNames.length; state.cardNames.push(c.fullName); list.cards.push(c); };
    state.players.forEach((p, i) => { p.id = i + 1; p.bench = Array.from({ length: 5 }, () => new PokemonCardList()); p.prizes = Array.from({ length: 6 }, () => new CardList()); p.prizes.forEach(x => add(x, 'Fire Energy SVE')); for (let j = 0; j < 4; j++) add(p.deck, 'Fire Energy SVE'); add(p.active, 'Staravia DP'); add(p.bench[0], 'Staravia DP'); });
    for (const key of fields) state.rules[key] = key === 'allowSameNameStadium';
    const serializer = new StateSerializer(), full = serializer.serialize(state), compact = compactSerializedState(full);
    for (const payload of [full, compact]) {
      const sim = new ClientSimulator(); sim.loadSnapshot({ stateData: new Base64().encode(payload) });
      for (const key of fields) expect(sim.state.rules[key]).toBe(state.rules[key]);
      const id = sim.humanPlayerId; sim.dispatch(new RetreatAction(id, 0)); sim.dispatch(new RetreatAction(id, 0));
      const saved = sim.getStateData(), restored = new ClientSimulator(); restored.loadSnapshot({ stateData: saved });
      for (const key of fields) expect(restored.state.rules[key]).toBe(state.rules[key]);
      for (const key of fields) for (const invalid of [null, 'false', 0]) {
        const data = JSON.parse(payload); data[1].rules[key] = invalid;
        expect(() => new ClientSimulator().loadSnapshot({ stateData: new Base64().encode(JSON.stringify(data)) })).toThrow();
      }
    }
  });
});
