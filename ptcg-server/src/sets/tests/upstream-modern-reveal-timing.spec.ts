import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const mew = 'Mew ex MEW';
const fire = 'Fire Energy SVE';
const lightning = 'Lightning Energy SVE';
const psychic = 'Psychic Energy SVE';
const nestBall = 'Nest Ball SVI';
const iono = 'Iono PAL';
const thorns = 'Iron Thorns TEF';
const capsule = 'Future Booster Energy Capsule PAR';
const radar = 'Techno Radar PAR';
const gothitelle = 'Gothitelle PAL';
const tropius = 'Tropius M5';
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };

function names(cards: { fullName: string }[]): string[] {
  return cards.map(card => card.fullName);
}

function revealedCards(records: { args: unknown[] }[]): ShowCardsPrompt[] {
  return records.flatMap(record => Array.isArray(record.args[1]) ? record.args[1] : [record.args[1]])
    .filter((prompt): prompt is ShowCardsPrompt => prompt instanceof ShowCardsPrompt);
}

describe('Fruity Scent private preview', () => {
  for (const take of [false, true]) {
    it('reveals only the selected cards to the opponent', () => {
      const cards = [fire, mew, nestBall, lightning, psychic, iono, thorns];
      const game = setupGame({ turn: 5,
        player1: { active: { card: tropius, energy: [fire] }, deck: cards },
        player2: { active: { card: mew }, deck: padDeck(8) }
      });
      const prompts = spyOn(game.store, 'prompt').and.callThrough();
      game.overridePrompt('Choose cards', prompt => {
        const choice = prompt as ChooseCardsPrompt;
        expect(names(choice.cards.cards)).toEqual(cards.slice(0, 6));
        return take ? [1] : [];
      });
      let shuffles = 0;
      game.overridePrompt('Shuffle deck', () => {
        ++shuffles;
        return game.player1.deck.cards.map((_, index) => index);
      });
      useAttack(game.store, game.state, 0, 'Fruity Scent');
      const reveals = revealedCards(prompts.calls.all());
      expect(reveals.filter(prompt => prompt.playerId === game.player1.id).map(prompt => names(prompt.cards)))
        .toEqual([cards.slice(0, 6)]);
      expect(reveals.filter(prompt => prompt.playerId === game.player2.id).map(prompt => names(prompt.cards)))
        .toEqual(take ? [[mew]] : []);
      expect(names(game.player1.hand.cards)).toEqual(take ? [mew] : []);
      expect(names(game.player1.deck.cards).sort()).toEqual((take ? cards.filter(card => card !== mew) : cards).sort());
      expect(shuffles).toBe(1);
    });
  }
});

describe('Destructo-Press reveal and settlement', () => {
  for (const copied of [false, true]) {
    it('shows the full preview and counts both Future Trainer cards', () => {
      const deck = [capsule, radar, nestBall, fire, mew, thorns];
      const game = setupGame({ turn: 5,
        player1: { active: { card: copied ? mew : thorns,
          energy: copied ? [lightning, fire, psychic] : [lightning, fire] },
          bench: [{ card: 'Iron Crown ex TEF' }], deck },
        player2: { active: { card: copied ? thorns : mew }, deck: padDeck(8) }
      });
      game.player2.active.getPokemonCard()!.hp = 400;
      if (copied) game.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Destructo-Press' }));
      const prompts = spyOn(game.store, 'prompt').and.callThrough();
      game.overridePrompt('Show cards', () => {
        expect(game.player1.discard.cards).toEqual([]);
        expect(game.player2.active.damage).toBe(0);
        return true;
      });
      let shuffles = 0;
      game.overridePrompt('Shuffle deck', () => {
        ++shuffles;
        expect(game.player2.active.damage).toBe(copied ? 140 : 160);
        return game.player1.deck.cards.map((_, index) => index);
      });
      useAttack(game.store, game.state, 0, copied ? 'Genome Hacking' : 'Destructo-Press');
      const reveals = revealedCards(prompts.calls.all());
      expect(reveals.map(prompt => prompt.playerId).sort()).toEqual([game.player1.id, game.player2.id].sort());
      expect(reveals.map(prompt => names(prompt.cards))).toEqual([deck.slice(0, 5), deck.slice(0, 5)]);
      expect(game.player2.active.damage).toBe(copied ? 140 : 160);
      expect(names(game.player1.discard.cards).sort()).toEqual([capsule, radar].sort());
      expect(names(game.player1.deck.cards).sort()).toEqual(deck.slice(2).sort());
      expect(shuffles).toBe(1);
    });
  }

  it('reveals a short deck with zero Future cards and deals zero damage', () => {
    const deck = [nestBall, fire, mew];
    const game = setupGame({ turn: 5,
      player1: { active: { card: thorns, energy: [lightning, fire] },
        bench: [{ card: 'Iron Crown ex TEF' }], deck },
      player2: { active: { card: mew }, deck: padDeck(8) }
    });
    const prompts = spyOn(game.store, 'prompt').and.callThrough();
    game.overridePrompt('Shuffle deck', () => [0, 1, 2]);
    useAttack(game.store, game.state, 0, 'Destructo-Press');
    expect(revealedCards(prompts.calls.all()).map(prompt => names(prompt.cards))).toEqual([deck, deck]);
    expect(game.player2.active.damage).toBe(0);
    expect(game.player1.discard.cards).toEqual([]);
    expect(names(game.player1.deck.cards)).toEqual(deck);
  });
});

