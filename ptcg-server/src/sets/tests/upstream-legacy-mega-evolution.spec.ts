import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { AfterEvolveEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CAN_PLAY_POKEMON_CARD, IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { Prompt } from '../../game/store/prompts/prompt';
import { State } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame, SetupGameResult } from './test-helpers';

const prints: [string, string | null][] = [
  ["M Gardevoir-EX 30C CC21", "Gardevoir Spirit Link PRC"],
  ["M Ampharos-EX AOR", "Ampharos Spirit Link AOR"],
  ["M Sceptile-EX AOR", "Sceptile Spirit Link AOR"],
  ["M Tyranitar-EX AOR", "Tyranitar Spirit Link AOR"],
  ["Primal Groudon-EX AOR", "Groudon Spirit Link PRC"],
  ["M Sceptile-EX AOR 85", "Sceptile Spirit Link AOR"],
  ["M Ampharos-EX AOR 88", "Ampharos Spirit Link AOR"],
  ["M Tyranitar-EX AOR 92", "Tyranitar Spirit Link AOR"],
  ["Primal Kyogre-EX AOR", "Kyogre Spirit Link PRC"],
  ["M Rayquaza-EX AOR", "Rayquaza Spirit Link ROS"],
  ["M Gyarados-EX BKP", "Gyarados Spirit Link BKP"],
  ["M Scizor-EX BKP", "Scizor Spirit Link BKP"],
  ["M Gyarados-EX BKP 115", "Gyarados Spirit Link BKP"],
  ["M Scizor-EX BKP 120", "Scizor Spirit Link BKP"],
  ["M Glalie-EX BKT", "Glalie Spirit Link BKT"],
  ["M Houndoom-EX BKT", "Houndoom Spirit Link BKT"],
  ["M Mewtwo-EX BKT", "Mewtwo Spirit Link BKT"],
  ["M Mewtwo-EX BKT 64", "Mewtwo Spirit Link BKT"],
  ["M Houndoom-EX BKT 154", "Houndoom Spirit Link BKT"],
  ["M Glalie-EX BKT 156", "Glalie Spirit Link BKT"],
  ["M Mewtwo-EX BKT 159", "Mewtwo Spirit Link BKT"],
  ["M Mewtwo-EX BKT 160", "Mewtwo Spirit Link BKT"],
  ["M Rayquaza EX CEL", "Rayquaza Spirit Link ROS"],
  ["M Rayquaza EX CEL CC24", "Rayquaza Spirit Link ROS"],
  ["M Charizard-EX EVO", "Charizard Spirit Link EVO"],
  ["M Pidgeot-EX EVO", "Pidgeot Spirit Link EVO"],
  ["M Slowbro-EX EVO", "Slowbro Spirit Link EVO"],
  ["M Venusaur-EX EVO", "Venusaur Spirit Link EVO"],
  ["M Venusaur-EX SR EVO", "Venusaur Spirit Link EVO"],
  ["M Blastoise-EX EVO", "Blastoise Spirit Link EVO"],
  ["M Charizard-EX EVO 101", "Charizard Spirit Link EVO"],
  ["M Blastoise-EX EVO 102", "Blastoise Spirit Link EVO"],
  ["M Pidgeot-EX EVO 105", "Pidgeot Spirit Link EVO"],
  ["M Alakazam-EX FCO", "Alakazam Spirit Link FCO"],
  ["M Altaria-EX FCO", "Altaria Spirit Link FCO"],
  ["M Audino-EX FCO", "Audino Spirit Link FCO"],
  ["M Alakazam-EX FCO 118", "Alakazam Spirit Link FCO"],
  ["M Altaria-EX FCO 121", "Altaria Spirit Link FCO"],
  ["M Charizard EX FLF", "Charizard Spirit Link EVO"],
  ["M Charizard-EX FLF 69", "Charizard Spirit Link EVO"],
  ["M Kangaskhan-EX FLF", null],
  ["M Charizard EX4 FLF", "Charizard Spirit Link EVO"],
  ["M Kangaskhan-EX2 FLF", null],
  ["M Charizard-EX FLF 107", "Charizard Spirit Link EVO"],
  ["M Heracross-EX FFI", null],
  ["M Lucario-EX FFI", null],
  ["M Lucario-EX FFI 55a", null],
  ["M Heracross-EX FFI 112", null],
  ["M Lucario-EX FFI 113", null],
  ["M Gardevoir-EX GEN", "Gardevoir Spirit Link PRC"],
  ["M Gengar-EX PHF", "Gengar Spirit Link PHF"],
  ["M Manectric-EX PHF", "Manectric Spirit Link PHF"],
  ["M Gengar-EX2 PHF", "Gengar Spirit Link PHF"],
  ["M Manectric-EX PHF 24a", "Manectric Spirit Link PHF"],
  ["M Manectric-EX PHF 120", "Manectric Spirit Link PHF"],
  ["M Aggron-EX PRC", "Aggron Spirit Link PRC"],
  ["M Gardevoir-EX PRC", "Gardevoir Spirit Link PRC"],
  ["Primal Groudon-EX PRC", "Groudon Spirit Link PRC"],
  ["Primal Kyogre-EX PRC", "Kyogre Spirit Link PRC"],
  ["Primal Groudon-EX2 PRC", "Groudon Spirit Link PRC"],
  ["M Gardevoir-EX2 PRC", "Gardevoir Spirit Link PRC"],
  ["Primal Kyogre-EX PRC 149", "Kyogre Spirit Link PRC"],
  ["M Aggron-EX PRC 154", "Aggron Spirit Link PRC"],
  ["M Gallade-EX ROS", "Gallade Spirit Link ROS"],
  ["M Latios-EX ROS", "Latios Spirit Link ROS"],
  ["M Rayquaza EX ROS", "Rayquaza Spirit Link ROS"],
  ["M Rayquaza-EX ROS 76", "Rayquaza Spirit Link ROS"],
  ["M Rayquaza-EX ROS", "Rayquaza Spirit Link ROS"],
  ["M Rayquaza-EX3 ROS", "Rayquaza Spirit Link ROS"],
  ["M Gallade-EX ROS 100", "Gallade Spirit Link ROS"],
  ["M Latios-EX ROS 102", "Latios Spirit Link ROS"],
  ["M Gardevoir-EX STS", "Gardevoir Spirit Link PRC"],
  ["M Steelix-EX STS", "Steelix Spirit Link STS"],
  ["M Gardevoir-EX2 STS", "Gardevoir Spirit Link PRC"],
  ["M Steelix-EX STS 109", "Steelix Spirit Link STS"],
  ["M Blastoise-EX XY", "Blastoise Spirit Link EVO"],
  ["M Venusaur-EX XY", "Venusaur Spirit Link EVO"],
];

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const deltaPrints = ['M Rayquaza-EX ROS', 'M Rayquaza-EX ROS 76', 'M Rayquaza-EX3 ROS', 'M Rayquaza EX CEL', 'M Rayquaza EX CEL CC24'];
const thetaPrints = ['Primal Groudon-EX AOR', 'Primal Kyogre-EX AOR', 'M Rayquaza-EX AOR'];
const nurturing = "Pokémon Breeder's Nurturing DAA";

