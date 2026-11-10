import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { ensureCardsRegistered, getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('Heatmor WHT Licking Catch', () => {
  // BLK and WHT share a set module, which the fixture loader indexes by BLK.
  beforeAll(() => ensureCardsRegistered(['Alomomola BLK']));
  it('registers its English printing', () => {
    const card = getCardByName('Heatmor WHT');
    expect([card.name, card.set, card.setNumber]).toEqual(['Heatmor', 'WHT', '19']);
  });

  for (const take of [false, true]) {
    it(`searches only for Fire Pokémon and Basic Fire Energy, then shuffles: ${take}`, () => {
      const game = setupGame({ turn: 2,
        player1: { active: { card: 'Heatmor WHT', energy: ['Fire Energy SVE'] }, deck: [
          'Ralts SIT', 'Fire Energy SVE', 'Water Energy SVE', 'Charmander PGO',
          'Heat Fire Energy DAA', 'Charmeleon MEW', 'Fire Energy SVE', 'Ultra Ball SVI'
        ] },
        player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
      });
      let revealed = false, shuffled = false;
      const selectedNames = ['Charmander PGO', 'Charmeleon MEW', 'Fire Energy SVE'];
      game.overridePrompt(ChooseCardsPromptType, prompt => {
        const choose = prompt as ChooseCardsPrompt;
        const byName = (name: string) => choose.cards.cards.findIndex(c => c.fullName === name);
        for (const name of ['Ralts SIT', 'Water Energy SVE', 'Heat Fire Energy DAA', 'Ultra Ball SVI']) {
          expect(choose.validate([choose.cards.cards[byName(name)]])).toBe(false);
        }
        for (const name of selectedNames) expect(choose.validate([choose.cards.cards[byName(name)]])).toBe(true);
        const legal = choose.cards.cards.filter(c => choose.validate([c]));
        expect(legal.length).toBe(4);
        expect(choose.validate(legal)).toBe(false);
        expect(choose.validate([])).toBe(true);
        return take ? selectedNames.map(byName) : [];
      });
      game.overridePrompt('Show cards', prompt => {
        revealed = true;
        const show = prompt as ShowCardsPrompt;
        expect(show.playerId).toBe(game.player2.id);
        expect(show.cards.map(c => c.fullName)).toEqual(selectedNames);
        for (const card of show.cards) {
          expect(game.player1.hand.cards).toContain(card);
          expect(game.player1.deck.cards).not.toContain(card);
        }
        return true;
      });
      game.overridePrompt('Shuffle deck', () => {
        shuffled = true;
        return game.player1.deck.cards.map((_, index) => index).reverse();
      });
      useAttack(game.store, game.state, 0, 'Licking Catch');
      expect(revealed).toBe(take);
      expect(shuffled).toBe(true);
      expect(game.player1.hand.cards.map(c => c.fullName)).toEqual(take ? selectedNames : []);
      expect(game.player1.deck.cards.length).toBe(take ? 5 : 8);
    });
  }

  it('may search unsuccessfully and shuffles a deck with no matches', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Heatmor WHT', energy: ['Fire Energy SVE'] }, deck: padDeck(5) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    let shuffled = false;
    game.overridePrompt(ChooseCardsPromptType, prompt => {
      const choose = prompt as ChooseCardsPrompt;
      expect(choose.validate([])).toBe(true);
      expect(choose.validate([choose.cards.cards[0]])).toBe(false);
      return [];
    });
    game.overridePrompt('Shuffle deck', () => {
      shuffled = true;
      return game.player1.deck.cards.map((_, index) => index).reverse();
    });
    useAttack(game.store, game.state, 0, 'Licking Catch');
    expect(shuffled).toBe(true);
    expect(game.player1.hand.cards.length).toBe(0);
  });

  it('searches and reveals a Pokémon with Fire as an additional type', () => {
    const dualName = 'Kyogre & Groudon LEGEND (Top) UD';
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Heatmor WHT', energy: ['Fire Energy SVE'] },
        deck: ['Water Energy SVE', dualName, 'Ralts SIT', 'Fire Energy SVE'] },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    let revealed = false;
    const fixture = game.player1.deck.cards.find(c => c.fullName === dualName) as PokemonCard;
    fixture.additionalCardTypes = [CardType.FIRE];
    expect(new Set(game.player1.deck.cards.map(card => card.id)).size).toBe(game.player1.deck.cards.length);
    game.overridePrompt(ChooseCardsPromptType, prompt => {
      const choose = prompt as ChooseCardsPrompt;
      const index = choose.cards.cards.findIndex(c => c.fullName === dualName);
      const dual = choose.cards.cards[index] as PokemonCard;
      expect(dual.cardType).toBe(CardType.WATER);
      expect(dual.additionalCardTypes).toContain(CardType.FIRE);
      expect(choose.validate([dual])).toBe(true);
      return [index];
    });
    game.overridePrompt('Show cards', prompt => {
      const show = prompt as ShowCardsPrompt;
      revealed = true;
      expect(show.playerId).toBe(game.player2.id);
      expect(show.cards.map(c => c.fullName)).toEqual([dualName]);
      expect(game.player1.hand.cards).toContain(show.cards[0]);
      expect(game.player1.deck.cards).not.toContain(show.cards[0]);
      return true;
    });
    useAttack(game.store, game.state, 0, 'Licking Catch');
    expect(revealed).toBe(true);
    expect(game.player1.hand.cards.map(c => c.fullName)).toEqual([dualName]);
  });

  it('allows the attack with an empty deck', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Heatmor WHT' }, deck: [] },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    const heatmor = game.player1.active.getPokemonCard()!;
    expect(() => game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, heatmor.attacks[0]))).not.toThrow();
    expect(game.player1.hand.cards.length).toBe(0);
  });
});
