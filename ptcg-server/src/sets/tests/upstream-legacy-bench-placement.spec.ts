import { ensureClientCards } from '../../client/cards';
import { GameMessage } from '../../game/game-message';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { checkBenchSize } from '../../game/store/effect-reducers/check-effect';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Player } from '../../game/store/state/player';
import { Store } from '../../game/store/store';
import { playTrainerCard, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const benchTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const fire = 'Fire Energy SVE';
const water = 'Water Energy SVE';
const dark = 'Poochyena ASC';
const grass = 'Hoppip EVS';
const ruins = 'Risky Ruins MEG';
const eternatus = 'Eternatus VMAX DAA';
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function start(left: Partial<PlayerConfig>, right: Partial<PlayerConfig> = {}, stadium?: string) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: 'Regigigas ASR' }, ...left },
    player2: { active: { card: 'Regigigas ASR' }, deck: padDeck(10), ...right },
  });
  game.store.cleanup();
  if (stadium) {
    const card = getCardByName(stadium);
    card.id = 810;
    game.player1.stadium.cards = [card];
  }
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }

function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected an unresolved prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new Error('Test selected an illegal prompt result');
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}

function acknowledge() {
  while (pending() instanceof WaitPrompt || pending() instanceof ShowCardsPrompt) resolve(true);
}

function chooseCards() {
  acknowledge();
  const prompt = pending();
  if (!(prompt instanceof ChooseCardsPrompt)) throw new Error('Expected a card choice');
  expect(prompt.message).toBe(GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH);
  return prompt;
}

function choices(prompt: ChooseCardsPrompt, names: string[]) {
  return names.map(name => {
    const found = prompt.cards.cards.findIndex(card => card.fullName === name);
    if (found < 0) throw new Error('Missing card in prompt: ' + name);
    return found;
  });
}

function shuffle() {
  acknowledge();
  const prompt = pending();
  if (!(prompt instanceof ShuffleDeckPrompt)) throw new Error('Expected a shuffle');
  const player = store.state.players.find(player => player.id === prompt.playerId)!;
  resolve(player.deck.cards.map((_, index) => index));
}

function benchNames(player: Player) {
  return player.bench.flatMap(slot => slot.getPokemonCard()?.fullName ?? []);
}

