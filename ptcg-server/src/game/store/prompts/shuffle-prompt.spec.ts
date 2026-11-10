import { Player } from '../state/player';
import { State } from '../state/state';
import { ShuffleDeckPrompt } from './shuffle-prompt';
import { FireEnergy } from '../../../sets/set-scarlet-and-violet-energy/fire-energy';

describe('ShuffleDeckPrompt validation', () => {
  let state: State;
  beforeEach(() => {
    state = new State();
    const player = new Player();
    player.id = 1;
    player.deck.cards = Array.from({ length: 12 }, () => new FireEnergy());
    state.players = [player];
  });

  it('accepts valid permutations with indexes of 10 and higher', () => {
    const prompt = new ShuffleDeckPrompt(1);
    expect(prompt.validate(Array.from({ length: 12 }, (_, i) => i), state)).toBe(true);
    expect(prompt.validate(Array.from({ length: 12 }, (_, i) => 11 - i), state)).toBe(true);
  });

  it('rejects duplicate, missing and invalid indexes', () => {
    const prompt = new ShuffleDeckPrompt(1);
    expect(prompt.validate([0, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], state)).toBe(false);
    expect(prompt.validate([0, 1, 2], state)).toBe(false);
    expect(prompt.validate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12], state)).toBe(false);
    expect(prompt.validate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11.5], state)).toBe(false);
    expect(prompt.validate(null, state)).toBe(false);
  });
});
