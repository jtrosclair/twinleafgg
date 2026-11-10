import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { AttackAction, RetreatAction } from '../../game/store/actions/game-actions';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Player } from '../../game/store/state/player';
import { GamePhase, State } from '../../game/store/state/state';
import { Base64 } from '../../utils/base64';
import { ensureClientCards } from '../../client/cards';
import { ClientSimulator } from '../../client/simulator';
import { RainbowEnergy } from '../set-sun-and-moon/rainbow-energy';
import { ownsMirrorEnergyQuery } from '../../game/store/prefabs/mirror-only-energy';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';
import { Store } from '../../game/store/store';

function fixture(physical: boolean, handDuplicate = false, energyName = 'Rainbow Energy SUM') {
  ensureClientCards(); const state = new State(); state.phase = GamePhase.PLAYER_TURN; state.turn = 3; state.players = [new Player(), new Player()];
  const add = (list: CardList, name: string) => { const c = CardManager.getInstance().getCardByName(name)!; c.id = state.cardNames.length; state.cardNames.push(c.fullName); list.cards.push(c); return c; };
  state.players.forEach((p, i) => { p.id = i + 1; p.bench = Array.from({ length: 5 }, () => new PokemonCardList()); p.prizes = Array.from({ length: 6 }, () => new CardList()); p.prizes.forEach(x => add(x, 'Fire Energy SVE')); for (let j = 0; j < 4; j++) add(p.deck, 'Fire Energy SVE'); add(p.active, i === 0 ? 'Charmander BS' : 'Squirtle BS'); });
  const player = state.players[0]; add(player.active, 'Water Energy SVE');
  const rainbow = add(physical ? player.active : player.active.energies, energyName);
  if (physical) player.active.energies.cards.push(rainbow);
  if (handDuplicate) player.hand.cards.push(rainbow);
  return state;
}
function load(state: State) { const sim = new ClientSimulator(); sim.loadSnapshot({ stateData: new Base64().encode(new StateSerializer().serialize(state)) }); return sim; }
function provided(sim: ClientSimulator) { const player = sim.state.players[0], effect = new CheckProvidedEnergyEffect(player); (sim as any).store.reduceEffect(sim.state, effect); return effect.energyMap.find(x => x.card.name === 'Rainbow Energy')!; }

