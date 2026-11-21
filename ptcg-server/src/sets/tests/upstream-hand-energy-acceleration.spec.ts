import { ensureClientCards } from '../../client/cards';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { BoardEffect } from '../../game/store/card/card-types';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { GengarMimikyuGX } from '../set-team-up/gengar-and-mimikyu-gx';
import { padDeck, setupGame, SetupGameConfig } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
const board = { ...active, slot: SlotType.BOARD };
const fire = 'Fire Energy SVE';
const grass = 'Grass Energy SVE';
const psychic = 'Psychic Energy SVE';
const water = 'Water Energy SVE';
const goodra = 'Goodra FST 197';
const welder = 'Welder UNB';
const gardenia = "Gardenia's Vigor ASR";
const hydrapple = 'Hydrapple ex SCR';
const skiploom = 'Skiploom EVS';
const teal = 'Teal Mask Ogerpon ex TWM';
const calyrex = 'Shadow Rider Calyrex VMAX CRE';
const xatu = 'Xatu PAR';
const finneon = 'Finneon MT';
const mew = 'Mew ex MEW';

describe('Draw and heal effects from successful hand Energy attachments', () => {
  beforeAll(ensureClientCards);
  let store: Store;
  afterEach(() => store?.cleanup());

  function open(player1: SetupGameConfig['player1'], player2: SetupGameConfig['player2'] = { active: { card: finneon } }) {
    const game = setupGame({ turn: 5, player1: { deck: padDeck(8), ...player1 },
      player2: { deck: padDeck(8), ...player2 } });
    store = new Store({ onStateChange: () => undefined });
    store.state = game.state;
    game.store.cleanup();
    return game;
  }

  function pending() {
    return store.state.prompts.find(prompt => prompt.result === undefined);
  }

  function resolve(raw: unknown) {
    const prompt = pending();
    if (!prompt) throw new Error('Missing pending prompt');
    const result = prompt.decode(raw, store.state);
    if (!prompt.validate(result, store.state)) throw new Error('Invalid test prompt result');
    store.dispatch(new ResolvePromptAction(prompt.id, result));
  }

  function attach(...recipients: CardTarget[]) {
    expect(pending() instanceof AttachEnergyPrompt).toBe(true);
    resolve(recipients.map((to, index) => ({ to, index })));
  }

  for (const [flips, expectedAttachments] of [
    [[0.9, 0.9], 0], [[0.1, 0.9], 1], [[0.9, 0.1], 1], [[0.1, 0.1], 2],
  ] as const) {
    it(`finishes both Slimy Room flips before Welder draws for ${expectedAttachments} successful attachments (${flips.join(', ')})`, () => {
      const { player1 } = open({ active: { card: finneon }, hand: [welder, fire, fire] }, { active: { card: goodra } });
      spyOn(Math, 'random').and.returnValues(...flips);
      const [supporter, first, second] = player1.hand.cards;
      const topThree = player1.deck.cards.slice(0, 3);
      store.dispatch(new PlayCardAction(player1.id, 0, board));
      attach(active, active);
      expect(player1.deck.cards.length).toBe(8);
      expect(pending()?.type).toBe('WaitPrompt');
      resolve(true);
      expect(player1.deck.cards.length).toBe(8);
      expect(player1.active.energies.cards.length).toBe(0);
      expect(pending()?.type).toBe('WaitPrompt');
      resolve(true);
      expect(player1.active.energies.cards).toEqual([first, second].filter((_, index) => flips[index] === 0.1));
      expect(player1.hand.cards).toEqual(expectedAttachments > 0 ? topThree : []);
      expect(player1.discard.cards).toContain(supporter);
      expect(player1.supporter.cards).toEqual([]);
      expect(player1.energyPlayedTurn).not.toBe(5);
      expect(pending()).toBeUndefined();
    });
  }

  it('draws with Welder before Solar Evolution and only prompts after attaching the full group', () => {
    const { player1 } = open({ active: { card: skiploom }, hand: [welder, fire, fire] });
    const topThree = player1.deck.cards.slice(0, 3);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    attach(active, active);
    expect(player1.hand.cards).toEqual(topThree);
    expect(player1.active.energies.cards.length).toBe(2);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(false);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(false);
    expect(pending()).toBeUndefined();
  });

  it('draws the available cards with Welder and leaves the normal Energy attachment available', () => {
    const { player1 } = open({ active: { card: finneon }, hand: [welder, fire], deck: [grass] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    attach(active);
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([grass]);
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([fire, grass]);
  });

  it('allows Gardenia to draw with an empty Bench and skips an impossible attachment', () => {
    const { player1 } = open({ active: { card: finneon }, hand: [gardenia], deck: [grass, fire] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([grass, fire]);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([gardenia]);
    expect(pending()).toBeUndefined();
  });

  it('allows Gardenia to draw with no Grass Energy in hand, then attach Energy just drawn', () => {
    const { player1 } = open({ active: { card: finneon }, bench: [{ card: skiploom }],
      hand: [gardenia], deck: [grass, grass, fire] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    attach(bench, bench);
    expect(player1.bench[0].energies.cards.map(card => card.fullName)).toEqual([grass, grass]);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(false);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(false);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([gardenia]);
    expect(pending()).toBeUndefined();
  });

  it('allows Gardenia to select zero Energy even after drawing eligible Energy', () => {
    const { player1 } = open({ active: { card: finneon }, bench: [{ card: skiploom }], hand: [gardenia], deck: [grass] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    attach();
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([grass]);
    expect(player1.bench[0].energies.cards).toEqual([]);
    expect(pending()).toBeUndefined();
  });

  it('rejects Gardenia when the deck is empty', () => {
    const { player1 } = open({ active: { card: finneon }, bench: [{ card: skiploom }], hand: [gardenia, grass], deck: [] });
    expect(() => store.dispatch(new PlayCardAction(player1.id, 0, board))).toThrow();
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([gardenia, grass]);
  });

  for (const [holder, power, basic, recipient, drawCount, heal] of [
    [teal, 'Teal Dance', grass, teal, 1, 0],
    [xatu, 'Clairvoyant Sense', psychic, skiploom, 2, 0],
    [calyrex, 'Underworld Door', psychic, mew, 2, 0],
    [hydrapple, 'Ripening Charge', grass, skiploom, 0, 30],
  ] as const) {
    for (const heads of [false, true]) {
      it(`${power} grants its follow-up only if Slimy Room allows the attachment (${heads ? 'heads' : 'tails'})`, () => {
        const { player1 } = open({ active: { card: holder, damage: 40 },
          bench: [{ card: recipient, damage: 40 }], hand: [basic, basic] }, { active: { card: goodra } });
        spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
        const [energy] = player1.hand.cards;
        const selectedSlot = holder === teal ? player1.active : player1.bench[0];
        store.dispatch(new UseAbilityAction(player1.id, power, active));
        if (holder === teal) resolve([0]);
        else attach(bench);
        expect(pending()?.type).toBe('WaitPrompt');
        expect(player1.deck.cards.length).toBe(8);
        expect(selectedSlot.damage).toBe(40);
        resolve(true);
        expect(player1.deck.cards.length).toBe(8 - (heads ? drawCount : 0));
        expect(selectedSlot.damage).toBe(40 - (heads ? heal : 0));
        expect(selectedSlot.energies.cards.includes(energy)).toBe(heads);
        expect(player1.discard.cards.includes(energy)).toBe(!heads);
        if (heads && recipient === skiploom) resolve(false);
        expect(pending()).toBeUndefined();
        expect(() => store.dispatch(new UseAbilityAction(player1.id, power, active))).toThrow();
      });
    }
  }

  it('can cancel Ripening Charge without consuming the once-per-turn Ability', () => {
    const { player1 } = open({ active: { card: hydrapple }, hand: [grass] });
    store.dispatch(new UseAbilityAction(player1.id, 'Ripening Charge', active));
    resolve(null);
    expect(player1.active.boardEffect).not.toContain(BoardEffect.ABILITY_USED);
    store.dispatch(new UseAbilityAction(player1.id, 'Ripening Charge', active));
    attach(active);
    expect(player1.active.energies.cards.length).toBe(1);
  });

  it('Underworld Door allows a Psychic Bench target with an empty deck and blocks a non-Psychic target and Special Energy', () => {
    const { player1 } = open({ active: { card: calyrex }, bench: [{ card: finneon }, { card: mew }],
      hand: [psychic, 'Horror Psychic Energy RCL'], deck: [] });
    store.dispatch(new UseAbilityAction(player1.id, 'Underworld Door', active));
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt.options.blockedTo).toEqual([bench]);
    expect(prompt.isEligibleCard(player1.hand.cards[1])).toBe(false);
    attach({ ...bench, index: 1 });
    expect(player1.bench[1].energies.cards.map(card => card.fullName)).toEqual([psychic]);
  });

  it('rejects Underworld Door if the Bench has no Psychic Pokémon', () => {
    const { player1 } = open({ active: { card: calyrex }, bench: [{ card: finneon }], hand: [psychic] });
    expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Underworld Door', active))).toThrow();
    expect(pending()).toBeUndefined();
  });

  it('Splash Maker hits first and heals the Active Pokémon only for successfully attached cards', () => {
    const { player1, player2 } = open({
      active: { card: 'Blastoise & Piplup-GX CEC', energy: [water, water, water], damage: 100 },
      hand: [water, water],
    }, { active: { card: goodra } });
    store.dispatch(new AttackAction(player1.id, 'Splash Maker'));
    expect((pending() as WaitPrompt)?.message).toBe('Attack animation');
    resolve(true);
    expect(player2.active.damage).toBe(150);
    spyOn(Math, 'random').and.returnValues(0.1, 0.9);
    attach(active, active);
    resolve(true);
    expect(player1.active.damage).toBe(100);
    resolve(true);
    expect(player1.active.damage).toBe(50);
    expect(player1.active.energies.cards.length).toBe(4);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(water);
  });

  it('Splash Maker still deals damage when Horror House-GX prevents all hand attachments', () => {
    const { player1, player2 } = open({
      active: { card: 'Blastoise & Piplup-GX CEC', energy: [water, water, water], damage: 100 },
      hand: [water],
    }, { active: { card: 'Gengar & Mimikyu-GX TEU' } });
    const blocker = player2.active.getPokemonCard() as GengarMimikyuGX;
    player1.marker.addMarker(blocker.CANNOT_PLAY_CARDS_FROM_HAND_MARKER, blocker);

    store.dispatch(new AttackAction(player1.id, 'Splash Maker'));
    resolve(true);

    expect(player2.active.damage).toBe(150);
    expect(pending() instanceof AttachEnergyPrompt).toBe(false);
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([water]);
    expect(player1.active.damage).toBe(100);
  });

  it('Jungle Rising omits blocked recipients and can still attach to another Pokémon', () => {
    const { player1 } = open({ active: { card: 'Zarude V VIV', energy: [grass, grass] },
      bench: [{ card: hydrapple, damage: 100 }, { card: mew, damage: 90 }], hand: [grass] },
    { active: { card: goodra } });
    player1.bench[0].energyAttachBlockedFromHandNextTurn = true;
    store.dispatch(new AttackAction(player1.id, 'Jungle Rising'));
    resolve(true);
    expect((pending() as AttachEnergyPrompt).options.blockedTo).toEqual([bench]);

    spyOn(Math, 'random').and.returnValue(0.1);
    attach({ ...bench, index: 1 });
    resolve(true);
    expect(player1.bench.slice(0, 2).map(slot => slot.damage)).toEqual([100, 0]);
  });

  it('Jungle Rising heals only the Bench recipient whose Energy was attached', () => {
    const { player1, player2 } = open({ active: { card: 'Zarude V VIV', energy: [grass, grass] },
      bench: [{ card: hydrapple, damage: 100 }, { card: mew, damage: 90 }], hand: [grass, grass] },
    { active: { card: goodra } });
    store.dispatch(new AttackAction(player1.id, 'Jungle Rising'));
    expect((pending() as WaitPrompt)?.message).toBe('Attack animation');
    resolve(true);
    expect(player2.active.damage).toBe(100);
    spyOn(Math, 'random').and.returnValues(0.9, 0.1);
    attach(bench, { ...bench, index: 1 });
    resolve(true);
    resolve(true);
    expect(player1.bench.map(slot => slot.damage).slice(0, 2)).toEqual([100, 0]);
    expect(player1.bench.slice(0, 2).map(slot => slot.energies.cards.length)).toEqual([0, 1]);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(grass);
  });
});
