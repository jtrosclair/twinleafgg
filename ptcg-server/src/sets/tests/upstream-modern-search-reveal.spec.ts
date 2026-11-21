import { GameMessage } from '../../game/game-message';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { SelectOptionPrompt } from '../../game/store/prompts/select-option-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { playTrainerCard, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

const mew = 'Mew ex MEW';
const fire = 'Fire Energy SVE';
const psychic = 'Psychic Energy SVE';
const water = 'Water Energy SVE';
const metal = 'Metal Energy SVE';
const luminous = 'Luminous Energy PAL';
const doubleTurbo = 'Double Turbo Energy BRS';
const toss = 'Poké Ball SVI';
const rocketBall = "Team Rocket's Great Ball DRI";
const rocketBasic = "Team Rocket's Murkrow DRI";
const rocketEvolution = "Team Rocket's Porygon2 DRI";
const headset = 'Miraculous Intercom SSP';
const blender = 'Brilliant Blender SSP';
const rod = 'Max Rod PRE';
const supporter = 'Iono PAL';
const slash = 'Toedscruel PAR';
const lapras = 'Lapras ex SCR';
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };

function names(cards: { fullName: string }[]): string[] {
  return cards.map(card => card.fullName);
}

function playItem(card: string, deck: string[], discard: string[] = [], defender = mew) {
  return setupGame({ turn: 5,
    player1: { active: { card: mew }, hand: [card], deck, discard },
    player2: { active: { card: defender }, deck: padDeck(8) }
  });
}

describe('Modern coin-flip searches', () => {
  it('leaves the deck order alone when Poké Ball flips tails', () => {
    const game = playItem(toss, [fire, mew, psychic, water]);
    const original = game.player1.deck.cards.slice();
    game.overridePrompt('Coin flip', () => false);
    game.overridePrompt('Shuffle deck', () => { fail('tails cannot shuffle'); return [3, 2, 1, 0]; });
    playTrainerCard(game.store, game.state, 0, toss);
    expect(game.player1.deck.cards).toEqual(original);
    expect(names(game.player1.discard.cards)).toContain(toss);
  });

  for (const take of [false, true]) {
    it('shuffles after a heads Poké Ball search, including a failed search', () => {
      const game = playItem(toss, [mew, fire, psychic]);
      game.overridePrompt('Coin flip', () => true);
      game.overridePrompt('Choose cards', prompt => {
        const choices = prompt as ChooseCardsPrompt;
        expect(choices.validate([])).toBe(true);
        return take ? [choices.cards.cards.findIndex(card => card.fullName === mew)] : [];
      });
      let shuffles = 0;
      game.overridePrompt('Shuffle deck', () => {
        ++shuffles;
        return game.player1.deck.cards.map((_, index) => index);
      });
      playTrainerCard(game.store, game.state, 0, toss);
      expect(shuffles).toBe(1);
      expect(names(game.player1.hand.cards).includes(mew)).toBe(take);
    });
  }

  for (const heads of [false, true]) {
    for (const take of [false, true]) {
      it('Great Ball searches the correct Stage and shuffles after either result', () => {
        const game = playItem(rocketBall, [rocketBasic, mew, rocketEvolution, fire]);
        const expected = heads ? rocketEvolution : rocketBasic;
        game.overridePrompt('Coin flip', () => heads);
        game.overridePrompt('Choose cards', prompt => {
          const search = prompt as ChooseCardsPrompt;
          const allowed = search.cards.cards.filter(card => search.validate([card]));
          expect(names(allowed)).toEqual([expected]);
          return take ? [search.cards.cards.indexOf(allowed[0])] : [];
        });
        let revealed: string[] = [];
        game.overridePrompt('Show cards', prompt => {
          expect(prompt.playerId).toBe(game.player2.id);
          revealed = names((prompt as ShowCardsPrompt).cards);
          return true;
        });
        let shuffles = 0;
        game.overridePrompt('Shuffle deck', () => {
          ++shuffles;
          return game.player1.deck.cards.map((_, index) => index);
        });
        playTrainerCard(game.store, game.state, 0, rocketBall);
        if (take) {
          expect(names(game.player1.hand.cards)).toContain(expected);
          expect(revealed).toEqual([expected]);
        } else {
          expect(game.player1.hand.cards).toEqual([]);
          expect(revealed).toEqual([]);
        }
        expect(shuffles).toBe(1);
      });
    }
  }
});

