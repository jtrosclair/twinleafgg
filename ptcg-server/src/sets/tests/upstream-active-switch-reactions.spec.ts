import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { AttackAction, RetreatAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ReorderBenchAction } from '../../game/store/actions/reorder-actions';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const stadium = 'Spikemuth DAA';
const basic = 'Squirtle MEW';
const replacement = 'Hoppip EVS';
const moon = 'Lunatone OBF';
const sun = 'Solrock PGO';
const dugtrio = "Team Rocket's Dugtrio ASC";
const boss = "Boss's Orders PAL";
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const opposingBench = { ...bench, player: PlayerType.TOP_PLAYER };
const board = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function start(own: Partial<PlayerConfig> = {}, opposing: Partial<PlayerConfig> = {}, includeStadium = true) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: basic }, bench: [{ card: replacement }], deck: padDeck(12), ...own },
    player2: { active: { card: 'Regigigas ASR' }, bench: [{ card: replacement }], deck: padDeck(12), ...opposing },
  });
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  const card = CardManager.getInstance().getCardByName(stadium)!;
  if (includeStadium) game.player2.stadium.cards = [card];
  store.restoreState(game.state);
  return game;
}

function choose(target = bench) {
  let prompt = store.state.prompts.find(item => item.result === undefined);
  while (prompt instanceof WaitPrompt) {
    store.dispatch(new ResolvePromptAction(prompt.id, true));
    prompt = store.state.prompts.find(item => item.result === undefined);
  }
  if (!(prompt instanceof ChoosePokemonPrompt)) throw new Error('Expected a Pokémon choice');
  const result = prompt.decode([target], store.state);
  if (!prompt.validate(result, store.state)) throw new Error('Invalid Pokémon choice');
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}

function playTrainer(target = bench) {
  store.dispatch(new PlayCardAction(store.state.players[store.state.activePlayer].id, 0, board));
  choose(target);
}

describe('Spikemuth reacts to a completed in-turn Active-to-Bench switch', () => {
  for (const trainer of ['Switch BS', 'Switch SSH', 'Switch SVI']) {
    it(`places two counters on the former Active with ${trainer}`, () => {
      const { player1 } = start({ hand: [trainer] });
      playTrainer();
      expect(player1.active.getPokemonCard()?.fullName).toBe(replacement);
      expect(player1.active.damage).toBe(0);
      expect(player1.bench[0].getPokemonCard()?.fullName).toBe(basic);
      expect(player1.bench[0].damage).toBe(20);
    });
  }

  it('triggers on retreat even when it is the first action from a restored board', () => {
    const { player1 } = start({ active: { card: basic, energy: ['Water Energy SVE'] } });
    store.dispatch(new RetreatAction(player1.id, 0));
    expect(player1.bench[0].damage).toBe(20);
  });

  it('triggers on the other player’s own turn', () => {
    const { player2 } = start({}, { hand: ['Switch SSH'] });
    store.state.activePlayer = 1;
    playTrainer();
    expect(player2.bench[0].damage).toBe(20);
  });

  it('does not trigger when Boss’s Orders moves the other player’s Active', () => {
    const { player2 } = start({ hand: [boss] });
    const formerActive = player2.active;
    playTrainer(opposingBench);
    expect(player2.bench[0]).toBe(formerActive);
    expect(formerActive.damage).toBe(0);
  });

  it('fires through Total Freedom when the replacement is on the Bench', () => {
    const { player1 } = start({ bench: [{ card: 'Decidueye ex OBF' }] });
    store.dispatch(new UseAbilityAction(player1.id, 'Total Freedom', bench));
    expect(player1.active.getPokemonCard()?.fullName).toBe('Decidueye ex OBF');
    expect(player1.bench[0].damage).toBe(20);
  });

  it('fires after Smash Turn deals attack damage', () => {
    const { player1, player2 } = start({
      active: { card: 'Golisopod DAA', energy: ['Grass Energy SVE', 'Grass Energy SVE', 'Grass Energy SVE'] },
    });
    store.dispatch(new AttackAction(player1.id, 'Smash Turn'));
    choose();
    expect(player2.active.damage).toBe(70);
    expect(player1.bench[0].damage).toBe(20);
  });

  for (const trainer of ['Switch Cart ASR', 'Switch Raft DRM', 'Olympia GEN']) {
    it(`lets ${trainer} finish healing before placing counters`, () => {
      const { player1 } = start({ active: { card: basic, damage: 10 }, hand: [trainer] });
      playTrainer();
      expect(player1.bench[0].damage).toBe(20);
    });
  }

  it('is blocked by New Moon for a Pokémon moving on Lunatone’s side', () => {
    const { player1 } = start({ hand: ['Switch SSH'], bench: [{ card: moon }, { card: sun }] });
    playTrainer();
    expect(player1.bench[0].damage).toBe(0);
  });

  it('still triggers against the side without New Moon', () => {
    const { player1 } = start({ hand: ['Switch SSH'] }, { bench: [{ card: moon }, { card: sun }] });
    playTrainer();
    expect(player1.bench[0].damage).toBe(20);
  });

  it('counts each real switch when a Pokémon returns to Active and switches out again', () => {
    const { player1 } = start({ hand: ['Switch SSH', 'Switch SSH', 'Switch SSH'] });
    const first = player1.active;
    const second = player1.bench[0];
    playTrainer();
    playTrainer();
    playTrainer();
    expect(first.damage).toBe(40);
    expect(second.damage).toBe(20);
  });

  it('does not apply again on a read-only HP query', () => {
    const { player1 } = start({ hand: ['Switch SSH'] });
    playTrainer();
    store.reduceEffect(store.state, new CheckHpEffect(player1, player1.bench[0]));
    expect(player1.bench[0].damage).toBe(20);
  });

  it('Knocks Out the former Active when the Stadium counters reach its HP', () => {
    const { player1 } = start({ active: { card: basic, damage: 40 }, hand: ['Switch SSH'] });
    const formerActive = player1.active.getPokemonCard();
    playTrainer();
    expect(player1.discard.cards).toContain(formerActive!);
    expect(player1.active.getPokemonCard()?.fullName).toBe(replacement);
  });

  it('does not apply from the hand', () => {
    const { player1 } = start({ hand: ['Switch SSH', stadium] }, {}, false);
    playTrainer();
    expect(player1.bench[0].damage).toBe(0);
  });

  it('does not apply during Pokémon Checkup', () => {
    const { player1 } = start();
    store.state.phase = GamePhase.BETWEEN_TURNS;
    player1.switchPokemon(player1.bench[0], store, store.state);
    expect(player1.bench[0].damage).toBe(0);
  });

  it('does not trigger merely from reordering the Bench', () => {
    const { player1 } = start({ bench: [{ card: replacement }, { card: sun }] });
    const oldActive = player1.active;
    store.dispatch(new ReorderBenchAction(player1.id, 1, 0));
    expect(player1.active).toBe(oldActive);
    expect(player1.bench.map(slot => slot.damage)).toEqual([0, 0, 0, 0, 0]);
  });
});