function findBase(print: string): string {
  const manager = CardManager.getInstance();
  const evolution = manager.getCardByName(print);
  if (!(evolution instanceof PokemonCard)) throw new Error(`Missing Pokémon ${print}`);
  const previous = manager.getAllCards().find(card => card instanceof PokemonCard
    && card.name === evolution.evolvesFrom && card.stage < evolution.stage);
  if (!previous) throw new Error(`Missing previous print for ${print}`);
  return previous.fullName;
}

function fixture(print: string, tools: string[] = [], turn = 6, opponent = 'Finneon MT') {
  const game = setupGame({
    turn,
    player1: {
      active: { card: findBase(print), damage: 60, tools },
      bench: [{ card: 'Finneon MT' }],
      hand: [print], deck: padDeck(10),
    },
    player2: { active: { card: opponent }, deck: padDeck(10) },
  });
  game.player1.canEvolve = turn > 2;
  game.player1.active.pokemonPlayedTurn = 1;
  return game;
}

function play(game: SetupGameResult, target = active) {
  game.store.dispatch(new PlayCardAction(game.player1.id, 0, target));
}

function observeTurnEnd(game: SetupGameResult, callback: () => void) {
  const reduce = game.store.reduceEffect.bind(game.store);
  spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    if (effect instanceof EndTurnEffect && effect.player === game.player1) callback();
    return reduce(state, effect);
  });
}