describe('Jewel Seeker uses the completed board', () => {
  for (const print of ['Noctowl SCR', 'Noctowl PRE', 'Noctowl SVP']) {
    it(print + ' confirms after evolving and can take two Trainers', () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card: 'Hoothoot SCR' }, bench: [{ card: 'Terapagos ex SCR' }],
          hand: [print], deck: [iono, nestBall, mew] },
        player2: { active: { card: mew }, deck: padDeck(8) }
      });
      let confirmed = false;
      game.overridePrompt('Confirm', () => {
        expect(game.player1.active.getPokemonCard()?.fullName).toBe(print);
        confirmed = true;
        return true;
      });
      game.overridePrompt('Choose cards', prompt => {
        const search = prompt as ChooseCardsPrompt;
        expect(search.validate([])).toBe(true);
        return [iono, nestBall].map(name => search.cards.cards.findIndex(card => card.fullName === name));
      });
      game.store.dispatch(new PlayCardAction(game.player1.id, 0, ownActive));
      expect(confirmed).toBe(true);
      expect(names(game.player1.hand.cards).sort()).toEqual([iono, nestBall].sort());
      expect(names(game.player1.deck.cards)).toEqual([mew]);
    });
  }

  for (const condition of ['no Tera', 'suppressed', 'declined']) {
    it('leaves the deck alone with Jewel Seeker ' + condition, () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card: 'Hoothoot SCR' }, bench: [{ card: condition === 'no Tera' ? mew : 'Terapagos ex SCR' }],
          hand: ['Noctowl SCR'], deck: [iono, nestBall, mew] },
        player2: { active: { card: mew }, deck: padDeck(8) }
      });
      if (condition === 'suppressed') {
        game.player2.stadium.cards.push(getCardByName("Team Rocket's Watchtower DRI"));
      }
      let confirmed = false;
      game.overridePrompt('Confirm', () => { confirmed = true; return false; });
      game.overridePrompt('Choose cards', () => { fail('search must not start'); return []; });
      const before = game.player1.deck.cards.slice();
      game.store.dispatch(new PlayCardAction(game.player1.id, 0, ownActive));
      expect(confirmed).toBe(condition === 'declined');
      expect(game.player1.deck.cards).toEqual(before);
      expect(game.player1.active.getPokemonCard()?.fullName).toBe('Noctowl SCR');
    });
  }
});

describe('Read the Stars and Psych Out', () => {
  it('privately previews the only card and consumes the Ability for the turn', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: gothitelle }, deck: padDeck(8) },
      player2: { active: { card: mew }, deck: [nestBall] }
    });
    let shown = false;
    game.overridePrompt('Show cards', prompt => {
      shown = true;
      expect(prompt.playerId).toBe(game.player1.id);
      expect(names((prompt as ShowCardsPrompt).cards)).toEqual([nestBall]);
      return true;
    });
    useAbility(game.store, game.state, 0, 'Read the Stars');
    expect(shown).toBe(true);
    expect(names(game.player2.deck.cards)).toEqual([nestBall]);
    expect(() => useAbility(game.store, game.state, 0, 'Read the Stars')).toThrow();
  });

  it('keeps one of the top two cards and moves the other below the rest', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: gothitelle }, deck: padDeck(8) },
      player2: { active: { card: mew }, deck: [nestBall, iono, fire] }
    });
    game.overridePrompt('Choose cards', () => [0]);
    useAbility(game.store, game.state, 0, 'Read the Stars');
    expect(names(game.player2.deck.cards)).toEqual([iono, fire, nestBall]);
  });

  it('resolves damage before the blind discard', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: gothitelle, energy: [psychic, fire] }, deck: padDeck(8) },
      player2: { active: { card: mew }, hand: [nestBall, iono, psychic], deck: padDeck(8) }
    });
    game.overridePrompt('Choose cards', prompt => {
      expect(game.player2.active.damage).toBe(120);
      expect((prompt as ChooseCardsPrompt).options.isSecret).toBe(true);
      return [1];
    });
    useAttack(game.store, game.state, 0, 'Psych Out');
    expect(names(game.player2.discard.cards)).toEqual([iono]);
  });
});

for (const [pokemon, attack, eligible, other] of [
  ['Rotom SVI', 'Junk Hunt', nestBall, iono],
  ['Dedenne SSP', 'Electromagnetic Sonar', iono, mew],
]) {
  for (const hasTarget of [true, false]) {
    it(attack + ' requires a card only when an eligible discard exists', () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card: pokemon, energy: [fire] }, deck: padDeck(8),
          discard: hasTarget ? [other, eligible] : [other] },
        player2: { active: { card: 'Toedscruel PAR' }, deck: padDeck(8) }
      });
      let chose = false;
      game.overridePrompt('Choose cards', prompt => {
        chose = true;
        const recovery = prompt as ChooseCardsPrompt;
        expect(recovery.validate([])).toBe(false);
        return [recovery.cards.cards.findIndex(card => card.fullName === eligible)];
      });
      useAttack(game.store, game.state, 0, attack);
      expect(chose).toBe(hasTarget);
      expect(names(game.player1.hand.cards)).toEqual(hasTarget ? [eligible] : []);
      expect(names(game.player1.discard.cards)).toEqual([other]);
    });
  }
}