describe('movement reactions on legacy switch callers', () => {
  it('allows Holes to react to Switch SSH and adds Spikemuth separately', () => {
    const { player1 } = start({ hand: ['Switch SSH'] }, { bench: [{ card: dugtrio }] });
    playTrainer();
    expect(player1.bench[0].damage).toBe(40);
  });

  it('stacks Holes for two separate Dugtrio', () => {
    const { player1 } = start({ hand: ['Switch SSH'] }, { bench: [{ card: dugtrio }, { card: dugtrio }] }, false);
    playTrainer();
    expect(player1.bench[0].damage).toBe(40);
  });

  it('blocks Holes with Hide n Sneak while Spikemuth still applies', () => {
    const { player1 } = start({ hand: ['Switch SVI'], active: { card: 'Banette M5' } }, { bench: [{ card: dugtrio }] });
    playTrainer();
    expect(player1.bench[0].damage).toBe(20);
  });

  it('lets Lustrous Body block Holes on an existing movement-event path', () => {
    const { player1 } = start(
      { hand: ['Switch SVI'], active: { card: 'Corviknight VMAX BST' } },
      { bench: [{ card: dugtrio }] },
    );
    playTrainer();
    expect(player1.bench[0].damage).toBe(20);
  });

  it('blocks Holes with Battle Cage because its target is already on the Bench', () => {
    const { player1, player2 } = start(
      { hand: ['Switch SSH'] }, { bench: [{ card: dugtrio }] }, false,
    );
    player2.stadium.cards = [CardManager.getInstance().getCardByName('Battle Colosseum M2')!];
    playTrainer();
    expect(player1.bench[0].damage).toBe(0);
  });

  it('does not apply Holes during Pokémon Checkup', () => {
    const { player1 } = start({}, { bench: [{ card: dugtrio }] }, false);
    store.state.phase = GamePhase.BETWEEN_TURNS;
    player1.switchPokemon(player1.bench[0], store, store.state);
    expect(player1.bench[0].damage).toBe(0);
  });

  it('does not apply Spikemuth when promoting into a vacant Active Spot', () => {
    const { player1 } = start();
    player1.active.cards = [];
    player1.switchPokemon(player1.bench[0], store, store.state);
    expect(player1.active.getPokemonCard()?.fullName).toBe(replacement);
    expect(player1.active.damage).toBe(0);
  });
});