describe('unambiguous mirror-only Rainbow Energy', () => {
  it('a normally attached Rainbow Energy provides ANY', () => {
    const sim = load(fixture(true)); expect(provided(sim).provides).toEqual([CardType.ANY]);
  });
  it('the same mirror-only Rainbow Energy provides ANY without altering its attachment representation', () => {
    const sim = load(fixture(false)), player = sim.state.players[0], rainbow = player.active.energies.cards[0];
    const serializer = new StateSerializer(), before = serializer.serialize(sim.state);
    expect(player.active.cards).not.toContain(rainbow); expect(provided(sim).provides).toEqual([CardType.ANY]);
    expect(serializer.serialize(sim.state)).toBe(before);
  });
  it('normal physical attachment from hand still inflicts exactly one damage counter', () => {
    const state = fixture(false), p = state.players[0], rainbow = p.active.energies.cards.pop()!; p.hand.cards.push(rainbow);
    const sim = load(state), player = sim.state.players[0];
    sim.dispatch(new PlayCardAction(player.id, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }));
    expect(player.active.damage).toBe(10); expect(player.active.cards.filter(c => c.fullName === 'Rainbow Energy SUM').length).toBe(1);
  });
  it('preserves the same mirror-only representation through a compact ClientSimulator round-trip', () => {
    const sim = load(fixture(false)), serialized = new StateSerializer().serialize(sim.state);
    const restored = new ClientSimulator(); restored.loadSnapshot({ stateData: sim.getStateData() });
    expect(new StateSerializer().serialize(restored.state)).toBe(serialized);
    const p = restored.state.players[0], rainbow = p.active.energies.cards[0];
    expect(p.active.cards).not.toContain(rainbow); expect(provided(restored).provides).toEqual([CardType.ANY]);
  });
  it('a real Charmander Ember action can pay with and discard the mirror-only Rainbow', () => {
    const sim = load(fixture(false)), p = sim.state.players[0], rainbow = p.active.energies.cards[0];
    sim.dispatch(new AttackAction(sim.humanPlayerId, 'Ember'));
    const prompt = sim.state.prompts.find(x => x instanceof ChooseEnergyPrompt && x.result === undefined) as ChooseEnergyPrompt;
    expect(prompt).toBeDefined(); const index = prompt.energy.findIndex(x => x.card === rainbow); expect(index).toBeGreaterThanOrEqual(0);
    sim.resolvePrompt(prompt.id, [index]); expect(p.discard.cards).toContain(rainbow); expect(p.active.energies.cards).not.toContain(rainbow);
  });
  it('the same real action succeeds and discards a normally attached Rainbow', () => {
    const sim = load(fixture(true)), p = sim.state.players[0], rainbow = p.active.energies.cards[0];
    sim.dispatch(new AttackAction(sim.humanPlayerId, 'Ember'));
    const prompt = sim.state.prompts.find(x => x instanceof ChooseEnergyPrompt && x.result === undefined) as ChooseEnergyPrompt;
    expect(prompt).toBeDefined(); const index = prompt.energy.findIndex(x => x.card === rainbow); expect(index).toBeGreaterThanOrEqual(0);
    sim.resolvePrompt(prompt.id, [index]);
    expect(p.discard.cards).toContain(rainbow); expect(p.active.energies.cards).not.toContain(rainbow);
  });
  it('ordinary attack-discard movement removes a mirror-only Rainbow', () => {
    const sim = load(fixture(false)), p = sim.state.players[0], opponent = sim.state.players[1], rainbow = p.active.energies.cards[0];
    const base = new AttackEffect(p, opponent, { name: 'test', cost: [], damage: 0, text: '' }); const discard = new DiscardCardsEffect(base, [rainbow]); discard.target = p.active;
    (sim as any).store.reduceEffect(sim.state, discard);
    expect(p.active.energies.cards).not.toContain(rainbow); expect(p.discard.cards).toContain(rainbow);
  });
  it('a real retreat discards the chosen mirror-only Rainbow as its cost', () => {
    const state = fixture(false), p = state.players[0], bench = CardManager.getInstance().getCardByName('Squirtle BS')!;
    bench.id = state.cardNames.length; state.cardNames.push(bench.fullName); p.bench[0].cards.push(bench);
    const sim = load(state), player = sim.state.players[0], original = player.active.getPokemonCard()!, rainbow = player.active.energies.cards[0];
    sim.dispatch(new RetreatAction(player.id, 0));
    const prompt = sim.state.prompts.find(x => x instanceof ChooseEnergyPrompt && x.result === undefined) as ChooseEnergyPrompt;
    expect(prompt).toBeDefined(); const index = prompt.energy.findIndex(x => x.card === rainbow); expect(index).toBeGreaterThanOrEqual(0);
    sim.resolvePrompt(prompt.id, [index]);
    expect(player.active.getPokemonCard()).not.toBe(original); expect(player.discard.cards).toContain(rainbow);
    expect(player.bench[0].energies.cards).not.toContain(rainbow);
  });
  it('a mirror reference can also be the identical card in hand; moving it naively would duplicate a physical card', () => {
    const sim = load(fixture(false, true)), p = sim.state.players[0], rainbow = p.active.energies.cards[0];
    expect(p.hand.cards).toContain(rainbow); expect(p.active.cards).not.toContain(rainbow); expect(provided(sim).provides).toEqual([CardType.COLORLESS]);
  });
  it('does not treat the same card as attached when it is physically in the Lost Zone', () => {
    const state = fixture(false), p = state.players[0], rainbow = p.active.energies.cards[0]; p.lostzone.cards.push(rainbow);
    const sim = load(state); expect(provided(sim).provides).toEqual([CardType.COLORLESS]);
  });
  it('does not infer ownership when the same mirror appears on two Pokémon', () => {
    const state = fixture(false), p = state.players[0], rainbow = p.active.energies.cards[0];
    const pokemon = CardManager.getInstance().getCardByName('Squirtle BS')!; pokemon.id = state.cardNames.length; state.cardNames.push(pokemon.fullName);
    p.bench[0].cards.push(pokemon); p.bench[0].energies.cards.push(rainbow);
    const sim = load(state); expect(provided(sim).provides).toEqual([CardType.COLORLESS]);
  });
  it('does not infer ownership when the identical card is physically in the opponent’s hand', () => {
    const state = fixture(false), rainbow = state.players[0].active.energies.cards[0]; state.players[1].hand.cards.push(rainbow);
    const sim = load(state); expect(provided(sim).provides).toEqual([CardType.COLORLESS]);
  });
  it('supports a uniquely owned mirror-only Rainbow on the Bench without modifying it', () => {
    const state = fixture(false), p = state.players[0], rainbow = p.active.energies.cards.pop()!;
    const pokemon = CardManager.getInstance().getCardByName('Squirtle BS')!; pokemon.id = state.cardNames.length; state.cardNames.push(pokemon.fullName);
    p.bench[0].cards.push(pokemon); p.bench[0].energies.cards.push(rainbow);
    const sim = load(state), player = sim.state.players[0], target = player.bench[0], query = new CheckProvidedEnergyEffect(player, target);
    (sim as any).store.reduceEffect(sim.state, query);
    expect(query.energyMap.find(x => x.card.name === 'Rainbow Energy')!.provides).toEqual([CardType.ANY]);
    expect(target.cards).not.toContain(target.energies.cards[0]);
  });
  for (const physical of [false, true]) it(`queries the opponent’s ${physical?'physical':'mirror-only'} Energy with the target slot’s owner`, () => {
    const state = fixture(physical), sim = load(state), attacker = sim.state.players[1], target = sim.state.players[0].active;
    const query = new CheckProvidedEnergyEffect(attacker, target); (sim as any).store.reduceEffect(sim.state, query);
    expect(query.energyMap.find(x => x.card.name === 'Rainbow Energy')!.provides).toEqual([CardType.ANY]);
  });
  it('does not infer ownership when a slot contains the same mirror twice', () => {
    const state = fixture(false), p = state.players[0]; p.active.energies.cards.push(p.active.energies.cards[0]);
    const sim = load(state); expect(provided(sim).provides).toEqual([CardType.COLORLESS]);
  });
  it('does not infer ownership when the card is nested under a physically present card', () => {
    const state = fixture(false), p = state.players[0], rainbow = p.active.energies.cards[0];
    p.deck.cards[0].cards.cards.push(rainbow);
    const store = new Store({ onStateChange: () => undefined }); store.state = state;
    const effect = new CheckProvidedEnergyEffect(p); store.reduceEffect(state, effect);
    expect(effect.energyMap.find(x => x.card === rainbow)!.provides).toEqual([CardType.COLORLESS]);
  });
  for (const name of ['Rainbow Energy TR', 'Rainbow Energy HS']) it(`retains mirror-only behavior for ${name}`, () => {
    const sim = load(fixture(false, false, name)); expect(provided(sim).provides).toEqual([CardType.ANY]);
  });
  for (const physical of [false, true]) it(`Temple of Sinnoh suppresses ${physical?'physical':'mirror-only'} Rainbow`, () => {
    const state = fixture(physical), temple = CardManager.getInstance().getCardByName('Temple of Sinnoh ASR')!;
    temple.id = state.cardNames.length; state.cardNames.push(temple.fullName); state.players[1].stadium.cards.push(temple);
    const sim = load(state); expect(provided(sim).provides).toEqual([CardType.COLORLESS]);
  });
  for (const physical of [false, true]) it(`Typhlosion Blazing Energy overrides ${physical?'physical':'mirror-only'} Rainbow`, () => {
    const state = fixture(physical), p = state.players[0], typhlosion = CardManager.getInstance().getCardByName('Typhlosion LOT')! as any;
    typhlosion.id = state.cardNames.length; state.cardNames.push(typhlosion.fullName); p.bench[0].cards.push(typhlosion);
    p.marker.addMarker(typhlosion.BLAZING_ENERGY_ACTIVE_MARKER, typhlosion);
    const sim = load(state); expect(provided(sim).provides).toEqual([CardType.FIRE]);
  });
  it('inherits the explicit mirror query only through reprints that retain the Rainbow reducer', () => {
    ensureClientCards();
    const rainbowCards = ensureClientCards().filter(card => card instanceof RainbowEnergy);
    expect(rainbowCards.length).toBe(11);
    for (const card of rainbowCards) expect(ownsMirrorEnergyQuery(card)).toBe(true);
    class ChangedRainbow extends RainbowEnergy { reduceEffect(_store: StoreLike, state: State, _effect: Effect): State { return state; } }
    expect(ownsMirrorEnergyQuery(new ChangedRainbow())).toBe(false);
  });
});
