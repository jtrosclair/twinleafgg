import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { CardList } from '../../game/store/state/card-list';
import { Store } from '../../game/store/store';
import { AttackEffect, RetreatStartEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpikyEnergy } from '../set-journey-together/spiky-energy';
import { Gwynn } from '../set-pitch-black/gwynn';
import { Yanmegaex } from '../set-destined-rivals/yanmega-ex';
import { JumboIce } from '../set-phantasmal-flames/jumbo-ice';
import { DoubleTurboEnergy } from '../set-brilliant-stars/double-turbo-energy';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { TempleofSinnoh } from '../set-astral-radiance/temple-of-sinnoh';

class TestPokemon extends PokemonCard {
  public name = 'Test Pokemon'; public fullName = 'Test Pokemon TST'; public set = 'TST'; public hp = 500;
  public retreat = [CardType.WATER];
  public attacks = [{ name: 'Test', cost: [], damage: 20, text: '' }];
}
function battle() {
  const state = new State(), player = new Player(), opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2; state.phase = GamePhase.ATTACK;
  player.active.cards = [new TestPokemon()]; opponent.active.cards = [new TestPokemon()];
  for (const p of state.players) p.prizes = Array.from({ length: 6 }, () => { const x = new CardList(); x.cards = [new TestPokemon()]; return x; });
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, store, player, opponent };
}
function bench(): PokemonCardList { const result = new PokemonCardList(); result.cards = [new TestPokemon()]; return result; }

describe('November 2026 compatible upstream card and engine fixes', () => {
  it('does not retaliate for a zero-damage attack, but does after damage', () => {
    const { state, store, player, opponent } = battle();
    opponent.active.cards.push(new SpikyEnergy());
    const base = new AttackEffect(player, opponent, player.active.getPokemonCard()!.attacks[0]);
    store.reduceEffect(state, new DealDamageEffect(base, 0));
    expect(player.active.damage).toBe(0);
    store.reduceEffect(state, new DealDamageEffect(base, 10));
    expect(player.active.damage).toBe(20);
  });
  it('lets Gwynn discard one eligible Pokemon and draw three cards', () => {
    const { state, store, player } = battle();
    state.phase = GamePhase.PLAYER_TURN;
    const gwynn = new Gwynn(), choice = new TestPokemon();
    player.hand.cards = [gwynn, choice];
    player.deck.cards = [new WaterEnergy(), new WaterEnergy(), new WaterEnergy(), new WaterEnergy()];
    store.reduceEffect(state, new TrainerEffect(player, gwynn));
    const prompt: any = state.prompts.find(p => p.result === undefined);
    expect(prompt).toBeDefined();
    const selected = prompt.decode([0]);
    expect(prompt.validate(selected)).toBe(true);
    (store as any).reducePrompt(state, new ResolvePromptAction(prompt.id, selected));
    expect(player.discard.cards).toContain(choice);
    expect(player.hand.cards.length).toBe(3);
  });
  it('rejects Gwynn when the hand has no eligible Pokemon', () => {
    const { state, store, player } = battle();
    state.phase = GamePhase.PLAYER_TURN;
    const gwynn = new Gwynn();
    player.hand.cards = [gwynn, new WaterEnergy()];
    player.deck.cards = [new WaterEnergy(), new WaterEnergy(), new WaterEnergy()];
    expect(() => store.reduceEffect(state, new TrainerEffect(player, gwynn))).toThrow();
    expect(player.deck.cards.length).toBe(3);
    expect(player.hand.cards).toContain(gwynn);
  });
  it('requires bench selection after retreat energy has been paid', () => {
    const { state, store, player } = battle();
    state.phase = GamePhase.PLAYER_TURN;
    const energy = new WaterEnergy(); player.active.cards.push(energy); player.bench = [bench()];
    store.reduceEffect(state, new RetreatStartEffect(player));
    const prompt: any = state.prompts.find(p => p.result === undefined);
    expect(player.discard.cards).toContain(energy);
    expect(prompt).toBeDefined();
    expect(prompt.validate(null, state)).toBe(false);
    const selected = prompt.decode([{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }], state);
    expect(prompt.validate(selected, state)).toBe(true);
    const expected = player.bench[0].getPokemonCard();
    (store as any).reducePrompt(state, new ResolvePromptAction(prompt.id, selected));
    expect(player.active.getPokemonCard()).toBe(expected);
  });
  it('does not prompt to move Energy to a non-existent bench', () => {
    const { state, store, player, opponent } = battle();
    const yanmega = new Yanmegaex(); player.active.cards = [yanmega, new WaterEnergy(), new WaterEnergy()]; player.bench = [];
    yanmega.reduceEffect(store, state, new AttackEffect(player, opponent, yanmega.attacks[0]));
    expect(state.prompts.filter(p => p.result === undefined).length).toBe(0);
  });
  it('requires only the available Energy when less than three can be moved', () => {
    const { state, store, player, opponent } = battle();
    const yanmega = new Yanmegaex(); player.active.cards = [yanmega, new WaterEnergy(), new WaterEnergy()]; player.bench = [bench()];
    yanmega.reduceEffect(store, state, new AttackEffect(player, opponent, yanmega.attacks[0]));
    const prompt: any = state.prompts.find(p => p.result === undefined);
    expect(prompt).toBeDefined(); expect(prompt.options.min).toBe(2); expect(prompt.options.max).toBe(2);
    const to = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
    const selected = prompt.decode([{ to, index: 1 }, { to, index: 2 }], state);
    expect(prompt.validate(selected)).toBe(true);
    (store as any).reducePrompt(state, new ResolvePromptAction(prompt.id, selected));
    expect(player.bench[0].energies.cards.length).toBe(2);
    expect(player.active.energies.cards.length).toBe(0);
  });
  it('counts Energy provided by Double Turbo and respects Temple of Sinnoh', () => {
    const { state, store, player } = battle();
    const ice = new JumboIce(), turbo = new DoubleTurboEnergy(), basic = new WaterEnergy();
    player.active.cards.push(turbo, basic); player.active.damage = 100;
    expect(ice.canPlay(store, state, player)).toBe(true);
    player.stadium.cards = [new TempleofSinnoh()];
    expect(ice.canPlay(store, state, player)).toBe(false);
    player.stadium.cards = [];
    player.supporter.cards = [ice];
    ice.reduceEffect(store, state, new TrainerEffect(player, ice));
    expect(player.active.damage).toBe(20);
    expect(player.discard.cards).toContain(ice);
  });
});
