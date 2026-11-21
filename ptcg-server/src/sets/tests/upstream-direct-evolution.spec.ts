import { ensureClientCards } from '../../client/cards';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AfterEvolveEffect, AttackEffect, EvolveEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { State } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame, SetupGameResult } from './test-helpers';

const water = 'Water Energy SVE';
const item = 'Nest Ball SVI';
const supporter = 'Boss\'s Orders RCL';
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const stadiums = [
  { name: 'Po Town BUS', base: 'Electrike VIV', evolution: 'Manectric VIV', damage: 10, after: 40 },
  { name: 'Galactic HQ PL', base: 'Electrike VIV', evolution: 'Manectric VIV', damage: 10, after: 30 },
  { name: 'Wyndon Stadium VIV', base: 'Pikachu V VIV', evolution: 'Pikachu VMAX VIV', damage: 140, after: 40 },
];
const abilities = [
  ['Gloom MEW', 'Oddish MEW'],
  ['Vileplume MEW', 'Gloom MEW'],
  ['Emboar CEC', 'Pignite CEC'],
  ['Hypno MEW', 'Drowzee BS'],
  ['Haunter MEW', 'Gastly MEW'],
  ['Herdier SUM', 'Lillipup SUM'],
];
const megas = [
  { name: 'M Charizard EX FLF', base: 'Charizard-EX FLF', tool: 'Charizard Spirit Link EVO' },
  { name: 'M Kangaskhan-EX FLF', base: 'Kangaskhan-EX FLF' },
  { name: 'M Rayquaza EX ROS', base: 'Rayquaza EX ROS', tool: 'Rayquaza Spirit Link ROS' },
];

function moveStadium(game: SetupGameResult, name: string) {
  const stadium = getCardByName(name);
  stadium.id = 9001;
  game.player1.stadium.cards.push(stadium);
}

function playEvolution(game: SetupGameResult) {
  const { store, player1 } = game;
  player1.canEvolve = true;
  player1.active.pokemonPlayedTurn = 1;
  store.dispatch(new PlayCardAction(player1.id, 0, ownActive));
}

