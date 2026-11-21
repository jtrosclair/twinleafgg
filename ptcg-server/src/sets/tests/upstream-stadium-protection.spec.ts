import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonStatsEffect, CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect, TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const boss = "Boss's Orders PAL";
const catcher = 'Pokemon Catcher SVI';
const badge = 'Moon & Sun Badge EVS';
const temple = 'Temple of Sinnoh ASR';
const court = 'Beach Court SVI';
const altar = 'Altar of the Sunne GRI';
const bog = 'Gapejaw Bog ASR';
const lake = 'Lake Acuity LOR';
const moon = 'Lunatone OBF';
const sun = 'Solrock PGO';
const luminous = 'Luminous Energy PAL';
const mist = 'Mist Energy TEF';
const water = 'Water Energy SVE';
const asset = 'Regigigas ASR';
const basic = 'Hoppip EVS';
const gas = 'Galarian Weezing SHF';
const enemyBench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const board = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function card(name: string) { return CardManager.getInstance().getCardByName(name)!; }

function start(own: Partial<PlayerConfig> = {}, opposing: Partial<PlayerConfig> = {}) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: asset }, hand: [boss], deck: padDeck(10), ...own },
    player2: { active: { card: asset }, deck: padDeck(10), ...opposing },
  });
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }
function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected a pending prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new Error(`Invalid result for ${prompt.type}`);
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}

function playTargetedTrainer(trainer = boss) {
  store.dispatch(new PlayCardAction(store.state.players[0].id, 0, board));
  if (trainer === catcher) resolve(true);
  expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
  resolve([enemyBench]);
  expect(pending()).toBeUndefined();
}

describe('Trainer target protection', () => {
  for (const protector of ['Pyroar FLI', 'Axew UNM', 'Fraxure SFA', 'Galvantula TEU', 'Cetitan ex DRI']) {
    it(`${protector} protects against opposing Items and Supporters while its Ability is active`, () => {
      for (const trainer of [boss, catcher]) {
        const { player2 } = start({ hand: [trainer] }, { bench: [{ card: protector }] });
        const oldActive = player2.active;
        playTargetedTrainer(trainer);
        expect(player2.active === oldActive).toBe(true);
        store.cleanup();
      }
      const { player2 } = start({ active: { card: gas } }, { bench: [{ card: protector }] });
      const target = player2.bench[0];
      playTargetedTrainer();
      expect(player2.active === target).toBe(true);
    });

    it(`${protector} allows an opposing Stadium and a Trainer from its owner`, () => {
      const { state, player1, player2 } = start({}, { bench: [{ card: protector }] });
      const target = player2.bench[0];
      const stadium = new TrainerTargetEffect(player1, card(temple) as TrainerCard, target);
      store.reduceEffect(state, stadium);
      expect(stadium.preventDefault).toBe(false);
      expect(stadium.target === target).toBe(true);
      const own = new TrainerTargetEffect(player2, card(boss) as TrainerCard, target);
      store.reduceEffect(state, own);
      expect(own.preventDefault).toBe(false);
      expect(own.target === target).toBe(true);
    });
  }

  it('Unnerve on a previous evolution stage no longer protects the evolved Pokémon', () => {
    const { player2 } = start({}, { bench: [{ card: 'Haxorus UNM' }] });
    const target = player2.bench[0];
    target.cards.unshift(card('Axew UNM'), card('Fraxure SFA'));
    playTargetedTrainer();
    expect(player2.active === target).toBe(true);
  });

  for (const protector of ['Electrike PRC', 'Regirock XYP', 'Primal Groudon-EX PRC']) {
    it(`${protector} has Ω Barrier through Ability lock and accepts its owner’s Trainer and Stadium effects`, () => {
      const { state, player1, player2 } = start({ active: { card: gas } }, { bench: [{ card: protector }] });
      const original = player2.active;
      const target = player2.bench[0];
      for (const query of [
        new TrainerTargetEffect(player2, card(boss) as TrainerCard, target),
        new TrainerTargetEffect(player1, card(temple) as TrainerCard, target),
      ]) {
        store.reduceEffect(state, query);
        expect(query.preventDefault).toBe(false);
        expect(query.target === target).toBe(true);
      }
      playTargetedTrainer();
      expect(player2.active === original).toBe(true);
    });
  }

  for (const [trainer, suppression, protectedTarget] of [[boss, false, true], [boss, true, false], [catcher, false, false]] as const) {
    it(`Blizzard Veil checks the Trainer category and Articuno's Ability (${trainer}, ${suppression})`, () => {
      const { player2 } = start({ active: { card: suppression ? 'Flutter Mane TEF' : asset }, hand: [trainer] }, {
        active: { card: 'Articuno TEU' }, bench: [{ card: 'Squirtle MEW' }],
      });
      const original = player2.active;
      const target = player2.bench[0];
      playTargetedTrainer(trainer);
      expect(player2.active === (protectedTarget ? original : target)).toBe(true);
    });
  }

  for (const suppress of [false, true]) {
    it(`Mysterious Buzz protects opposing Fairy Pokémon only when Ribombee's Ability works (${suppress})`, () => {
      const { player2 } = start({ active: { card: suppress ? gas : asset } }, {
        bench: [{ card: 'Cutiefly LOT' }, { card: 'Ribombee LOT' }],
      });
      const original = player2.active;
      const target = player2.bench[0];
      playTargetedTrainer();
      expect(player2.active === (suppress ? target : original)).toBe(true);
    });
  }

  for (const pokemon of ['Espeon V EVS', 'Umbreon VMAX EVS', 'Arceus VSTAR BRS']) {
    for (const suppress of [false, true]) {
      it(`Moon & Sun Badge checks ${pokemon} and Jamming Tower (${suppress})`, () => {
        const { player1, player2 } = start({}, { bench: [{ card: pokemon, tools: [badge] }] });
        if (suppress) player1.stadium.cards = [card('Jamming Tower TWM')];
        const original = player2.active;
        const target = player2.bench[0];
        playTargetedTrainer();
        expect(player2.active === (!suppress && pokemon !== 'Arceus VSTAR BRS' ? original : target)).toBe(true);
      });
    }
  }

  it('Bewitching Eyes bypasses Moon & Sun Badge while copying Boss’s Orders', () => {
    const { player1, player2 } = start({ active: { card: 'Sableye AOR', energy: ['Darkness Energy SVE'] }, hand: [] }, {
      discard: [boss], bench: [{ card: 'Espeon V EVS', tools: [badge] }],
    });
    const target = player2.bench[0];
    store.dispatch(new AttackAction(player1.id, 'Bewitching Eyes'));
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    resolve([0]);
    expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
    resolve([enemyBench]);
    while (pending() instanceof WaitPrompt) resolve(true);
    expect(player2.active === target).toBe(true);
  });
});

