import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AfterEvolveEffect, EffectOfAbilityEffect, EvolveEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { padDeck, setupGame, SetupGameResult } from './test-helpers';

const cards = [
  'Froslass AR',
  'Porygon-Z BUS',
  'Banette CES',
  'Florges CEC',
  'Luxray DP',
  'Rhyperior DP',
  'Charmeleon DRM',
  'Flareon ex DS',
  'Jolteon ex DS',
  'Persian DS',
  'Vaporeon ex DS',
  'Meganium DF',
  'Quagsire DF',
  'Flygon ex LM',
  'Azumarill TRR',
  'Espeon ex UF',
  'Typhlosion ex UF',
  'Umbreon ex UF',
  'Tyranitar FCO',
  'Abomasnow FLI',
  'Togekiss GE',
  'Blissey HS',
  'Charmeleon HIF',
  'Lycanroc-GX HIF SV67',
  'Ninjask LA',
  'Omastar MD',
  'Crobat MT',
  'Croconaw MT',
  'Walrein MT',
  'Salamence PLB',
  'Crawdaunt PRC',
  'Walrein RR',
  'Dragonite ROS',
  'Togekiss ROS 46',
  'Arcanine SW',
  'Empoleon SF',
  'Infernape SF',
  'Skuntank SF',
  'Torterra SF',
  'Tsareena SUM',
  'Ivysaur SV',
  'Magmortar SV',
  'Dark Dragonite TR',
  'Electrode TEU',
  'Lycanroc-GX TEU',
  'Porygon2 TM',
  'Abomasnow UPR',
  'Crobat UNB',
  'Gengar UNB',
  'Sharpedo UNB',
  'Weavile UD',
];

const manager = CardManager.getInstance();
const water = 'Water Energy SVE';
const fire = 'Fire Energy SVE';
const lightning = 'Lightning Energy SVE';
const tool = 'Air Balloon SSH';
const darkness = 'Darkness Energy SVE';
const shedinja = 'Shedinja LOT';
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };

function previousPrint(name: string): string {
  const evolution = manager.getCardByName(name);
  if (!(evolution instanceof PokemonCard)) throw new Error(`Missing evolution print ${name}`);
  const predecessor = manager.getAllCards().find(card => card instanceof PokemonCard
    && card.name === evolution.evolvesFrom && card.stage < evolution.stage);
  if (!predecessor) throw new Error(`Missing predecessor for ${name}`);
  return predecessor.fullName;
}

function fixture(name: string, zone: 'hand' | 'deck' | 'discard') {
  const base = { card: previousPrint(name), energy: [lightning], damage: 10 };
  const evolveOnBench = name === 'Arcanine SW';
  const game = setupGame({
    turn: 5,
    player1: {
      active: evolveOnBench ? { card: 'Finneon MT', damage: 10 } : base,
      bench: evolveOnBench ? [base] : [{ card: 'Bulbasaur BS' }],
      hand: [...(zone === 'hand' ? [name] : []), water, ...(name === 'Ninjask LA' ? [shedinja] : [])],
      deck: [...(zone === 'deck' ? [name] : []), fire, water, darkness, darkness, 'Path to the Peak CRE', ...padDeck(12)],
      discard: [...(zone === 'discard' ? [name] : []), 'Grass Energy SVE', water, darkness, tool, shedinja],
    },
    player2: {
      active: { card: 'Mewtwo EX NXD', energy: [water], tools: [tool] },
      bench: [{ card: 'Electrike VIV' }],
      hand: ['Manectric VIV', 'Finneon MT', water],
      deck: padDeck(12), discard: ['Finneon MT'],
    }
  });
  game.player2.prizes.slice(0, 2).forEach(prize => prize.moveTo(game.player2.discard));
  game.player2.hand.moveCardTo(game.player2.hand.cards[0], game.player2.bench[0]);
  return { game, target: evolveOnBench ? game.player1.bench[0] : game.player1.active };
}

function playFromHand(game: SetupGameResult, target = ownActive) {
  game.player1.canEvolve = true;
  const slot = target.slot === SlotType.ACTIVE ? game.player1.active : game.player1.bench[target.index];
  slot.pokemonPlayedTurn = 1;
  game.store.dispatch(new PlayCardAction(game.player1.id, 0, target));
}