describe('Public discard transfers', () => {
  for (const item of [headset, rod]) {
    const target = item === headset ? supporter : mew;
    const illegals = item === headset ? [mew, fire] : [supporter, luminous];
    for (const blocked of [false, true]) {
      it(item + ' obeys Slime Mold Colony and its printed filter', () => {
        const game = playItem(item, padDeck(8), [target, ...illegals], blocked ? slash : mew);
        let chose = false;
        game.overridePrompt('Choose cards', prompt => {
          chose = true;
          const options = prompt as ChooseCardsPrompt;
          expect(options.message).toBe(GameMessage.CHOOSE_CARD_TO_HAND);
          expect(options.validate([])).toBe(false);
          return [options.cards.cards.findIndex(card => card.fullName === target)];
        });
        game.overridePrompt('Show cards', () => { fail('the discard is public'); return true; });
        playTrainerCard(game.store, game.state, 0, item);
        expect(chose).toBe(!blocked);
        expect(names(game.player1.hand.cards).includes(target)).toBe(!blocked);
        expect(names(game.player1.discard.cards)).toEqual(jasmine.arrayContaining([item, ...illegals]));
        expect(names(game.player1.discard.cards).includes(target)).toBe(blocked);
      });
    }
  }

  it('requires one Brilliant Blender selection and puts a discarded Prism Star into the Lost Zone', () => {
    const prism = 'Jirachi Prism Star CES';
    const game = playItem(blender, [prism, fire, psychic, mew]);
    game.overridePrompt('Choose cards', prompt => {
      const search = prompt as ChooseCardsPrompt;
      expect(search.validate([])).toBe(false);
      expect(search.options.max).toBe(5);
      return [prism, fire].map(name => search.cards.cards.findIndex(card => card.fullName === name));
    });
    game.overridePrompt('Show cards', () => { fail('Brilliant Blender discards directly'); return true; });
    let shuffles = 0;
    game.overridePrompt('Shuffle deck', () => {
      ++shuffles;
      return game.player1.deck.cards.map((_, index) => index);
    });
    playTrainerCard(game.store, game.state, 0, blender);
    expect(shuffles).toBe(1);
    expect(names(game.player1.lostzone.cards)).toEqual([prism]);
    expect(names(game.player1.discard.cards)).toEqual(jasmine.arrayContaining([fire, blender]));
    expect(names(game.player1.deck.cards).sort()).toEqual([mew, psychic].sort());
  });
});