describe('New Moon and Stadium scope', () => {
  for (const activeNewMoon of [true, false]) {
    it(`Temple of Sinnoh applies to each side with New Moon ${activeNewMoon ? 'working' : 'suppressed'}`, () => {
      const { state, player1, player2 } = start({
        active: { card: activeNewMoon ? 'Axew UNM' : gas, energy: [luminous, mist] },
      }, {
        active: { card: 'Axew UNM', energy: [luminous, mist] }, bench: [{ card: moon }, { card: sun }],
      });
      player1.stadium.cards = [card(temple)];
      for (const owner of [player1, player2]) {
        const result = new CheckProvidedEnergyEffect(owner, owner.active);
        store.reduceEffect(state, result);
        expect(result.specialEnergiesProvideColorless).toBe(owner === player1 || !activeNewMoon);
        const energy = owner.active.energies.cards.find(attachment => attachment.fullName === mist) as EnergyCard;
        expect(IS_SPECIAL_ENERGY_BLOCKED(store, state, owner, energy, owner.active)).toBe(owner === player1 || !activeNewMoon);
      }
    });
  }

  it('New Moon preserves one all-type Energy from Luminous Energy while Temple suppresses the other side', () => {
    const { state, player1, player2 } = start({
      active: { card: 'Axew UNM', energy: [luminous] }, bench: [{ card: moon }, { card: sun }],
    }, { active: { card: 'Fraxure SFA', energy: [luminous] } });
    player2.stadium.cards = [card(temple)];
    for (const owner of [player1, player2]) {
      const result = new CheckProvidedEnergyEffect(owner, owner.active);
      store.reduceEffect(state, result);
      expect(result.energyMap.map(entry => entry.provides)).toEqual([[owner === player1 ? CardType.ANY : CardType.COLORLESS]]);
    }
  });

  for (const partner of [true, false]) {
    it(`Beach Court ${partner ? 'leaves' : 'reduces'} Lunatone’s Retreat Cost with Solrock ${partner ? 'present' : 'absent'}`, () => {
      const { state, player1 } = start({ active: { card: moon }, bench: partner ? [{ card: sun }] : [] });
      player1.stadium.cards = [card(court)];
      const cost = new CheckRetreatCostEffect(player1);
      store.reduceEffect(state, cost);
      expect(cost.cost).toEqual(partner ? [CardType.COLORLESS] : []);
    });

    it(`Altar of the Sunne respects New Moon on a Fire Pokémon (${partner})`, () => {
      const { state, player1, player2 } = start({}, {
        active: { card: 'Charmander PGO' }, bench: partner ? [{ card: moon }, { card: sun }] : [{ card: moon }],
      });
      player1.stadium.cards = [card(altar)];
      const stats = new CheckPokemonStatsEffect(player2.active);
      store.reduceEffect(state, stats);
      expect(stats.weakness.map(weakness => weakness.type)).toEqual(partner ? [CardType.WATER] : []);
    });
  }

  for (const [energy, protectedTarget, expected] of [[luminous, false, 20], [water, false, 20], [water, true, 40]] as const) {
    it(`Lake Acuity checks effective Energy and reduces after Weakness (${energy}, ${protectedTarget})`, () => {
      const { state, player1, player2 } = start({ active: { card: 'Squirtle MEW' } }, {
        active: { card: 'Charizard PGO', energy: [energy] }, bench: protectedTarget ? [{ card: moon }, { card: sun }] : [],
      });
      player1.stadium.cards = [card(lake)];
      const attack = new AttackEffect(player1, player2, player1.active.getPokemonCard()!.attacks[0]);
      store.reduceEffect(state, new PutDamageEffect(attack, 20));
      expect(player2.active.damage).toBe(expected);
    });
  }

  it('Lake Acuity does not reduce an attacker’s self-damage', () => {
    const { state, player1, player2 } = start({ active: { card: 'Squirtle MEW', energy: [water] } });
    player1.stadium.cards = [card(lake)];
    const attack = new AttackEffect(player1, player2, player1.active.getPokemonCard()!.attacks[0]);
    const damage = new PutDamageEffect(attack, 20);
    damage.target = player1.active;
    store.reduceEffect(state, damage);
    expect(player1.active.damage).toBe(20);
  });

  for (const [existing, played, expected] of [
    [[], basic, 20],
    [[moon, sun], basic, 0],
    [[sun], moon, 0],
    [[moon], sun, 0],
  ] as const) {
    it(`Gapejaw Bog waits for ${played} to enter play with ${existing.join(', ') || 'an empty Bench'}`, () => {
      const { player1, player2 } = start({ hand: [played], bench: existing.map(card => ({card})) });
      player2.stadium.cards = [card(bog)];
      const index = existing.length;
      store.dispatch(new PlayCardAction(player1.id, 0, { ...ownBench, index }));
      expect(player1.bench[index].getPokemonCard()?.fullName).toBe(played);
      expect(player1.bench[index].damage).toBe(expected);
    });
  }

  it('Nest Ball brings a Basic from the deck before Gapejaw Bog can affect it', () => {
    const { player1, player2 } = start({ hand: ['Nest Ball SVI'], deck: [basic] });
    player2.stadium.cards = [card(bog)];
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    resolve([0]);
    if (pending()) resolve([]);
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(basic);
    expect(player1.bench[0].damage).toBe(0);
  });

  it('Gapejaw Bog leaves a slot untouched if the Basic never enters from hand', () => {
    const { state, player1, player2 } = start();
    player2.stadium.cards = [card(bog)];
    const outOfHand = card(basic);
    if (!(outOfHand instanceof PokemonCard)) throw new Error('Expected a Pokémon');
    const target = player1.bench[0];
    store.reduceEffect(state, new PlayPokemonEffect(player1, outOfHand, target, SlotType.BENCH, 0));
    expect(target.cards.length).toBe(0);
    expect(target.damage).toBe(0);
  });
});