describe('Printed legacy evolution triggers', () => {
  beforeAll(ensureClientCards);
  let game: SetupGameResult | undefined;
  afterEach(() => game?.store.cleanup());

  for (const name of cards) {
    for (const zone of ['hand', 'deck', 'discard'] as const) {
      it(`${name} uses the printed hand trigger (${zone})`, () => {
        const setup = fixture(name, zone);
        game = setup.game;
        const { state, player1, player2, store } = game;
        const source = player1[zone];
        const card = source.cards[0] as PokemonCard;
        const expectedDeck = player1.deck.cards.filter(other => other !== card).map(other => other.id);
        const expectedOpponentHand = player2.hand.cards.map(other => other.id);
        const observations: boolean[] = [];
        const prompt = store.prompt.bind(store);
        spyOn(store, 'prompt').and.callFake((...args: Parameters<typeof store.prompt>) => {
          observations.push(setup.target.getPokemonCard() === card && !source.cards.includes(card));
          return prompt(...args);
        });

        store.reduceEffect(state, new EvolveEffect(player1, setup.target, card, source));

        expect(setup.target.getPokemonCard()).toBe(card);
        if (zone === 'hand') {
          expect(observations).toEqual([true]);
        } else {
          expect(observations).toEqual([]);
          expect(player1.deck.cards.map(other => other.id)).toEqual(expectedDeck);
          expect(player2.hand.cards.map(other => other.id)).toEqual(expectedOpponentHand);
        }
      });
    }
  }

  for (const source of ['hand', 'deck'] as const) {
    it(`Sudden Scorching works after evolving from Salandit from ${source} under Ability suppression`, () => {
      game = setupGame({
        turn: 5,
        player1: {
          active: { card: 'Salandit SCR', energy: [water, water] },
          hand: source === 'hand' ? ['Salazzle SCR'] : [],
          deck: [...(source === 'deck' ? ['Salazzle SCR'] : []), ...padDeck(10)],
        },
        player2: { active: { card: 'Wobbuffet PHF' }, hand: [water, fire], deck: padDeck(10) },
      });
      const { store, state, player1, player2 } = game;
      const cards = player2.hand.cards.slice();
      const zone = player1[source];
      store.reduceEffect(state, new EvolveEffect(player1, player1.active, zone.cards[0] as PokemonCard, zone));
      store.dispatch(new AttackAction(player1.id, 'Sudden Scorching'));
      expect(player2.discard.cards).toEqual(cards);
      expect(player1.discard.cards).toEqual([]);
    });
  }

  it('Sudden Scorching discards one card when the previous Pokémon was Ditto', () => {
    game = setupGame({
      turn: 5, player1: {
        active: { card: 'Ditto Prism Star LOT', energy: [water, water] },
        hand: ['Salazzle SCR'], deck: padDeck(10),
      },
      player2: { active: { card: 'Finneon MT' }, hand: [water, fire, lightning], deck: padDeck(10) },
    });
    const { store, state, player1, player2 } = game;
    const card = player1.hand.cards[0] as PokemonCard;
    store.reduceEffect(state, new EvolveEffect(player1, player1.active, card));
    store.dispatch(new AttackAction(player1.id, 'Sudden Scorching'));
    expect(player2.discard.cards.length).toBe(1);
  });

  for (const accept of [true, false]) {
    it(`Evolutionary Vitality respects the decision (${accept}) and gathers every viewed Energy if used`, () => {
      game = fixture('Croconaw MT', 'hand').game;
      const { player1, overridePrompt } = game;
      const originalDeck = player1.deck.cards.slice();
      const expected = originalDeck.slice(0, 4);
      const show = jasmine.createSpy('reveal viewed Energy').and.callFake((prompt: ShowCardsPrompt) => {
        expect(prompt.cards).toEqual(expected);
        expect(player1.hand.cards.some(card => expected.includes(card))).toBe(false);
        return true;
      });
      const confirm = jasmine.createSpy('use Evolutionary Vitality').and.returnValue(accept);
      overridePrompt('Confirm', confirm);
      overridePrompt('Show cards', show);
      overridePrompt('Choose cards', input => {
        const cards = (input as ChooseCardsPrompt).cards.cards;
        return expected.map(card => cards.indexOf(card));
      });
      overridePrompt('Shuffle deck', () => player1.deck.cards.map((_, index) => index));
      playFromHand(game);
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(show).toHaveBeenCalledTimes(accept ? 1 : 0);
      expect(player1.deck.cards).toEqual(accept ? originalDeck.slice(4) : originalDeck);
      expect(player1.hand.cards.slice(1)).toEqual(accept ? expected : []);
    });
  }

  it('Emerge Charge attaches two physical discarded Energy cards to Flygon ex', () => {
    game = fixture('Flygon ex LM', 'hand').game;
    const { player1, overridePrompt } = game;
    const attachments = player1.discard.cards.slice(0, 2);
    const deckBefore = player1.deck.cards.slice();
    overridePrompt('Attach energy', offered => {
      const prompt = offered as AttachEnergyPrompt;
      expect(prompt.options.blockedTo).toContain(ownBench);
      return attachments.map(card => ({ to: ownActive, index: prompt.cardList.cards.indexOf(card) }));
    });
    playFromHand(game);
    for (const card of attachments) {
      expect(player1.active.cards).toContain(card);
      expect(player1.active.energies.cards).toContain(card);
      expect(player1.discard.cards).not.toContain(card);
    }
    expect(player1.deck.cards).toEqual(deckBefore);
  });

  it('Raging Roar targets a Benched Tyranitar and makes the available attachment after accepting', () => {
    game = fixture('Tyranitar FCO', 'hand').game;
    const { player1, overridePrompt } = game;
    player1.switchPokemon(player1.bench[0]);
    const energy = player1.discard.cards.find(card => card.fullName === darkness)!;
    overridePrompt('Attach energy', offered => {
      const prompt = offered as AttachEnergyPrompt;
      expect(prompt.options.blockedTo).toContain(ownActive);
      expect(prompt.options.min).toBe(1);
      return [{ to: ownBench, index: prompt.cardList.cards.indexOf(energy) }];
    });
    playFromHand(game, ownBench);
    expect(player1.bench[0].energies.cards).toContain(energy);
    expect(player1.active.energies.cards).not.toContain(energy);
  });

  it('Greedy Evolution attaches only the Darkness Energy selected from the top six', () => {
    game = fixture('Sharpedo UNB', 'hand').game;
    const { player1, overridePrompt } = game;
    const [picked, unpicked] = player1.deck.cards.filter(card => card.fullName === darkness);
    overridePrompt('Attach energy', offered => {
      const prompt = offered as AttachEnergyPrompt;
      expect(prompt.options.blockedTo).toContain(ownBench);
      return [{ to: ownActive, index: prompt.cardList.cards.indexOf(picked) }];
    });
    playFromHand(game);
    expect(player1.active.energies.cards).toContain(picked);
    expect(player1.active.energies.cards).not.toContain(unpicked);
    expect(player1.deck.cards).toContain(unpicked);
  });

  it('Blissful Nurse removes Energy from both representations of the healed Pokémon', () => {
    game = fixture('Blissey HS', 'hand').game;
    const { player1 } = game;
    const energy = player1.active.energies.cards[0];
    expect(player1.active.cards).toContain(energy);
    playFromHand(game);
    expect(player1.active.damage).toBe(0);
    expect(player1.active.cards).not.toContain(energy);
    expect(player1.active.energies.cards).not.toContain(energy);
    expect(player1.discard.cards).toContain(energy);
  });

  it('Cast-off Shell can choose the discarded Shedinja when one is also in hand', () => {
    game = fixture('Ninjask LA', 'hand').game;
    const { player1, overridePrompt } = game;
    const kept = player1.hand.cards.find(card => card.fullName === shedinja)!;
    const selected = player1.discard.cards.find(card => card.fullName === shedinja)!;
    overridePrompt('Choose cards', offered => [(offered as ChooseCardsPrompt).cards.cards.indexOf(selected)]);
    playFromHand(game);
    expect(player1.hand.cards).toContain(kept);
    expect(player1.discard.cards).not.toContain(selected);
    expect(player1.bench[1].getPokemonCard()).toBe(selected as PokemonCard);
  });

  it('declining Mapping leaves the deck in its original order', () => {
    game = fixture('Porygon2 TM', 'hand').game;
    const { player1, overridePrompt } = game;
    const deck = player1.deck.cards.slice();
    const confirm = jasmine.createSpy('use Mapping').and.returnValue(false);
    overridePrompt('Confirm', confirm);
    playFromHand(game);
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(player1.deck.cards).toEqual(deck);
  });

  it('Sunshine Song uses the shared evolution lifecycle for the selected Grass Pokémon', () => {
    game = setupGame({
      turn: 5,
      player1: { active: { card: previousPrint('Torterra SF') }, hand: ['Torterra SF'],
        bench: [{ card: 'Bulbasaur BS' }], deck: ['Ivysaur SV', ...padDeck(10)] },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
    });
    const { store, player1, overridePrompt } = game;
    const ivysaur = player1.deck.cards[0] as PokemonCard;
    const evolveEffects: AfterEvolveEffect[] = [];
    const reduce = store.reduceEffect.bind(store);
    spyOn(store, 'reduceEffect').and.callFake((...args: Parameters<typeof store.reduceEffect>) => {
      if (args[1] instanceof AfterEvolveEffect) evolveEffects.push(args[1]);
      return reduce(...args);
    });
    overridePrompt('Choose pokemon', () => [ownBench]);
    overridePrompt('Choose cards', offered => [(offered as ChooseCardsPrompt).cards.cards.indexOf(ivysaur)]);
    playFromHand(game);
    expect(player1.bench[0].getPokemonCard()).toBe(ivysaur);
    expect(evolveEffects.map(effect => [effect.pokemonCard.fullName, effect.playedFromHand]))
      .toEqual([['Torterra SF', true], ['Ivysaur SV', false]]);
  });

  for (const protectedTarget of [true, false]) {
    it(`Shadow Pain checks target-side Ability protection (${protectedTarget})`, () => {
      game = fixture('Gengar UNB', 'hand').game;
      const { store, player2 } = game;
      const reduce = store.reduceEffect.bind(store);
      let checked = false;
      spyOn(store, 'reduceEffect').and.callFake((...args: Parameters<typeof store.reduceEffect>) => {
        const effect = args[1];
        if (effect instanceof EffectOfAbilityEffect && effect.target === player2.active
          && effect.card.fullName === 'Gengar UNB') {
          checked = true;
          if (protectedTarget) effect.target = undefined;
        }
        return reduce(...args);
      });
      playFromHand(game);
      expect(checked).toBe(true);
      expect(player2.active.damage).toBe(protectedTarget ? 0 : 60);
    });
  }
});
