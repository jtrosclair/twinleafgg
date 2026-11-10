import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardList } from '../../game/store/state/card-list';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { RetreatStartEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { EscapeBoard } from '../set-ultra-prism/escape-board';

class TestPokemon extends PokemonCard {
  public name = 'Test Pokemon'; public fullName = 'Test Pokemon TST'; public set = 'TST'; public hp = 500;
  public retreat = [CardType.COLORLESS];
  public attacks = [{ name: 'Test', cost: [], damage: 20, text: '' }];
}
class ToolBlocker extends TestPokemon {
  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof ToolEffect) throw new Error('Tool is blocked');
    return state;
  }
}
function battle(withTool: boolean, blocked = false) {
  const state = new State(), player = new Player(), opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 3; state.phase = GamePhase.PLAYER_TURN;
  player.active.cards = [new TestPokemon()];
  const board = new EscapeBoard();
  if (withTool) { player.active.cards.push(board); player.active.tools.push(board); }
  const slot = new PokemonCardList(); slot.cards = [new TestPokemon()]; player.bench = [slot];
  opponent.active.cards = [blocked ? new ToolBlocker() : new TestPokemon()];
  for (const p of state.players) p.prizes = Array.from({ length: 6 }, () => { const x = new CardList(); x.cards = [new TestPokemon()]; return x; });
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, store };
}

describe('Escape Board retreat through special conditions', () => {
  for (const condition of [SpecialCondition.ASLEEP, SpecialCondition.PARALYZED]) {
    it(`allows a Pokémon with Escape Board to retreat when ${condition}`, () => {
      const { state, player, store } = battle(true);
      const original = player.active.getPokemonCard(); const replacement = player.bench[0].getPokemonCard();
      player.active.specialConditions = [condition];
      expect(() => store.reduceEffect(state, new RetreatStartEffect(player))).not.toThrow();
      const prompt: any = state.prompts.find(p => p.result === undefined);
      expect(prompt).toBeDefined();
      if (!prompt) return;
      const selected = prompt.decode([{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }], state);
      (store as any).reducePrompt(state, new ResolvePromptAction(prompt.id, selected));
      expect(player.active.getPokemonCard()).toBe(replacement);
      expect(player.bench[0].getPokemonCard()).toBe(original);
      expect(player.active.specialConditions.length).toBe(0);
    });
    it(`does not allow retreat when ${condition} without an active tool`, () => {
      const { state, player, store } = battle(false);
      player.active.specialConditions = [condition];
      expect(() => store.reduceEffect(state, new RetreatStartEffect(player))).toThrow();
      expect(player.active.specialConditions).toContain(condition);
    });
    it(`does not bypass ${condition} when tools are blocked`, () => {
      const { state, player, store } = battle(true, true);
      player.active.specialConditions = [condition];
      expect(() => store.reduceEffect(state, new RetreatStartEffect(player))).toThrow();
      expect(player.active.specialConditions).toContain(condition);
    });
  }
  it('does not clear status when a direct retreat cannot be completed', () => {
    const { state, player, store } = battle(true);
    player.active.specialConditions = [SpecialCondition.ASLEEP];
    player.retreatedTurn = state.turn;
    expect(() => store.reduceEffect(state, new RetreatEffect(player, 0))).toThrow();
    expect(player.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });
});
