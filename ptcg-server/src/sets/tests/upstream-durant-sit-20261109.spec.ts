import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GrassEnergy } from '../set-scarlet-and-violet-energy/grass-energy';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { LuminousEnergy } from '../set-paldea-evolved/luminous-energy';
import { Durant } from '../set-silver-tempest/durant';

class Basic extends PokemonCard { public name = 'Fixture'; public fullName = 'Fixture TST'; public set = 'TST'; public hp = 100; }
function setup() {
  const state = new State(), player = new Player(), opponent = new Player(), durant = new Durant();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2;
  state.phase = GamePhase.ATTACK; state.activePlayer = 0;
  player.active.cards = [durant]; opponent.active.cards = [new Basic()];
  const water = new WaterEnergy(), grass = new GrassEnergy(), luminous = new LuminousEnergy(), pokemon = new Basic();
  player.deck.cards = [water, grass, luminous, pokemon]; player.deck.cards.forEach((c, index) => { c.id = index + 1; });
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  store.reduceEffect(state, new AttackEffect(player, opponent, durant.attacks[0]));
  return { state, store, player, opponent, water, grass, luminous, pokemon };
}
function choose(x: ReturnType<typeof setup>, cards: (GrassEnergy | WaterEnergy)[]) {
  const prompt = x.state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt;
  const indices = cards.map(card => x.player.deck.cards.indexOf(card));
  const selected = prompt.decode(indices); expect(prompt.validate(selected)).toBe(true);
  if (!prompt.validate(selected)) throw new Error('Selection rejected');
  (x.store as any).reducePrompt(x.state, new ResolvePromptAction(prompt.id, selected));
}
describe('Durant SIT Energy Digging', () => {
  it('lets the player choose before any shuffle is requested', () => {
    const x = setup();
    expect(x.state.prompts.some(p => p instanceof ChooseCardsPrompt && p.result === undefined)).toBe(true);
    expect(x.state.prompts.some(p => p instanceof ShuffleDeckPrompt && p.result === undefined)).toBe(false);
  });
  it('reveals and retrieves the two chosen basic Energy, then shuffles the remaining deck', () => {
    const x = setup(); choose(x, [x.water, x.grass]);
    expect(x.player.hand.cards).toEqual([x.water, x.grass]);
    expect(x.player.deck.cards.length).toBe(2); expect(x.player.deck.cards).toContain(x.luminous); expect(x.player.deck.cards).toContain(x.pokemon);
    const show = x.state.prompts.find(p => p instanceof ShowCardsPrompt && p.result === undefined) as ShowCardsPrompt;
    expect(show).toBeDefined(); expect(show.playerId).toBe(x.opponent.id); expect(show.cards).toEqual([x.water, x.grass]);
    const shuffle = x.state.prompts.find(p => p instanceof ShuffleDeckPrompt && p.result === undefined) as ShuffleDeckPrompt;
    expect(shuffle).toBeDefined(); expect(shuffle.validate([1, 0], x.state)).toBe(true);
    const remaining = x.player.deck.cards.slice();
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(shuffle.id, [1, 0]));
    expect(x.player.deck.cards).toEqual([remaining[1], remaining[0]]);
  });
  it('lets the player choose zero and still shuffles', () => {
    const x = setup(); choose(x, []);
    expect(x.player.hand.cards).toEqual([]); expect(x.player.deck.cards.length).toBe(4);
    expect(x.state.prompts.some(p => p instanceof ShowCardsPrompt && p.result === undefined)).toBe(false);
    expect(x.state.prompts.some(p => p instanceof ShuffleDeckPrompt && p.result === undefined)).toBe(true);
  });
  it('rejects Special Energy and Pokémon in the search', () => {
    const x = setup(); const p = x.state.prompts.find(p => p instanceof ChooseCardsPrompt) as ChooseCardsPrompt;
    expect(p.validate([x.luminous])).toBe(false); expect(p.validate([x.pokemon])).toBe(false);
    expect(p.validate([x.water, x.grass])).toBe(true);
  });
});
