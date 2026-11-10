import { CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { HisuianLilligantVstar } from '../set-astral-radiance/hisuian-lilligant-vstar';
import { Galvantula } from '../set-steam-siege/galvantula';
import { GrassEnergy } from '../set-scarlet-and-violet-energy/grass-energy';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { LuminousEnergy } from '../set-paldea-evolved/luminous-energy';

class GrassMon extends PokemonCard { public name = 'Grass Fixture'; public fullName = 'Grass Fixture TST'; public set = 'TST'; public cardType = CardType.GRASS; }
class FireMon extends PokemonCard { public name = 'Fire Fixture'; public fullName = 'Fire Fixture TST'; public set = 'TST'; public cardType = CardType.FIRE; }
function setup() {
  const state = new State(), player = new Player(), opponent = new Player(), lilligant = new HisuianLilligantVstar();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.phase = GamePhase.PLAYER_TURN; state.turn = 3; state.activePlayer = 0;
  player.active.cards = [lilligant]; opponent.active.cards = [new FireMon()];
  const grass = new GrassEnergy(), water = new WaterEnergy(), dual = new Galvantula(), grassMon = new GrassMon(), fireMon = new FireMon();
  player.deck.cards = [grass, water, dual, grassMon, fireMon];
  player.deck.cards.forEach((card, index) => { card.id = index + 1; });
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  const power = () => store.reduceEffect(state, new PowerEffect(player, lilligant.powers[0], lilligant));
  return { state, player, opponent, store, power, grass, water, dual, grassMon, fireMon };
}
function choose(x: ReturnType<typeof setup>, indices: number[]) {
  const p = x.state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt;
  const chosen = p.decode(indices); expect(p.validate(chosen)).toBe(true);
  if (!p.validate(chosen)) { throw new Error('Prompt rejected the selected cards'); }
  (x.store as any).reducePrompt(x.state, new ResolvePromptAction(p.id, chosen));
}
describe('Hisuian Lilligant VSTAR ASR Star Perfume', () => {
  it('offers Grass Energy and both single-type and dual-type Grass Pokémon', () => {
    const x = setup(); x.power();
    const prompt = x.state.prompts.find(p => p instanceof ChooseCardsPrompt) as ChooseCardsPrompt;
    const blocked = prompt.options.blocked.map(i => prompt.cards.cards[i]);
    expect(blocked.length).toBe(2); expect(blocked).toContain(x.water); expect(blocked).toContain(x.fireMon);
    expect(prompt.options.max).toBe(5); expect(x.player.usedVSTAR).toBe(true);
    expect(x.state.prompts.some(p => p instanceof ShuffleDeckPrompt)).toBe(false);
  });
  it('moves and reveals selected cards, then shuffles only those remaining', () => {
    const x = setup(); x.power(); choose(x, [x.grass, x.dual, x.grassMon].map(card => x.player.deck.cards.indexOf(card)));
    expect(x.player.hand.cards).toEqual([x.grass, x.dual, x.grassMon]);
    expect(x.player.deck.cards.length).toBe(2); expect(x.player.deck.cards).toContain(x.water); expect(x.player.deck.cards).toContain(x.fireMon);
    const show = x.state.prompts.find(p => p instanceof ShowCardsPrompt && p.result === undefined) as ShowCardsPrompt;
    expect(show).toBeDefined(); expect(show.playerId).toBe(x.opponent.id);
    const shuffle = x.state.prompts.find(p => p instanceof ShuffleDeckPrompt && p.result === undefined) as ShuffleDeckPrompt;
    expect(shuffle).toBeDefined(); expect(shuffle.validate([1, 0], x.state)).toBe(true);
    const remaining = x.player.deck.cards.slice();
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(shuffle.id, [1, 0]));
    expect(x.player.deck.cards).toEqual([remaining[1], remaining[0]]);
  });
  it('allows selecting no cards and still shuffles', () => {
    const x = setup(); x.power(); choose(x, []);
    expect(x.player.hand.cards).toEqual([]); expect(x.player.deck.cards.length).toBe(5);
    expect(x.state.prompts.some(p => p instanceof ShowCardsPrompt && p.result === undefined)).toBe(false);
    expect(x.state.prompts.some(p => p instanceof ShuffleDeckPrompt && p.result === undefined)).toBe(true);
  });
  it('blocks a Special Energy that provides Grass only when attached', () => {
    const x = setup(), luminous = new LuminousEnergy(); luminous.id = 6; x.player.deck.cards.push(luminous);
    x.power(); const prompt = x.state.prompts.find(p => p instanceof ChooseCardsPrompt) as ChooseCardsPrompt;
    expect(prompt.validate([luminous])).toBe(false);
    expect(prompt.validate([x.dual, x.grass])).toBe(true);
  });
  it('enforces the maximum of five eligible cards', () => {
    const x = setup(), more = Array.from({ length: 4 }, (_, index) => { const card = new GrassEnergy(); card.id = index + 6; return card; });
    x.player.deck.cards.push(...more); x.power();
    const prompt = x.state.prompts.find(p => p instanceof ChooseCardsPrompt) as ChooseCardsPrompt;
    expect(prompt.validate([x.grass, x.dual, x.grassMon, ...more.slice(0, 2)])).toBe(true);
    expect(prompt.validate([x.grass, x.dual, x.grassMon, ...more])).toBe(false);
  });
  it('does not allow a second VSTAR use', () => {
    const x = setup(); x.player.usedVSTAR = true;
    expect(x.power).toThrow(); expect(x.state.prompts.length).toBe(0);
    expect(x.player.deck.cards.length).toBe(5);
  });
});