describe('Pelipper Hearsay on completed evolution', () => {
  for (const choice of [0, 1, null]) {
    it('can take a Supporter from the selected zone or skip the Ability', () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card: 'Wingull PAL' }, hand: ['Pelipper PAL'], deck: [supporter, fire],
          discard: ['Lacey SCR'] },
        player2: { active: { card: mew }, deck: padDeck(8) },
      });
      game.overridePrompt('SelectOption', prompt => {
        expect((prompt as SelectOptionPrompt).options.disabled).toEqual([false, false]);
        return choice;
      });
      game.overridePrompt('Choose cards', prompt => {
        const search = prompt as ChooseCardsPrompt;
        expect(search.options.min).toBe(choice === 0 ? 1 : 0);
        const target = choice === 0 ? 'Lacey SCR' : supporter;
        return [search.cards.cards.findIndex(card => card.fullName === target)];
      });
      game.store.dispatch(new PlayCardAction(game.player1.id, 0, ownActive));
      expect(game.player1.active.getPokemonCard()?.fullName).toBe('Pelipper PAL');
      expect(names(game.player1.hand.cards)).toEqual(choice === 0 ? ['Lacey SCR'] : choice === 1 ? [supporter] : []);
    });
  }

  it('leaves the private search available when Toedscruel blocks recovery', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: 'Wingull PAL' }, hand: ['Pelipper PAL'], deck: [supporter, fire],
        discard: ['Lacey SCR'] },
      player2: { active: { card: slash }, deck: padDeck(8) }
    });
    game.overridePrompt('SelectOption', prompt => {
      expect((prompt as SelectOptionPrompt).options.disabled).toEqual([true, false]);
      return 1;
    });
    game.overridePrompt('Choose cards', prompt => {
      const search = prompt as ChooseCardsPrompt;
      return [search.cards.cards.findIndex(card => card.fullName === supporter)];
    });
    game.store.dispatch(new PlayCardAction(game.player1.id, 0, ownActive));
    expect(names(game.player1.hand.cards)).toEqual([supporter]);
    expect(names(game.player1.discard.cards)).toEqual(['Lacey SCR']);
  });
});

describe('Both Lapras ex attacks', () => {
  function larimar(deck: string[]) {
    return setupGame({ turn: 5,
      player1: { active: { card: lapras, energy: [water, psychic, metal] }, bench: [{ card: mew }], deck },
      player2: { active: { card: mew }, deck: padDeck(8) }
    });
  }

  for (const take of [false, true, null]) {
    it('looks at 20, attaches optional Basic and Special Energy and shuffles the full remainder once', () => {
      const deck = [luminous, ...Array<string>(18).fill(fire), psychic, metal, water];
      const game = larimar(deck);
      game.overridePrompt('Attach energy', prompt => {
        const selection = prompt as AttachEnergyPrompt;
        expect(names(selection.cardList.cards)).toEqual(deck.slice(0, 20));
        expect(selection.options.max).toBe(20);
        return take === null ? null : take ? [{ index: 0, to: ownBench }, { index: 19, to: ownActive }] : [];
      });
      let shuffles = 0;
      game.overridePrompt('Shuffle deck', () => {
        ++shuffles;
        expect(game.player1.deck.cards.length).toBe(take ? 20 : 22);
        return game.player1.deck.cards.map((_, index) => index);
      });
      useAttack(game.store, game.state, 0, 'Larimar Rain');
      expect(shuffles).toBe(1);
      expect(names(game.player1.deck.cards).sort()).toEqual((take ? deck.slice(1, 19).concat(deck.slice(20)) : deck).sort());
      expect(names(game.player1.bench[0].cards).includes(luminous)).toBe(take === true);
      expect(names(game.player1.active.cards).filter(name => name === psychic).length).toBe(take ? 2 : 1);
    });
  }

  it('shows a short top deck privately and puts it all back when there is no Energy', () => {
    const deck = [mew, supporter, lapras];
    const game = larimar(deck);
    game.overridePrompt('Show cards', prompt => {
      expect(prompt.playerId).toBe(game.player1.id);
      expect(names((prompt as ShowCardsPrompt).cards)).toEqual(deck);
      return true;
    });
    let shuffles = 0;
    game.overridePrompt('Shuffle deck', () => {
      ++shuffles;
      return game.player1.deck.cards.map((_, index) => index);
    });
    useAttack(game.store, game.state, 0, 'Larimar Rain');
    expect(shuffles).toBe(1);
    expect(names(game.player1.deck.cards).sort()).toEqual(deck.slice().sort());
  });

  it('counts both Energy units supplied by Double Turbo Energy and applies its damage reduction', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: lapras, energy: [water, doubleTurbo] }, deck: padDeck(8) },
      player2: { active: { card: mew }, deck: padDeck(8) }
    });
    useAttack(game.store, game.state, 0, 'Power Splash');
    expect(game.player2.active.damage).toBe(100);
  });
});
