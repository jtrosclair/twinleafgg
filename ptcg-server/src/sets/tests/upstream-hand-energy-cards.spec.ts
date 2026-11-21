import { ensureClientCards } from '../../client/cards';
import { GameMessage } from '../../game/game-message';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect, AttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, setupGame, SetupGameConfig } from './test-helpers';

const grass = 'Grass Energy SVE';
const water = 'Water Energy SVE';
const finneon = 'Finneon MT';
const bulbasaur = 'Bulbasaur BS';
const abra = 'Abra BS';
const pikachu = 'Pikachu BS';
const medical = 'Medical Energy PAR';
const rich = 'Rich Energy SSP';
const speed = 'Speed Lightning Energy RCL';
const telepath = 'Telepath [P] Energy M3';
const rainbow = 'Rainbow Energy SUM';
const dawn = 'Dawn Stadium MD';
const park = 'Pokémon Park P2';
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };

describe('successful hand Energy cards and Stadium reactions', () => {
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

  function resolve(raw: unknown) {
    const prompt = pending();
    if (!prompt) throw new Error('Missing pending prompt');
    const decoded = prompt.decode(raw, store.state);
    if (!prompt.validate(decoded, store.state)) throw new Error('Invalid test prompt result');
    store.dispatch(new ResolvePromptAction(prompt.id, decoded));
  }

  function chooseReaction(label: string, chooser: number) {
    const prompt = pending() as SelectPrompt;
    expect(prompt instanceof SelectPrompt).toBe(true);
    expect(prompt?.message).toBe(GameMessage.CHOOSE_ENERGY_ATTACHMENT_EFFECT);
    expect(prompt?.playerId).toBe(chooser);
    expect(prompt?.values).toContain(label);
    resolve(prompt.values.indexOf(label));
  }

  for (const [name, draw] of [[rich, 4], [speed, 2]] as const) {
    it(`${name} draws ${draw} after attachment from hand`, () => {
      const { owner } = open({ active: { card: pikachu }, hand: [name] });
      const energy = owner.hand.cards[0];
      store.dispatch(new PlayCardAction(owner.id, 0, active));
      expect(owner.active.cards).toContain(energy);
      expect(owner.hand.cards.length).toBe(draw);
      expect(owner.deck.cards.length).toBe(8 - draw);
    });

    for (const origin of ['deck', 'discard'] as const) {
      it(`${name} leaves the hand alone when attached from the ${origin}`, () => {
        const config: SetupGameConfig['player1'] = { active: { card: pikachu },
          deck: origin === 'deck' ? [name, ...padDeck(7)] : padDeck(8),
          discard: origin === 'discard' ? [name] : [] };
        const { owner } = open(config);
        const energy = owner[origin].cards[0] as EnergyCard;
        store.reduceEffect(store.state, new AttachEnergyEffect(owner, energy, owner.active, origin));
        expect(owner.active.cards).toContain(energy);
        expect(owner.hand.cards.length).toBe(0);
      });
    }
  }

  it('Speed Lightning Energy requires a Lightning recipient', () => {
    const { owner } = open({ active: { card: finneon }, hand: [speed] });
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.energies.cards.length).toBe(1);
    expect(owner.hand.cards.length).toBe(0);
  });

  it('does not draw when Slimy Room rejects Enriching Energy', () => {
    const { owner } = open({ active: { card: finneon }, hand: [rich] }, { active: { card: 'Goodra FST 197' } });
    const energy = owner.hand.cards[0];
    spyOn(Math, 'random').and.returnValue(0.9);
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    resolve(true);
    expect(owner.discard.cards).toContain(energy);
    expect(owner.active.energies.cards.length).toBe(0);
    expect(owner.hand.cards.length).toBe(0);
    expect(owner.deck.cards.length).toBe(8);
  });

  it('Temple of Sinnoh prevents the attached Enriching Energy’s draw effect', () => {
    const { owner, foe } = open({ active: { card: finneon }, hand: [rich] });
    foe.stadium.cards.push(getCardByName('Temple of Sinnoh ASR'));
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.energies.cards.length).toBe(1);
    expect(owner.hand.cards.length).toBe(0);
  });

  for (const [energy, healing] of [[medical, 30], ['Herbal Energy FFI', 30],
    ['Health Energy MD', 10], ['Potion Energy TR', 10]] as const) {
    for (const origin of ['hand', 'discard'] as const) {
      it(`${energy} attaches from ${origin} with the printed healing restriction`, () => {
        const { owner } = open({ active: { card: bulbasaur, damage: 40 }, [origin]: [energy] });
        const card = owner[origin].cards[0] as EnergyCard;
        if (origin === 'hand') store.dispatch(new PlayCardAction(owner.id, 0, active));
        else store.reduceEffect(store.state, new AttachEnergyEffect(owner, card, owner.active, origin));
        expect(owner.active.energies.cards).toContain(card);
        expect(owner.active.damage).toBe(40 - (origin === 'hand' ? healing : 0));
      });
    }
  }

  it('keeps Herbal Energy in hand when the target is not Grass', () => {
    open({ active: { card: finneon }, hand: ['Herbal Energy FFI'] });
    const player = store.state.players[0];
    expect(() => store.dispatch(new PlayCardAction(player.id, 0, active))).toThrow();
    expect(store.state.players[0].hand.cards.map(card => card.fullName)).toEqual(['Herbal Energy FFI']);
    expect(store.state.players[0].active.energies.cards).toEqual([]);
  });

  for (const [name, remaining, damage] of [
    ['Full Heal Energy TR', [SpecialCondition.BURNED], 20],
    ['Recover Energy MD', [], 20],
    ['Heal Energy DX', [], 10],
    ['Heal Energy P4', [], 10],
  ] as const) {
    it(`${name} applies only its printed recovery when attached from hand`, () => {
      const { owner } = open({ active: { card: finneon, damage: 20 }, hand: [name] });
      owner.active.specialConditions = [SpecialCondition.POISONED, SpecialCondition.BURNED];
      store.dispatch(new PlayCardAction(owner.id, 0, active));
      expect(owner.active.specialConditions).toEqual([...remaining]);
      expect(owner.active.damage).toBe(damage);
    });
  }

  it('does not heal a modern Pokémon ex with Heal Energy', () => {
    const { owner } = open({ active: { card: 'Ting-Lu ex PAL', damage: 20 }, hand: ['Heal Energy DX'] });
    owner.active.specialConditions = [SpecialCondition.POISONED];
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.specialConditions).toEqual([SpecialCondition.POISONED]);
    expect(owner.active.damage).toBe(20);
  });

  for (const [first, damage] of [[medical, 10], [rainbow, 0]] as const) {
    it(`lets the turn player resolve ${first} first across a two-Energy group`, () => {
      const { owner } = open({ active: { card: finneon }, hand: [medical, rainbow] });
      const cards = owner.hand.cards.slice() as EnergyCard[];
      store.reduceEffect(store.state, new AttachEnergyFromHandEffect(owner,
        cards.map(card => new AttachEnergyEffect(owner, card, owner.active))));
      expect(owner.active.energies.cards).toEqual(cards);
      expect(owner.active.damage).toBe(0);
      chooseReaction(first.split(' ').slice(0, 2).join(' '), owner.id);
      expect(owner.active.damage).toBe(damage);
      expect(pending()).toBeUndefined();
    });
  }

  it('attaches Telepath before the mandatory search and only benches eligible basics', () => {
    const { owner } = open({ active: { card: abra }, hand: [telepath], deck: [abra, water, 'Abra MEW', grass] });
    const energy = owner.hand.cards[0];
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    const prompt = pending() as ChooseCardsPrompt;
    expect(owner.active.cards).toContain(energy);
    expect(prompt instanceof ChooseCardsPrompt).toBe(true);
    expect(prompt.options.max).toBe(2);
    expect(prompt.validate(null)).toBe(false);
    resolve([abra, 'Abra MEW'].map(name => prompt.cards.cards.findIndex(card => card.fullName === name)));
    expect(owner.bench.slice(0, 2).map(slot => slot.getPokemonCard()?.fullName)).toEqual([abra, 'Abra MEW']);
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
  });

  it('searches and shuffles with zero matches when Telepath can see the deck', () => {
    const { owner } = open({ active: { card: abra }, hand: [telepath] });
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    resolve([]);
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
  });

  it('attaches Telepath from hand with a full Bench without exposing the deck', () => {
    const { owner } = open({ active: { card: abra }, bench: Array.from({ length: 5 }, () => ({ card: finneon })),
      hand: [telepath], deck: [abra, ...padDeck(7)] });
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.energies.cards.length).toBe(1);
    expect(pending()).toBeUndefined();
  });

  it('lets the opponent choose the replacement only after Cyclone is attached', () => {
    const { owner, foe } = open({ active: { card: finneon }, hand: ['Cyclone Energy PK'] },
      { active: { card: finneon }, bench: [{ card: bulbasaur }] });
    store.dispatch(new PlayCardAction(owner.id, 0, active));
    expect(owner.active.energies.cards.length).toBe(1);
    expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
    expect(pending()?.playerId).toBe(foe.id);
    resolve([bench]);
    expect(foe.active.getPokemonCard()?.fullName).toBe(bulbasaur);
  });

  it('does not switch the opponent when Cyclone attaches from the deck', () => {
    const { owner } = open({ active: { card: finneon }, deck: ['Cyclone Energy PK', water] },
      { active: { card: finneon }, bench: [{ card: bulbasaur }] });
    store.reduceEffect(store.state, new AttachEnergyEffect(owner, owner.deck.cards[0] as EnergyCard, owner.active, 'deck'));
    expect(owner.active.energies.cards.length).toBe(1);
    expect(pending()).toBeUndefined();
  });

  for (const [stadium, expectedDamage] of [[dawn, 20], ['Island Cave HL', 30]] as const) {
    it(`${stadium} only cures on a completed hand attachment`, () => {
      const { owner, foe } = open({ active: { card: finneon, damage: 30 }, hand: [grass], discard: [water] });
      owner.active.specialConditions = [SpecialCondition.POISONED];
      foe.stadium.cards.push(getCardByName(stadium));
      store.reduceEffect(store.state, new AttachEnergyEffect(owner, owner.discard.cards[0] as EnergyCard, owner.active, 'discard'));
      expect(owner.active.damage).toBe(30);
      expect(owner.active.specialConditions).toEqual([SpecialCondition.POISONED]);
      store.dispatch(new PlayCardAction(owner.id, 0, active));
      expect(owner.active.damage).toBe(expectedDamage);
      expect(owner.active.specialConditions).toEqual([]);
    });
  }

  it('Dawn Stadium removes one counter per physical card in a grouped hand attachment', () => {
    const { owner } = open({ active: { card: finneon, damage: 30 }, hand: [grass, water] });
    owner.stadium.cards.push(getCardByName(dawn));
    const cards = owner.hand.cards.slice() as EnergyCard[];
    store.reduceEffect(store.state, new AttachEnergyFromHandEffect(owner,
      cards.map(card => new AttachEnergyEffect(owner, card, owner.active))));
    expect(owner.active.damage).toBe(10);
    expect(pending()).toBeUndefined();
  });

  it('uses Pokémon Park only once each turn and does not spend it on the opponent’s turn', () => {
    const { owner, foe } = open({ active: { card: finneon }, bench: [{ card: finneon, damage: 30 }], hand: [grass, water, grass] },
      { active: { card: finneon }, bench: [{ card: finneon, damage: 20 }], hand: [grass] });
    owner.stadium.cards.push(getCardByName(park));
    const attach = (player: typeof owner) => store.reduceEffect(store.state,
      new AttachEnergyEffect(player, player.hand.cards[0] as EnergyCard, player.bench[0]));
    attach(foe);
    expect(foe.bench[0].damage).toBe(20);
    attach(owner);
    attach(owner);
    expect(owner.bench[0].damage).toBe(20);
    store.reduceEffect(store.state, new EndTurnEffect(owner));
    store.state.activePlayer = 1;
    foe.hand.cards.push(getCardByName(water));
    attach(foe);
    expect(foe.bench[0].damage).toBe(10);
  });
});
