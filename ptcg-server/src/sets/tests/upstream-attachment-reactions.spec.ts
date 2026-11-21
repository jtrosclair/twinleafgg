import { ensureClientCards } from '../../client/cards';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { GameMessage } from '../../game/game-message';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { padDeck, setupGame, SetupGameConfig } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const opposingBench = { ...bench, player: PlayerType.TOP_PLAYER };
const finneon = 'Finneon MT';
const grass = 'Grass Energy SVE';
const water = 'Water Energy SVE';
const jet = 'Jet Energy PAL';
const warp = 'Warp Energy SLG';
const rainbow = 'Rainbow Energy SUM';
const minun = 'Minun PAR';
const plusle = 'Plusle PAR';
const minior = 'Minior PAR';
const tingLu = 'Ting-Lu ex PAL';
const venusaur = 'Venusaur & Snivy-GX CEC';
const buddy = 'Buddy Pulse';
const meteor = 'Far-Flying Meteor';
const vine = 'Shining Vine';

describe('official hand Energy attachment reactions', () => {
  beforeAll(ensureClientCards);
  let store: Store;
  afterEach(() => store?.cleanup());

  function open(player1: SetupGameConfig['player1'], player2: SetupGameConfig['player2']) {
    const game = setupGame({ turn: 5,
      player1: { deck: padDeck(8), ...player1 },
      player2: { deck: padDeck(8), ...player2 },
    });
    store = new Store({ onStateChange: () => undefined });
    store.state = game.state;
    game.store.cleanup();
    return { owner: game.player1, foe: game.player2 };
  }

  function attach(to = active) {
    store.dispatch(new PlayCardAction(store.state.players[store.state.activePlayer].id, 0, to));
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

  function resolveAnimation() {
    if (pending() instanceof WaitPrompt) resolve(true);
  }

  function chooseReaction(label: string, playerId: number) {
    const prompt = pending() as SelectPrompt;
    expect(prompt instanceof SelectPrompt).toBe(true);
    expect(prompt?.message).toBe(GameMessage.CHOOSE_ENERGY_ATTACHMENT_EFFECT);
    expect(prompt?.playerId).toBe(playerId);
    expect(prompt?.values).toContain(label);
    resolve(prompt.values.indexOf(label));
  }

  it('uses the owner’s Active Plusle and applies Buddy Pulse only once across two Minun', () => {
    const { owner } = open({ active: { card: finneon }, hand: [grass] },
      { active: { card: plusle }, bench: [{ card: minun }, { card: minun }] });
    attach();
    expect(owner.active.energies.cards.length).toBe(1);
    expect(owner.active.damage).toBe(20);
    expect(pending()).toBeUndefined();
  });

  it('ignores Plusle on the attaching player’s side', () => {
    const { owner } = open({ active: { card: finneon }, bench: [{ card: plusle }], hand: [grass] },
      { active: { card: minun } });
    attach();
    expect(owner.active.damage).toBe(0);
  });

  it('can use another Minun when Cursed Land blocks the first one', () => {
    const { owner } = open({ active: { card: tingLu }, hand: [grass] },
      { active: { card: minun, damage: 10 }, bench: [{ card: minun }, { card: plusle }] });
    attach();
    expect(owner.active.damage).toBe(20);
  });

  it('does not apply Buddy Pulse on an attachment to the other side', () => {
    const { owner, foe } = open({ active: { card: finneon }, hand: [grass] },
      { active: { card: minun }, bench: [{ card: plusle }] });
    store.reduceEffect(store.state, new AttachEnergyEffect(owner, owner.hand.cards[0] as EnergyCard, foe.active));
    expect(foe.active.energies.cards.length).toBe(1);
    expect(foe.active.damage).toBe(0);
  });

  it('routes Buddy Pulse through Hide n Sneak', () => {
    const { owner } = open({ active: { card: 'Banette M5' }, hand: [grass] },
      { active: { card: minun }, bench: [{ card: plusle }] });
    attach();
    expect(owner.active.energies.cards.length).toBe(1);
    expect(owner.active.damage).toBe(0);
  });

  it('does not trigger Buddy Pulse or Minior when Slimy Room rejects the Energy', () => {
    const { owner } = open({ active: { card: finneon }, bench: [{ card: minior }], hand: [grass] },
      { active: { card: 'Goodra FST 197' }, bench: [{ card: minun }, { card: plusle }] });
    spyOn(Math, 'random').and.returnValue(0.9);
    attach(bench);
    expect(owner.bench[0].energies.cards).toEqual([]);
    expect(owner.bench[0].damage).toBe(0);
    resolve(true);
    expect(owner.bench[0].energies.cards).toEqual([]);
    expect(owner.bench[0].damage).toBe(0);
    expect(pending()).toBeUndefined();
  });

  for (const origin of ['deck', 'discard'] as const) {
    it(`does not trigger either Ability on an attachment from the ${origin}`, () => {
      const { owner } = open({ active: { card: finneon }, bench: [{ card: minior }], [origin]: [grass] },
        { active: { card: minun }, bench: [{ card: plusle }] });
      const target = owner.bench[0];
      store.reduceEffect(store.state, new AttachEnergyEffect(owner, owner[origin].cards[0] as EnergyCard, target, origin));
      expect(target.energies.cards.length).toBe(1);
      expect(target.damage).toBe(0);
      expect(pending()).toBeUndefined();
    });
  }

  it('allows Far-Flying Meteor before Buddy Pulse even with Ting-Lu ex Active', () => {
    const { owner } = open({ active: { card: finneon }, bench: [{ card: minior }], hand: [grass] },
      { active: { card: tingLu }, bench: [{ card: minun }, { card: plusle }] });
    const target = owner.bench[0];
    attach(bench);
    expect(target.energies.cards.length).toBe(1);
    expect(target.damage).toBe(0);
    chooseReaction(meteor, owner.id);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    expect(owner.active).toBe(target);
    expect(owner.active.damage).toBe(20);
    expect(pending()).toBeUndefined();
  });

  it('lets Buddy Pulse resolve first and disables Far-Flying Meteor under Cursed Land', () => {
    const { owner } = open({ active: { card: finneon }, bench: [{ card: minior }], hand: [grass] },
      { active: { card: tingLu }, bench: [{ card: minun }, { card: plusle }] });
    attach(bench);
    chooseReaction(buddy, owner.id);
    expect(owner.active.getPokemonCard()?.fullName).toBe(finneon);
    expect(owner.bench[0].damage).toBe(20);
    expect(pending()).toBeUndefined();
  });

  for (const [tools, expected] of [[[], 80], [['Air Balloon SSH'], 40]] as const) {
    it(`Gravitational Tackle deals ${expected} using the opponent's current Retreat Cost`, () => {
      const { owner, foe } = open({ active: { card: minior, energy: [grass] } },
        { active: { card: tingLu, tools: [...tools] } });
      store.dispatch(new AttackAction(owner.id, 'Gravitational Tackle'));
      resolveAnimation();
      expect(foe.active.damage).toBe(expected);
    });
  }

  it('does not offer Far-Flying Meteor from the Active Spot', () => {
    const { owner } = open({ active: { card: minior }, hand: [grass] }, { active: { card: finneon } });
    attach();
    expect(owner.active.energies.cards.length).toBe(1);
    expect(pending()).toBeUndefined();
  });

  it('does not offer Far-Flying Meteor when an opponent’s turn effect attaches Energy', () => {
    const { owner } = open({ active: { card: finneon }, bench: [{ card: minior }], hand: [grass] },
      { active: { card: finneon } });
    store.state.activePlayer = 1;
    const target = owner.bench[0];
    store.reduceEffect(store.state, new AttachEnergyEffect(owner, owner.hand.cards[0] as EnergyCard, target));
    expect(target.energies.cards.length).toBe(1);
    expect(pending()).toBeUndefined();
  });

  it('does not activate Warp Energy after a Benched Minior moves Active', () => {
    const { owner } = open({ active: { card: finneon }, bench: [{ card: minior }], hand: [warp] },
      { active: { card: finneon } });
    attach(bench);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    expect(owner.active.getPokemonCard()?.fullName).toBe(minior);
    expect(pending()).toBeUndefined();
  });

  it('can switch with Jet Energy first and end the Far-Flying Meteor choice', () => {
    const { owner } = open({ active: { card: finneon }, bench: [{ card: minior }], hand: [jet] },
      { active: { card: finneon } });
    attach(bench);
    chooseReaction('Jet Energy', owner.id);
    expect(owner.active.getPokemonCard()?.fullName).toBe(minior);
    expect(pending()).toBeUndefined();
  });

  it('Cursed Land suppresses only damaged opposing Pokémon in play without the ex exception', () => {
    const { owner, foe } = open({ active: { card: minior }, bench: [{ card: 'Gengar ex TEF', damage: 10 }, { card: minior, damage: 10 }],
      hand: [minior] }, { active: { card: tingLu }, bench: [{ card: minior, damage: 10 }] });
    const cases = [
      [owner, owner.active.getPokemonCard()!, false],
      [owner, owner.bench[0].getPokemonCard()!, false],
      [owner, owner.bench[1].getPokemonCard()!, true],
      [foe, foe.bench[0].getPokemonCard()!, false],
    ] as const;
    for (const [player, pokemon, blocked] of cases) {
      expect(IS_ABILITY_BLOCKED(store, store.state, player, pokemon)).toBe(blocked);
      const effect = new CheckPokemonPowersEffect(player, pokemon);
      store.reduceEffect(store.state, effect);
      expect(effect.powers.length === 0).toBe(blocked);
    }
  });

  for (const targets of [[bench, bench], [active, bench]]) {
    it(`resolves Tropical Frenzy’s two Energy attachments to ${targets[0] === bench ? 'the same' : 'different'} Pokémon`, () => {
      const { owner, foe } = open({
        active: { card: 'Alolan Exeggutor ex SSP', energy: [grass, water] },
        bench: [{ card: finneon }],
        hand: [grass, water, jet],
      }, { active: { card: tingLu }, bench: [{ card: minun }, { card: plusle }] });
      store.dispatch(new AttackAction(owner.id, 'Tropical Fever'));
      resolveAnimation();
      expect(foe.active.damage).toBe(150);
      expect(pending() instanceof AttachEnergyPrompt).toBe(true);
      resolve(targets.map((to, index) => ({ to, index })));
      expect(owner.active.damage).toBe(targets[0] === active ? 20 : 0);
      expect(owner.bench[0].damage).toBe(targets[0] === active ? 20 : 40);
      expect(owner.hand.cards.map(card => card.fullName)).toEqual([jet]);
    });
  }

  it('can use Shining Vine for multiple Grass attachments in a turn', () => {
    const { owner, foe } = open({ active: { card: venusaur }, hand: [grass, grass] },
      { active: { card: finneon }, bench: [{ card: minior }] });
    for (const expectedActive of [minior, finneon]) {
      store.reduceEffect(store.state, new AttachEnergyEffect(owner, owner.hand.cards[0] as EnergyCard, owner.active));
      expect(pending() instanceof ConfirmPrompt).toBe(true);
      resolve(true);
      expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
      resolve([opposingBench]);
      expect(foe.active.getPokemonCard()?.fullName).toBe(expectedActive);
    }
  });

  for (const first of [vine, 'Rainbow Energy']) {
    it(`resolves ${first} first when Rainbow Energy and Shining Vine coincide under Shadow Box`, () => {
      const mimikyu = 'Mimikyu CEC 97';
      const { owner, foe } = open({ active: { card: venusaur }, hand: [rainbow] },
        { active: { card: mimikyu }, bench: [{ card: minior }] });
      attach();
      expect(owner.active.damage).toBe(0);
      chooseReaction(first, owner.id);
      if (first === vine) {
        resolve(true);
        resolve([opposingBench]);
      }
      expect(owner.active.damage).toBe(10);
      expect(foe.active.getPokemonCard()?.fullName).toBe(first === vine ? minior : mimikyu);
      expect(pending()).toBeUndefined();
    });
  }

  it('does not use Shining Vine for a non-Grass Energy', () => {
    const { owner } = open({ active: { card: venusaur }, hand: [water] },
      { active: { card: finneon }, bench: [{ card: minior }] });
    attach();
    expect(owner.active.energies.cards.length).toBe(1);
    expect(pending()).toBeUndefined();
  });
});