describe('Printed evolution effects and timing', () => {
  beforeAll(ensureClientCards);
  let game: SetupGameResult | undefined;
  afterEach(() => game?.store.cleanup());

  for (const { name, base, evolution, damage, after } of stadiums) {
    for (const origin of ['hand', 'deck', 'discard', 'protected'] as const) {
      it(`${name} honors the evolution source and New Moon protection (${origin})`, () => {
        const fromHand = origin === 'hand' || origin === 'protected';
        game = setupGame({
          turn: 5,
          player1: {
            active: { card: base, damage },
            bench: origin === 'protected' ? [{ card: 'Lunatone OBF' }, { card: 'Solrock PGO' }] : [],
            hand: fromHand ? [evolution] : [],
            deck: [...(origin === 'deck' ? [evolution] : []), ...padDeck(10)],
            discard: origin === 'discard' ? [evolution] : [],
          },
          player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
        });
        moveStadium(game, name);
        const { player1, state, store } = game;
        const source = fromHand ? player1.hand : player1[origin as 'deck' | 'discard'];
        const card = source.cards[0] as PokemonCard;
        store.reduceEffect(state, new EvolveEffect(player1, player1.active, card, source));
        expect(player1.active.getPokemonCard()).toBe(card);
        expect(player1.active.damage).toBe(origin === 'hand' ? after : damage);
      });
    }
  }

  for (const [name, base] of abilities) {
    for (const source of ['hand', 'deck', 'discard'] as const) {
      it(`${name} offers its Ability after a completed hand evolution (${source})`, () => {
        game = setupGame({
          turn: 5,
          player1: {
            active: { card: base },
            hand: source === 'hand' ? [name] : [],
            deck: [...(source === 'deck' ? [name] : []), water, ...padDeck(10)],
            discard: [...(source === 'discard' ? [name] : []), item, item],
          },
          player2: { active: { card: 'Finneon MT' }, discard: [supporter], deck: padDeck(10) },
        });
        const { player1, player2, state, store } = game;
        const sourceList = player1[source];
        const card = sourceList.cards[0] as PokemonCard;
        const deck = player1.deck.cards.filter(candidate => candidate !== card);
        const offered: boolean[] = [];
        const prompt = store.prompt.bind(store);
        spyOn(store, 'prompt').and.callFake((...args: Parameters<typeof store.prompt>) => {
          offered.push(player1.active.getPokemonCard() === card);
          return prompt(...args);
        });

        store.reduceEffect(state, new EvolveEffect(player1, player1.active, card, sourceList));
        expect(player1.active.getPokemonCard()).toBe(card);
        expect(offered).toEqual(source === 'hand' ? [true] : []);
        expect(player1.deck.cards).toEqual(deck);
        expect(player2.active.specialConditions).not.toContain(SpecialCondition.ASLEEP);
      });
    }
  }

  for (const accept of [true, false]) {
    it(`Here for Hypnosis respects the player's decision (${accept})`, () => {
      game = setupGame({
        turn: 5,
        player1: { active: { card: 'Drowzee BS' }, hand: ['Hypno MEW'], deck: padDeck(10) },
        player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
      });
      const useAbility = jasmine.createSpy('Here for Hypnosis').and.returnValue(accept);
      game.overridePrompt('Confirm', useAbility);
      playEvolution(game);
      expect(useAbility).toHaveBeenCalledTimes(1);
      expect(game.player2.active.specialConditions.includes(SpecialCondition.ASLEEP)).toBe(accept);
    });
  }

  it('Treasure Hunt offers at most one Item', () => {
    game = setupGame({
      turn: 5, player1: { active: { card: 'Lillipup SUM' }, hand: ['Herdier SUM'], discard: [item, item], deck: padDeck(10) },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
    });
    const { player1, overridePrompt } = game;
    const selected = player1.discard.cards[1];
    overridePrompt('Choose cards', offered => {
      const prompt = offered as ChooseCardsPrompt;
      expect(prompt.options.max).toBe(1);
      return [prompt.cards.cards.indexOf(selected)];
    });
    playEvolution(game);
    expect(player1.hand.cards).toEqual([selected]);
    expect(player1.discard.cards.length).toBe(1);
  });

  for (const fromHand of [true, false]) {
    it(`Resonant Evolution sees another completed Eevee evolution from hand only (${fromHand})`, () => {
      game = setupGame({
        turn: 5,
        player1: {
          active: { card: 'Eevee VIV' },
          bench: [{ card: 'Eevee ASR 119' }, { card: 'Eevee ASR 119' }],
          hand: fromHand ? ['Vaporeon AOR'] : [],
          deck: [...(fromHand ? [] : ['Vaporeon AOR']), 'Vaporeon AOR', ...padDeck(10)],
        },
        player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
      });
      const { player1, state, store } = game;
      const source = fromHand ? player1.hand : player1.deck;
      const vaporeon = source.cards[0] as PokemonCard;
      const observations: boolean[] = [];
      const prompt = store.prompt.bind(store);
      spyOn(store, 'prompt').and.callFake((...args: Parameters<typeof store.prompt>) => {
        if (args[1] instanceof ConfirmPrompt) observations.push(player1.active.getPokemonCard() === vaporeon);
        return prompt(...args);
      });
      store.reduceEffect(state, new EvolveEffect(player1, player1.active, vaporeon, source));
      expect(observations).toEqual(fromHand ? [true, true] : []);
    });
  }

  it('Resonant Evolution commits its own deck evolution through the shared lifecycle', () => {
    game = setupGame({
      turn: 5, player1: {
        active: { card: 'Eevee VIV' }, bench: [{ card: 'Eevee ASR 119' }],
        hand: ['Vaporeon AOR'], deck: ['Vaporeon AOR', ...padDeck(10)],
      },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
    });
    const { store, player1, overridePrompt } = game;
    const evos: AfterEvolveEffect[] = [];
    const reduce = store.reduceEffect.bind(store);
    spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof AfterEvolveEffect) evos.push(effect);
      return reduce(state, effect);
    });
    const second = player1.deck.cards[0] as PokemonCard;
    overridePrompt('Choose cards', offered => [(offered as ChooseCardsPrompt).cards.cards.indexOf(second)]);
    playEvolution(game);
    expect(player1.bench[0].getPokemonCard()).toBe(second);
    expect(evos.map(effect => [effect.previousPokemonCard?.name, effect.playedFromHand])).toEqual([
      ['Eevee', true], ['Eevee', false],
    ]);
  });

  for (const source of ['hand', 'deck'] as const) {
    it(`Time Aura rejects only the opponent's Active hand evolution (${source})`, () => {
      game = setupGame({
        turn: 5, player1: {
          active: { card: 'Pikachu V VIV', damage: 140, energy: ['Regenerative Energy SIT'] },
          hand: source === 'hand' ? ['Pikachu VMAX VIV'] : [],
          deck: [...(source === 'deck' ? ['Pikachu VMAX VIV'] : []), ...padDeck(10)],
        },
        player2: { active: { card: 'Dialga PL2' }, deck: padDeck(10) },
      });
      moveStadium(game, 'Wyndon Stadium VIV');
      const { state, store, player1 } = game;
      const original = player1.active.getPokemonCard();
      const zone = player1[source];
      const card = zone.cards[0] as PokemonCard;
      const evolve = () => store.reduceEffect(state, new EvolveEffect(player1, player1.active, card, zone));
      if (source === 'hand') {
        expect(evolve).toThrow();
        expect(zone.cards).toContain(card);
        expect(player1.active.getPokemonCard()).toBe(original);
      } else {
        expect(evolve).not.toThrow();
        expect(player1.active.getPokemonCard()).toBe(card);
      }
      expect(player1.active.damage).toBe(140);
    });
  }

  for (const { name, base, tool } of megas) {
    for (const withLink of tool ? [false, true] : [false]) {
      it(`${name} ends the turn after entering play unless its Spirit Link is attached (${withLink})`, () => {
        game = setupGame({
          turn: 5,
          player1: { active: { card: base, tools: withLink ? [tool!] : [] }, bench: [{ card: 'Finneon MT' }],
            hand: [name], deck: padDeck(10) },
          player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
        });
        const { store, state, player1 } = game;
        const card = player1.hand.cards[0] as PokemonCard;
        const seen: boolean[] = [];
        const reduce = store.reduceEffect.bind(store);
        spyOn(store, 'reduceEffect').and.callFake((current: State, effect: Effect) => {
          if (effect instanceof EndTurnEffect && effect.player === player1) {
            seen.push(player1.active.getPokemonCard() === card);
          }
          return reduce(current, effect);
        });
        store.reduceEffect(state, new EvolveEffect(player1, player1.active, card));
        expect(player1.active.getPokemonCard()).toBe(card);
        expect(seen).toEqual(withLink ? [] : [true]);
      });
    }
  }

  it('Wild Blaze discards five cards from the attacker’s deck', () => {
    game = setupGame({
      turn: 5,
      player1: { active: { card: 'M Charizard EX FLF' }, deck: padDeck(10) },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
    });
    const { store, state, player1, player2 } = game;
    const discarded = player1.deck.cards.slice(0, 5);
    const opposing = player2.deck.cards.slice();
    const attack = player1.active.getPokemonCard()!.attacks[0];
    store.reduceEffect(state, new AttackEffect(player1, player2, attack));
    expect(player1.discard.cards).toEqual(discarded);
    expect(player2.deck.cards).toEqual(opposing);
  });

  it('Wham Bam Punch adds 30 for each heads before the first tails', () => {
    game = setupGame({
      turn: 5,
      player1: { active: { card: 'M Kangaskhan-EX FLF', energy: [water, water, water] }, deck: padDeck(10) },
      player2: { active: { card: 'Mewtwo EX NXD' }, deck: padDeck(10) },
    });
    const { store, player1, player2 } = game;
    const flips = [0.1, 0.1, 0.9];
    spyOn(Math, 'random').and.callFake(() => flips.shift() ?? 0.9);
    store.dispatch(new AttackAction(player1.id, 'Wham Bam Punch'));
    expect(player2.active.damage).toBe(160);
    expect(flips).toEqual([]);
  });

  for (const [base, damage] of [['Slakoth MT', 60], ['Ditto Prism Star LOT', 10]] as const) {
    it(`Wake-up Punch checks the actual Asleep predecessor (${base})`, () => {
      game = setupGame({
        turn: 5,
        player1: { active: { card: base, energy: [water, water] }, hand: ['Vigoroth MT'], deck: padDeck(10) },
        player2: { active: { card: 'Wobbuffet PHF' }, deck: padDeck(10) },
      });
      const { store, state, player1, player2 } = game;
      player1.active.specialConditions.push(SpecialCondition.ASLEEP);
      store.reduceEffect(state, new EvolveEffect(player1, player1.active, player1.hand.cards[0] as PokemonCard));
      store.dispatch(new AttackAction(player1.id, 'Wake-up Punch'));
      expect(player2.active.damage).toBe(damage);
    });
  }
});