describe('XY Mega Evolution and Primal Reversion rules', () => {
  beforeAll(ensureClientCards);
  let game: SetupGameResult | undefined;
  afterEach(() => game?.store.cleanup());

  it('covers every registered legacy Mega and Primal print', () => {
    const registered = CardManager.getInstance().getAllCards()
      .filter(card => card instanceof PokemonCard && card.stage === Stage.MEGA)
      .map(card => card.fullName).sort();
    expect(prints.map(([print]) => print).sort()).toEqual(registered);
  });

  for (const [print, spiritLink] of prints) {
    for (const link of spiritLink ? [false, true] : [false]) {
      it(`${print} completes before the turn ends and honors its own Spirit Link (${link})`, () => {
        game = fixture(print, link ? [spiritLink!] : []);
        const { player1, state } = game;
        const evolution = player1.hand.cards[0] as PokemonCard;
        const atTurnEnd: (PokemonCard | undefined)[] = [];
        observeTurnEnd(game, () => atTurnEnd.push(player1.active.getPokemonCard()));
        play(game);

        expect(player1.active.getPokemonCard()).toBe(evolution);
        expect(atTurnEnd).toEqual(link ? [] : [evolution]);
        expect(state.players[state.activePlayer] === player1).toBe(link);
      });
    }
  }

  for (const suppression of ['wrong Pokémon', 'Lysandre Labs'] as const) {
    it(`a Spirit Link with ${suppression} cannot preserve the turn`, () => {
      game = fixture('M Scizor-EX BKP', [suppression === 'wrong Pokémon' ? 'Rayquaza Spirit Link ROS' : 'Scizor Spirit Link BKP']);
      if (suppression === 'Lysandre Labs') {
        const stadium = getCardByName('Lysandre Labs FLI');
        stadium.id = 9001;
        game.player1.stadium.cards.push(stadium);
      }
      const endTurn = jasmine.createSpy('end turn');
      observeTurnEnd(game, endTurn);
      play(game);
      expect(endTurn).toHaveBeenCalledTimes(1);
    });
  }

  for (const stadiumName of ['Lysandre Labs FLI', 'Jamming Tower TWM']) {
    it(`New Moon shields just its owner's Tools from ${stadiumName}`, () => {
      game = setupGame({
        turn: 6,
        player1: {
          active: { card: findBase('M Scizor-EX BKP'), tools: ['Scizor Spirit Link BKP'] },
          bench: [{ card: 'Lunatone OBF' }, { card: 'Solrock PGO' }],
          hand: ['M Scizor-EX BKP'], deck: padDeck(10),
        },
        player2: { active: { card: 'Finneon MT', tools: ['Air Balloon SSH'] }, deck: padDeck(10) },
      });
      const { store, state, player1, player2 } = game;
      player1.active.pokemonPlayedTurn = 1;
      const stadium = getCardByName(stadiumName);
      stadium.id = 9002;
      player2.stadium.cards.push(stadium);
      expect(IS_TOOL_BLOCKED(store, state, player2, player2.active.tools[0] as TrainerCard)).toBe(true);
      const endTurn = jasmine.createSpy('end turn');
      observeTurnEnd(game, endTurn);
      play(game);
      expect(endTurn).not.toHaveBeenCalled();
      expect(state.activePlayer).toBe(0);
    });
  }

  for (const print of deltaPrints) {
    it(`Δ Evolution permits ${print} during the first turn without opening other evolutions`, () => {
      game = fixture(print, ['Rayquaza Spirit Link ROS'], 1);
      const { player1, store, state } = game;
      const card = player1.hand.cards[0] as PokemonCard;
      expect(CAN_PLAY_POKEMON_CARD(store, state, player1, card)).toBe(true);
      play(game);
      expect(player1.active.getPokemonCard()).toBe(card);
      expect(player1.canEvolve).toBe(false);
      expect(state.activePlayer).toBe(0);
    });
  }

  it('a rejected Mega evolution leaves the turn, damage, and play restrictions intact', () => {
    game = fixture('Primal Groudon-EX AOR', [], 6, 'Archeops NVI');
    const { player1, state } = game;
    const evolution = player1.hand.cards[0];
    const original = player1.active.getPokemonCard();
    const endTurn = jasmine.createSpy('end turn');
    observeTurnEnd(game, endTurn);
    expect(() => play(game!)).toThrow();
    expect(player1.active.damage).toBe(60);
    expect(player1.active.getPokemonCard()).toBe(original);
    expect(player1.hand.cards).toContain(evolution);
    expect(state.activePlayer).toBe(0);
    expect(endTurn).not.toHaveBeenCalled();
  });

  for (const print of thetaPrints) {
    it(`θ Max heals ${print} after evolution and before the turn ends`, () => {
      game = fixture(print);
      const { player1 } = game;
      const evolution = player1.hand.cards[0] as PokemonCard;
      const observations: (number | undefined)[] = [];
      observeTurnEnd(game, () => observations.push(player1.active.getPokemonCard() === evolution ? player1.active.damage : undefined));
      play(game);
      expect(player1.active.damage).toBe(0);
      expect(observations).toEqual([0]);
    });
  }

  it('θ Max does not give the Ancient Origins Rayquaza first-turn evolution', () => {
    game = fixture('M Rayquaza-EX AOR', [], 1);
    const { player1, state, store } = game;
    expect(CAN_PLAY_POKEMON_CARD(store, state, player1, player1.hand.cards[0] as PokemonCard)).toBe(false);
    expect(() => play(game!)).toThrow();
    expect(player1.active.damage).toBe(60);
  });

  it('modern Mega Pokémon ex complete a normal evolution and keep playing', () => {
    game = fixture('Mega Venusaur ex M1L');
    const { player1, state } = game;
    const evolution = player1.hand.cards[0] as PokemonCard;
    const endTurn = jasmine.createSpy('end turn');
    observeTurnEnd(game, endTurn);
    play(game);
    expect(player1.active.getPokemonCard()).toBe(evolution);
    expect(state.activePlayer).toBe(0);
    expect(endTurn).not.toHaveBeenCalled();
  });

  it('Pokémon Breeder’s Nurturing finishes both deck evolutions and shuffles before ending the turn once', () => {
    game = setupGame({
      turn: 6,
      player1: {
        active: { card: findBase('M Scizor-EX BKP') },
        bench: [{ card: findBase('Primal Kyogre-EX PRC') }],
        hand: [nurturing],
        deck: ['M Scizor-EX BKP', 'Primal Kyogre-EX PRC', ...padDeck(10)],
      },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
    });
    const { player1, overridePrompt } = game;
    player1.canEvolve = true;
    player1.active.pokemonPlayedTurn = 1;
    player1.bench[0].pokemonPlayedTurn = 1;
    overridePrompt('Choose pokemon', input => {
      const offered = input as ChoosePokemonPrompt;
      expect(offered.slots).toContain(SlotType.ACTIVE);
      return [active, bench];
    });
    let shuffled = false;
    let searches = 0;
    const selectEvolution = (input: Prompt<unknown>) => {
      const offered = input as ChooseCardsPrompt;
      const card = ['M Scizor-EX BKP', 'Primal Kyogre-EX PRC'][searches++];
      if (searches === 1) overridePrompt('Choose cards', selectEvolution);
      expect(player1.active.getPokemonCard()?.fullName).toBe(findBase('M Scizor-EX BKP'));
      expect(player1.bench[0].getPokemonCard()?.fullName).toBe(findBase('Primal Kyogre-EX PRC'));
      return [offered.cards.cards.findIndex(entry => entry.fullName === card)];
    };
    overridePrompt('Choose cards', selectEvolution);
    overridePrompt('Shuffle deck', () => {
      shuffled = true;
      return player1.deck.cards.map((_card, index) => index);
    });
    const observations: [string | undefined, string | undefined, boolean][] = [];
    const completed: string[] = [];
    const reduce = game.store.reduceEffect.bind(game.store);
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      const activeName = player1.active.getPokemonCard()?.fullName;
      const benchName = player1.bench[0].getPokemonCard()?.fullName;
      if (effect instanceof AfterEvolveEffect) {
        completed.push(effect.pokemonCard.fullName);
        expect([activeName, benchName, shuffled]).toEqual(['M Scizor-EX BKP', 'Primal Kyogre-EX PRC', true]);
      }
      if (effect instanceof EndTurnEffect && effect.player === player1) {
        observations.push([activeName, benchName, shuffled]);
      }
      return reduce(state, effect);
    });
    play(game, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 });
    expect(searches).toBe(2);
    expect(completed).toEqual(['M Scizor-EX BKP', 'Primal Kyogre-EX PRC']);
    expect(observations).toEqual([['M Scizor-EX BKP', 'Primal Kyogre-EX PRC', true]]);
    expect(game.state.activePlayer).toBe(1);
  });

  it('Pokémon Breeder’s Nurturing rejects the first turn even when another effect allows hand evolution', () => {
    game = setupGame({
      turn: 2,
      player1: {
        active: { card: findBase('M Scizor-EX BKP') }, hand: [nurturing],
        deck: ['M Scizor-EX BKP', ...padDeck(10)],
      },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
    });
    game.player1.canEvolve = true;
    game.player1.active.pokemonPlayedTurn = 0;
    const candidate = game;
    expect(() => play(candidate, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 })).toThrow();
    expect(game.store.state.players[0].hand.cards[0].fullName).toBe(nurturing);
  });

  it('Pokémon Breeder’s Nurturing cannot use the same deck card for two Pokémon', () => {
    const base = findBase('M Scizor-EX BKP');
    game = setupGame({
      turn: 6,
      player1: {
        active: { card: base }, bench: [{ card: base }], hand: [nurturing],
        deck: ['M Scizor-EX BKP', ...padDeck(10)],
      },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
    });
    let searches = 0;
    game.overridePrompt('Choose pokemon', () => [active, bench]);
    const { overridePrompt } = game;
    const selectEvolution = (input: Prompt<unknown>) => {
      const offered = input as ChooseCardsPrompt;
      const index = offered.cards.cards.findIndex(card => card.fullName === 'M Scizor-EX BKP');
      if (++searches === 1) {
        overridePrompt('Choose cards', selectEvolution);
        return [index];
      }
      expect(offered.options.blocked).toContain(index);
      return [];
    };
    overridePrompt('Choose cards', selectEvolution);
    play(game, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 });
    expect(searches).toBe(2);
    expect(game.player1.active.getPokemonCard()?.fullName).toBe('M Scizor-EX BKP');
    expect(game.player1.bench[0].getPokemonCard()?.fullName).toBe(base);
  });

  it('a Mega evolution during Moonlit Miracle lets that attack end the turn once', () => {
    game = setupGame({
      turn: 6,
      player1: {
        active: { card: 'Clefable BRS 54', energy: ['Water Energy SVE'] },
        bench: [{ card: findBase('M Scizor-EX BKP') }],
        deck: ['M Scizor-EX BKP', ...padDeck(10)],
      },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(10) },
    });
    const { player1, store, overridePrompt } = game;
    const mega = player1.deck.cards[0] as PokemonCard;
    spyOn(Math, 'random').and.returnValue(0.1);
    overridePrompt('Choose pokemon', () => [bench]);
    overridePrompt('Choose cards', offered => [(offered as ChooseCardsPrompt).cards.cards.indexOf(mega)]);
    const events: string[] = [];
    const reduce = store.reduceEffect.bind(store);
    spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof AfterEvolveEffect && effect.pokemonCard === mega) events.push('evolved');
      if (effect instanceof EndTurnEffect && effect.player === player1) events.push('ended');
      return reduce(state, effect);
    });
    store.dispatch(new AttackAction(player1.id, 'Moonlit Miracle'));
    expect(player1.bench[0].getPokemonCard()).toBe(mega);
    expect(events).toEqual(['evolved', 'ended']);
  });
});
