import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { Gimmighoul } from '../set-surging-sparks/gimmighoul';

class Basic extends PokemonCard { public name = 'Fixture'; public fullName = 'Fixture TST'; public set = 'TST'; }
function setup() {
  const state = new State(), player = new Player(), opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2;
  state.phase = GamePhase.ATTACK; state.activePlayer = 0;
  const gimmighoul = new Gimmighoul(); player.active.cards = [gimmighoul]; opponent.active.cards = [new Basic()];
  const water = new WaterEnergy(); player.deck.cards = [water, new Basic()];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  store.reduceEffect(state, new AttackEffect(player, opponent, gimmighoul.attacks[0]));
  return { state, store, player, opponent, water };
}
function resolve(x: ReturnType<typeof setup>, indices: number[]) {
  const prompt = x.state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt;
  expect(prompt).toBeDefined(); const choice = prompt.decode(indices);
  expect(prompt.validate(choice)).toBe(true);
  (x.store as any).reducePrompt(x.state, new ResolvePromptAction(prompt.id, choice));
}
describe('Upstream Gimmighoul deck-search ordering', () => {
  it('searches before requesting shuffle and then shuffles only remaining cards', () => {
    const x = setup();
    expect(x.state.prompts.filter(p => p instanceof ShuffleDeckPrompt && p.result === undefined).length).toBe(0);
    resolve(x, [x.player.deck.cards.indexOf(x.water)]);
    expect(x.player.hand.cards).toContain(x.water);
    expect(x.player.deck.cards).not.toContain(x.water);
    const shuffle = x.state.prompts.find(p => p instanceof ShuffleDeckPrompt && p.result === undefined) as ShuffleDeckPrompt;
    expect(shuffle).toBeDefined(); expect(shuffle.validate([0], x.state)).toBe(true);
    (x.store as any).reducePrompt(x.state, new ResolvePromptAction(shuffle.id, [0]));
    expect(x.player.deck.cards.length).toBe(1); expect(x.player.hand.cards).toContain(x.water);
  });
  it('allows searching for zero Energy and still requests a shuffle afterward', () => {
    const x = setup();
    expect(x.state.prompts.filter(p => p instanceof ShuffleDeckPrompt && p.result === undefined).length).toBe(0);
    resolve(x, []);
    expect(x.player.deck.cards.length).toBe(2); expect(x.player.hand.cards.length).toBe(0);
    const shuffle = x.state.prompts.find(p => p instanceof ShuffleDeckPrompt && p.result === undefined) as ShuffleDeckPrompt;
    expect(shuffle).toBeDefined(); expect(shuffle.validate([0, 1], x.state)).toBe(true);
  });
});
