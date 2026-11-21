import { ensureClientCards } from '../../client/cards';
import { GameMessage } from '../../game/game-message';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AttachEnergyEffect, AttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, setupGame, SetupGameConfig } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const foeBench = { ...bench, player: PlayerType.TOP_PLAYER };
const finneon = 'Finneon MT';
const grass = 'Grass Energy SVE';
const water = 'Water Energy SVE';
const lightning = 'Lightning Energy SVE';
const fire = 'Fire Energy SVE';
const rainbow = 'Rainbow Energy SUM';
const magearna = 'Magearna JTG';
const shuckle = 'Shuckle HSP';
const sceptile = 'Sceptile AR';
const roserade = 'Roserade UL';
const skiploom = 'Skiploom EVS';
const jumpluff = 'Jumpluff EVS';
const arctozolt = 'Arctozolt DAA';
const ampharos = 'Ampharos DRX';
const genesect = 'Genesect EX PLB';
const plasma = 'Plasma Energy PLB';
const forretress = 'Forretress LA';

describe('Pokémon reactions to completed hand Energy attachments', () => {
  beforeAll(ensureClientCards);
  let store: Store;
  afterEach(() => store?.cleanup());

  function open(player1: SetupGameConfig['player1'], player2: SetupGameConfig['player2'] = { active: { card: finneon } }) {
    const game = setupGame({ turn: 5,
      player1: { deck: padDeck(8), ...player1 },
      player2: { deck: padDeck(8), ...player2 },
    });
    store = new Store({ onStateChange: () => undefined });
    store.state = game.state;
    game.store.cleanup();
    return { owner: game.player1, foe: game.player2 };
  }

  function pending() {
    return store.state.prompts.find(prompt => prompt.result === undefined);
  }

  function resolve(result: unknown) {
    const prompt = pending();
    if (!prompt) throw new Error('Missing pending prompt');
    const decoded = prompt.decode(result, store.state);
    if (!prompt.validate(decoded, store.state)) throw new Error('Invalid test prompt result');
    store.dispatch(new ResolvePromptAction(prompt.id, decoded));
  }

  function reaction(label: string, turnPlayer: number) {
    const prompt = pending() as SelectPrompt;
    expect(prompt instanceof SelectPrompt).toBe(true);
    expect(prompt?.message).toBe(GameMessage.CHOOSE_ENERGY_ATTACHMENT_EFFECT);
    expect(prompt?.playerId).toBe(turnPlayer);
    expect(prompt?.values).toContain(label);
    resolve(prompt.values.indexOf(label));
  }

  function chooseCard(name: string) {
    const prompt = pending() as ChooseCardsPrompt;
    expect(prompt instanceof ChooseCardsPrompt).toBe(true);
    const index = prompt.cards.cards.findIndex(card => card.fullName === name);
    expect(index).toBeGreaterThanOrEqual(0);
    resolve([index]);
  }

  function shuffle(length: number) {
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    resolve(Array.from({ length }, (_, index) => index));
  }

  for (const [holder, energy, healing, cures] of [
    ['Flareon SK', fire, 0, true],
    ['Combusken RS', fire, 0, true],
    ['Grovyle RS', grass, 0, true],
    ['Combusken DRM', water, 0, true],
    ['Wailord VIV', grass, 0, true],
    ['Wailord EX PRC', grass, 0, true],
    ['Arcanine ex LM', fire, 10, true],
    [sceptile, grass, 20, false],
    ['Magmortar SW', fire, 20, false],
    ['Roserade C SV', grass, 0, true],
    ['Regigigas LA2', grass, 0, true],
    ['Onix UL', grass, 10, false],
    ['Vespiquen E4 RR', grass, 10, false],
    ['Manaphy MD', water, 20, false],
    ["Sea's Manaphy PCGP 150", water, 10, true],
  ] as const) {
    for (const origin of ['hand', 'discard'] as const) {
      it(`${holder} honors the printed conditions for Energy from ${origin}`, () => {
        const { owner } = open({ active: { card: holder, damage: 30 }, [origin]: [energy] });
        owner.active.specialConditions = [SpecialCondition.POISONED];
        const card = owner[origin].cards[0] as EnergyCard;
        if (origin === 'hand') store.dispatch(new PlayCardAction(owner.id, 0, active));
        else store.reduceEffect(store.state, new AttachEnergyEffect(owner, card, owner.active, origin));
        expect(owner.active.energies.cards).toContain(card);
        expect(owner.active.damage).toBe(30 - (origin === 'hand' ? healing : 0));
        expect(owner.active.specialConditions).toEqual(origin === 'hand' && cures ? [] : [SpecialCondition.POISONED]);
      });
    }
  }

  it('activates Water Absorb on a damaged Sea’s Manaphy without a Special Condition', () => {
    const { owner } = open({ active: { card: "Sea's Manaphy PCGP 150", damage: 30 }, hand: [water] });
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.damage).toBe(20);
  });

  it('draws with Fermenting Liquid after an Energy attachment and never for a deck attachment', () => {
    const { owner } = open({ active: { card: shuckle }, hand: [grass], deck: [water, ...padDeck(7)] });
    store.reduceEffect(store.state, new AttachEnergyEffect(owner, owner.deck.cards[0] as EnergyCard, owner.active, 'deck'));
    expect(owner.hand.cards.map(card => card.fullName)).toEqual([grass]);
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.energies.cards.length).toBe(2);
    expect(owner.hand.cards.length).toBe(1);
  });

  for (const source of [magearna, 'Leafeon RR']) {
    it(`${source} only heals its own Pokémon after an attachment from hand`, () => {
      const { owner, foe } = open({ active: { card: source }, bench: [{ card: finneon, damage: 40 }],
        hand: [grass, grass], discard: [water] }, { active: { card: finneon, damage: 30 } });
      const target = owner.bench[0];
      store.reduceEffect(store.state, new AttachEnergyEffect(owner, owner.discard.cards[0] as EnergyCard, target, 'discard'));
      expect(target.damage).toBe(40);
      store.reduceEffect(store.state, new AttachEnergyEffect(owner, owner.hand.cards[0] as EnergyCard, foe.active));
      expect(foe.active.damage).toBe(30);
      store.dispatch(new PlayCardAction(owner.id, 0, bench));
      expect(target.damage).toBe(source === magearna ? 0 : 20);
    });
  }

  for (const [first, damage] of [['Green Breath', 10], ['Rainbow Energy', 0]] as const) {
    it(`applies Sceptile's official ruling when ${first} resolves first`, () => {
      const { owner } = open({ active: { card: sceptile }, hand: [rainbow] });
      store.dispatch(new PlayCardAction(owner.id, 0, active));
      expect(owner.active.damage).toBe(0);
      reaction(first, owner.id);
      expect(pending()).toBeUndefined();
      expect(owner.active.damage).toBe(damage);
    });
  }

  it('checks the Energy type the attached card actually provides under Temple of Sinnoh', () => {
    const { owner, foe } = open({ active: { card: sceptile, damage: 30 }, hand: [rainbow] });
    foe.stadium.cards.push(getCardByName('Temple of Sinnoh ASR'));
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.damage).toBe(30);
    expect(pending()).toBeUndefined();
  });

  it('lets Rainbow Energy apply both Energy Signal conditions using its actual attached types', () => {
    const { owner, foe } = open({ active: { card: roserade }, hand: [rainbow] });
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    reaction('Energy Signal', owner.id);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    expect(foe.active.specialConditions).toEqual([SpecialCondition.CONFUSED, SpecialCondition.POISONED]);
    expect(owner.active.damage).toBe(10);
  });

  it('uses one confirmation and Red Signal can resolve before Electromagnetic Wall', () => {
    const { owner, foe } = open({ active: { card: genesect }, hand: [plasma] },
      { active: { card: ampharos }, bench: [{ card: finneon }] });
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.energies.cards.length).toBe(1);
    reaction('Red Signal', owner.id);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    expect((pending() as ChoosePokemonPrompt)?.message).toBe(GameMessage.CHOOSE_POKEMON_TO_SWITCH);
    resolve([foeBench]);
    expect(foe.active.getPokemonCard()?.fullName).toBe(finneon);
    expect(owner.active.damage).toBe(30);
  });

  it('gives Arctozolt the typed counter protection check even when the recipient is evolved', () => {
    const { owner } = open({ active: { card: 'Banette M5' }, hand: [grass] },
      { active: { card: finneon }, bench: [{ card: arctozolt }] });
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.damage).toBe(0);
  });

  for (const [label, damage] of [['Solar Evolution', 0], ['Biting Whirlpool', 20]] as const) {
    it(`resolves the official Skiploom ruling with ${label} first`, () => {
      const { owner } = open({ active: { card: skiploom }, hand: [grass], deck: [jumpluff, ...padDeck(7)] },
        { active: { card: finneon }, bench: [{ card: arctozolt }] });
      store.dispatch(new PlayCardAction(owner.id, 0, active));
      expect(owner.active.damage).toBe(0);
      reaction(label, owner.id);
      expect(pending() instanceof ConfirmPrompt).toBe(true);
      resolve(true);
      chooseCard(jumpluff);
      shuffle(7);
      expect(owner.active.getPokemonCard()?.fullName).toBe(jumpluff);
      expect(owner.active.energies.cards.map(card => card.fullName)).toEqual([grass]);
      expect(owner.active.damage).toBe(damage);
    });
  }

  for (const [energy, label, damageWhenFirst, damageWhenSecond] of [
    [rainbow, 'Rainbow Energy', 40, 30],
    ['Medical Energy PAR', 'Medical Energy', 0, 30],
  ] as const) {
    for (const evolveFirst of [false, true]) {
      it(`resolves ${label} ${evolveFirst ? 'after' : 'before'} Solar Evolution per the official FAQ`, () => {
        const { owner } = open({ active: { card: skiploom, damage: 30 }, hand: [energy], deck: [jumpluff, ...padDeck(7)] });
        store.dispatch(new PlayCardAction(owner.id, 0, active));
        reaction(evolveFirst ? 'Solar Evolution' : label, owner.id);
        resolve(true);
        chooseCard(jumpluff);
        shuffle(7);
        expect(owner.active.getPokemonCard()?.fullName).toBe(jumpluff);
        expect(owner.active.damage).toBe(evolveFirst ? damageWhenSecond : damageWhenFirst);
      });
    }
  }

  for (const evolveFirst of [false, true]) {
    it(`leaves the evolved Jumpluff ${evolveFirst ? 'Benched' : 'Active'} when Jet Energy triggers with Solar Evolution`, () => {
      const { owner } = open({ active: { card: finneon }, bench: [{ card: skiploom }], hand: ['Jet Energy PAL'],
        deck: [jumpluff, ...padDeck(7)] });
      const recipient = owner.bench[0];
      store.dispatch(new PlayCardAction(owner.id, 0, bench));
      reaction(evolveFirst ? 'Solar Evolution' : 'Jet Energy', owner.id);
      resolve(true);
      chooseCard(jumpluff);
      shuffle(7);
      expect(recipient.getPokemonCard()?.fullName).toBe(jumpluff);
      expect(recipient === owner.active).toBe(!evolveFirst);
    });
  }

  it('still searches with Capture Energy after evolving its original recipient', () => {
    const { owner } = open({ active: { card: skiploom }, hand: ['Capture Energy RCL'], deck: [jumpluff, finneon, ...padDeck(6)] });
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    reaction('Solar Evolution', owner.id);
    resolve(true);
    chooseCard(jumpluff);
    shuffle(7);
    chooseCard(finneon);
    shuffle(6);
    expect(owner.active.getPokemonCard()?.fullName).toBe(jumpluff);
    expect(owner.bench[0].getPokemonCard()?.fullName).toBe(finneon);
  });

  it('does not offer Solar Evolution after Slimy Room discards the Energy', () => {
    const { owner } = open({ active: { card: skiploom }, hand: [grass], deck: [jumpluff, ...padDeck(7)] },
      { active: { card: 'Goodra FST 197' } });
    spyOn(Math, 'random').and.returnValue(0.9);
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    resolve(true);
    expect(pending()).toBeUndefined();
    expect(owner.active.energies.cards).toEqual([]);
    expect(owner.discard.cards.map(card => card.fullName)).toContain(grass);
  });

  it('uses both physically attached Energy cards before Solar Evolution changes the recipient', () => {
    const { owner } = open({ active: { card: skiploom }, hand: [grass, water], deck: [jumpluff, ...padDeck(7)] });
    const energy = owner.hand.cards.slice() as EnergyCard[];
    store.reduceEffect(store.state, new AttachEnergyFromHandEffect(owner,
      energy.map(card => new AttachEnergyEffect(owner, card, owner.active))));
    expect(owner.active.energies.cards).toEqual(energy);
    resolve(true);
    chooseCard(jumpluff);
    shuffle(7);
    expect(owner.active.getPokemonCard()?.fullName).toBe(jumpluff);
    expect(pending()).toBeUndefined();
  });

  it('offers optional Water Down for an attached Water Energy and benches the selected Goomy', () => {
    const goomy = 'Goomy AOR';
    const { owner } = open({ active: { card: goomy }, hand: [water], deck: [goomy, ...padDeck(7)] });
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.energies.cards.length).toBe(1);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    chooseCard(goomy);
    shuffle(7);
    expect(owner.bench[0].getPokemonCard()?.fullName).toBe(goomy);
  });

  it('triggers mandatory Iron Shell for a hand attachment and applies tails to both sides', () => {
    const { owner, foe } = open({ active: { card: forretress }, bench: [{ card: finneon }], hand: [grass] });
    spyOn(Math, 'random').and.returnValue(0.9);
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.energies.cards.length).toBe(1);
    expect((pending() as WaitPrompt)?.message).toBe('Coin flip animation');
    resolve(true);
    expect(owner.active.damage).toBe(0);
    expect(owner.bench[0].damage).toBe(20);
    expect(foe.active.damage).toBe(20);
  });

  it('omits Iron Shell for an attack attachment from hand', () => {
    const { owner } = open({ active: { card: forretress }, hand: [grass] });
    store.state.phase = GamePhase.ATTACK;
    store.reduceEffect(store.state, new AttachEnergyEffect(owner, owner.hand.cards[0] as EnergyCard, owner.active));
    expect(owner.active.energies.cards.length).toBe(1);
    expect(pending()).toBeUndefined();
  });

  it('offers Thunder Rumble once per turn and counts attached Lightning provision', () => {
    const { owner, foe } = open({ active: { card: 'Raikou SW' }, hand: [lightning, lightning] },
      { active: { card: finneon }, bench: [{ card: finneon }] });
    const attach = () => store.reduceEffect(store.state,
      new AttachEnergyEffect(owner, owner.hand.cards[0] as EnergyCard, owner.active));
    attach();
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    resolve([foeBench]);
    expect(foe.bench[0].damage).toBe(10);
    attach();
    expect(owner.active.energies.cards.length).toBe(2);
    expect(pending()).toBeUndefined();
  });
});