describe('Legacy Bench placement and selection rules', () => {
  it('combines Gloria’s no-Rule-Box search rule with Eternal Zone', () => {
    const ruleBox = 'Darkrai V ASR';
    const { state, player1 } = start({
      active: { card: dark }, bench: [{ card: eternatus }],
      hand: ['Gloria BRS'], deck: [ruleBox, grass, dark, ...padDeck(4)],
    });
    playTrainerCard(store, state, 0, 'Gloria BRS');
    const prompt = chooseCards();
    for (const name of [ruleBox, grass]) expect(prompt.validate(prompt.decode(choices(prompt, [name])))).toBe(false);
    resolve(choices(prompt, [dark]));
    shuffle();
    expect(benchNames(player1)).toEqual([eternatus, dark]);
  });

  it('allows ordinary Basics and rejects Pokémon ex for Gloria without Eternal Zone', () => {
    const ex = 'Chien-Pao ex PAL';
    const { state, player1 } = start({ hand: ['Gloria BRS'], deck: [ex, grass, ...padDeck(4)] }, {}, ruins);
    playTrainerCard(store, state, 0, 'Gloria BRS');
    const prompt = chooseCards();
    expect(prompt.validate(prompt.decode(choices(prompt, [ex])))).toBe(false);
    resolve(choices(prompt, [grass]));
    shuffle();
    expect(player1.bench[0].damage).toBe(20);
  });

  it('keeps the name restriction of Follow My Tail and resolves the accepted Basic’s Stadium reaction', () => {
    const eevee = 'Eevee CEC 167';
    const { state, player1 } = start({ active: { card: eevee, energy: [water] }, deck: [grass, eevee, ...padDeck(5)] }, {}, ruins);
    useAttack(store, state, 0, 'Follow My Tail');
    const prompt = chooseCards();
    expect(prompt.validate(prompt.decode(choices(prompt, [grass])))).toBe(false);
    resolve(choices(prompt, [eevee]));
    shuffle();
    expect(benchNames(player1)).toEqual([eevee]);
    expect(player1.bench[0].damage).toBe(20);
  });

  it('applies Eternal Zone to the private cards inspected by a copied Massive Catch-GX', () => {
    const { state, player1 } = start({
      active: { card: 'Zoroark BLW', energy: ['Double Colorless Energy BS'] },
      bench: [{ card: eternatus }], deck: [dark, grass, ...padDeck(11)],
    }, { active: { card: 'Wishiwashi-GX CEC' } });
    useAttack(store, state, 0, 'Foul Play');
    acknowledge();
    expect(pending() instanceof ChooseAttackPrompt).toBe(true);
    resolve({ index: 0, attack: 'Massive Catch-GX' });
    const prompt = chooseCards();
    expect(prompt.cards.cards.length).toBe(12);
    expect(prompt.validate(prompt.decode(choices(prompt, [grass])))).toBe(false);
    resolve(choices(prompt, [dark]));
    shuffle();
    expect(benchNames(player1)).toEqual([eternatus, dark]);
    expect(player1.deck.cards.length).toBe(12);
  });

  it('puts a named Stage 1 Kakuna directly into play without triggering Risky Ruins', () => {
    const kakuna = 'Kakuna CIN';
    const { state, player1 } = start({ active: { card: kakuna, energy: ['Grass Energy SVE'] },
      deck: [grass, kakuna, ...padDeck(5)] }, {}, ruins);
    useAttack(store, state, 0, 'Multiply');
    const prompt = chooseCards();
    expect(prompt.validate(prompt.decode(choices(prompt, [grass])))).toBe(false);
    resolve(choices(prompt, [kakuna]));
    shuffle();
    expect(benchNames(player1)).toEqual([kakuna]);
    expect(player1.bench[0].damage).toBe(0);
  });

  it('lets Roll Call take one of each named Pokémon as a completed group', () => {
    const family = ['Poliwag BS', 'Poliwhirl BS', 'Poliwrath BS'];
    const differentPoliwag = 'Poliwag EVO';
    const { state, player1 } = start({ active: { card: 'Politoed GRI', energy: [water] },
      deck: [...family, differentPoliwag, ...padDeck(5)] }, {}, ruins);
    useAttack(store, state, 0, 'Roll Call');
    const prompt = chooseCards();
    expect(prompt.validate(prompt.decode(choices(prompt, [family[0], differentPoliwag])))).toBe(false);
    resolve(choices(prompt, family));
    shuffle();
    expect(benchNames(player1)).toEqual(family);
    expect(player1.bench.slice(0, 3).map(slot => slot.damage)).toEqual([20, 0, 0]);
  });

  it('still requires different printed types for Coax and completes both Basic placements', () => {
    const { state, player1 } = start({ active: { card: 'Shaymin UPR', energy: [water] },
      deck: [grass, 'Charmander MEW', 'Bulbasaur MEW', ...padDeck(5)] }, {}, ruins);
    useAttack(store, state, 0, 'Coax');
    const prompt = chooseCards();
    expect(prompt.validate(prompt.decode(choices(prompt, [grass, 'Bulbasaur MEW'])))).toBe(false);
    resolve(choices(prompt, [grass, 'Charmander MEW']));
    shuffle();
    expect(player1.bench.slice(0, 2).map(slot => slot.damage)).toEqual([20, 20]);
  });

  it('still permits Ninjask to place the Stage 1 Shedinja from the deck after evolving', () => {
    const shedinja = 'Shedinja DRX';
    const { state, player1 } = start({ active: { card: 'Nincada VIV' },
      hand: ['Ninjask DRX'], deck: [shedinja, grass, ...padDeck(5)] }, {}, ruins);
    store.dispatch(new PlayCardAction(player1.id, 0, { ...benchTarget, slot: SlotType.ACTIVE }));
    acknowledge();
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    const prompt = chooseCards();
    expect(prompt.validate(prompt.decode(choices(prompt, [grass])))).toBe(false);
    resolve(choices(prompt, [shedinja]));
    shuffle();
    expect(benchNames(player1)).toEqual([shedinja]);
    expect(player1.bench[0].damage).toBe(0);
  });

  it('requires a Water Pokémon for Bubble Pod and can attach only to the Pokémon it placed', () => {
    const dual = 'Volcanion EX STS';
    const other = 'Chien-Pao ex PAL';
    const { state, player1 } = start({ active: { card: 'Vaporeon VMAX EVS', energy: [water] },
      bench: [{ card: other }], discard: [grass, dual, water, fire] }, {}, ruins);
    useAttack(store, state, 0, 'Bubble Pod');
    const prompt = chooseCards();
    expect(prompt.validate(prompt.decode(choices(prompt, [grass])))).toBe(false);
    resolve(choices(prompt, [dual]));
    const attach = pending();
    if (!(attach instanceof AttachEnergyPrompt)) throw new Error('Expected Bubble Pod Energy selection');
    const index = player1.discard.cards.findIndex(card => card.fullName === water);
    expect(attach.validate(attach.decode([{ index, to: benchTarget }], state))).toBe(false);
    resolve([{ index, to: { ...benchTarget, index: 1 } }]);
    expect(benchNames(player1)).toEqual([other, dual]);
    expect(player1.bench[1].cards.some(card => card.fullName === water)).toBe(true);
    expect(player1.bench[1].damage).toBe(20);
  });

  it('applies Spirit Burner damage first and lets the player pick the later eligible card for one slot', () => {
    const prism = 'Victini Prism Star DRM';
    const first = 'Charmander MEW';
    const last = 'Incineroar UNB';
    const old = 'Lampent RCL';
    const { state, player1, player2 } = start({
      active: { card: 'Chandelure UNM', energy: [fire] },
      bench: Array.from({length: 4}, () => ({ card: dark })),
      discard: [old], deck: [first, prism, last, ...padDeck(4)],
    }, { active: { card: 'Raging Bolt ex TEF' } });
    useAttack(store, state, 0, 'Spirit Burner');
    const prompt = chooseCards();
    expect(player2.active.damage).toBe(190);
    expect(prompt.cards.cards.map(card => card.fullName)).toEqual([first, last]);
    expect(player1.lostzone.cards.some(card => card.fullName === prism)).toBe(true);
    resolve(choices(prompt, [last]));
    acknowledge();
    expect(benchNames(player1)).toEqual([dark, dark, dark, dark, last]);
    expect(player1.discard.cards.some(card => card.fullName === old)).toBe(true);
  });

  it('leaves an active Roadblock in force until Knock Outs', () => {
    const { state, player1, player2 } = start({
      active: { card: 'Chandelure UNM', energy: [fire] },
      bench: Array.from({length: 4}, () => ({ card: dark })),
      deck: ['Charmander MEW', ...padDeck(7)],
    }, { active: { card: 'Sudowoodo GRI', damage: 50 }, bench: [{ card: 'Regigigas ASR' }] });
    checkBenchSize(store, state);
    useAttack(store, state, 0, 'Spirit Burner');
    acknowledge();
    expect(pending() instanceof ChooseCardsPrompt).toBe(false);
    expect(benchNames(player1)).toEqual([dark, dark, dark, dark]);
    expect(player2.discard.cards.some(card => card.fullName === 'Sudowoodo GRI')).toBe(true);
  });

  it('blocks the non-Dark Fire Pokémon from a copied Spirit Burner even after it deals damage', () => {
    const { state, player1, player2 } = start({
      active: { card: 'Zoroark BLW', energy: ['Double Colorless Energy BS'] },
      bench: [{ card: eternatus }], deck: ['Charmander MEW', ...padDeck(7)],
    }, { active: { card: 'Chandelure UNM' } });
    useAttack(store, state, 0, 'Foul Play');
    acknowledge();
    expect(pending() instanceof ChooseAttackPrompt).toBe(true);
    resolve({ index: 0, attack: 'Spirit Burner' });
    acknowledge();
    expect(pending() instanceof ChooseCardsPrompt).toBe(false);
    expect(player2.active.damage).toBe(70);
    expect(benchNames(player1)).toEqual([eternatus]);
  });
});
