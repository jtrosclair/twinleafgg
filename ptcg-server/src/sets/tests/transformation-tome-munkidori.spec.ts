import { setupGame, padDeck } from './test-helpers';
import { playTrainerCard, useAttack } from './card-test-helpers';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { BoardEffect } from '../../game/store/card/card-types';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';

const book = 'Book of Transformation M4';
const transformationTome = 'Transformation Tome CRI';

describe('Transformation Tome and Adrena-Brain', () => {
  for (const [tome, otherPrint] of [[book, transformationTome], [transformationTome, book]]) {
    it('allows the same Munkidori to use its Ability after being replaced out and back in with ' + tome, () => {
      const g = setupGame({ turn: 3,
        player1: { active: { card: 'Ralts SIT', damage: 40 },
          bench: [
            { card: 'Munkidori TWM', energy: ['Darkness Energy SVE'] },
            { card: 'Pecharunt ex SFA', energy: ['Darkness Energy SVE'], damage: 10 }
          ],
          hand: [tome, otherPrint, tome, otherPrint], discard: ['Charmander BS'], deck: padDeck(15) },
        player2: { active: { card: 'Ralts SIT' }, deck: padDeck(15) }
      });
      const munkidori = g.player1.bench[0].getPokemonCard()!;
      const inheritedEnergy = g.player1.bench[1].energies.cards[0];
      const ability = (index: number) => g.store.dispatch(new UseAbilityAction(g.player1.id, 'Adrena-Brain',
        { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index }));
      g.overridePrompt('Remove damage', () => [{
        from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
        to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }
      }]);
      ability(0);
      expect(g.player1.marker.hasMarker('ADRENA_BRAIN_MARKER', munkidori)).toBe(true);

      g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }]);
      g.overridePrompt('Choose cards', () => [g.player1.discard.cards.findIndex(c => c.fullName === 'Charmander BS')]);
      playTrainerCard(g.store, g.state, 0, tome);
      expect(g.player1.discard.cards).toContain(munkidori);
      expect(g.player1.discard.cards.map(card => card.fullName)).toContain(otherPrint);
      expect(g.player1.marker.hasMarker('ADRENA_BRAIN_MARKER', munkidori)).toBe(false);

      const slot = g.player1.bench[1];
      slot.marker.addMarker('TOME_PRESERVED_EFFECT', g.player2.active.getPokemonCard()!);
      g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 1 }]);
      g.overridePrompt('Choose cards', () => [g.player1.discard.cards.indexOf(munkidori)]);
      playTrainerCard(g.store, g.state, 0, tome);
      expect(slot.getPokemonCard()).toBe(munkidori);
      expect(slot.energies.cards).toContain(inheritedEnergy);
      expect(slot.damage).toBe(10);
      expect(slot.marker.hasMarker('TOME_PRESERVED_EFFECT')).toBe(true);
      expect(slot.boardEffect.includes(BoardEffect.ABILITY_USED)).toBe(false);

      g.overridePrompt('Remove damage', () => [{
        from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
        to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }
      }]);
      ability(1);
      expect(g.player1.active.damage).toBe(20);
      expect(g.player2.active.damage).toBe(20);
      expect(() => ability(1)).toThrow();
    });
  }

  for (const [sudowoodo, attack] of [
    ['Sudowoodo M4', 'Learning Journey'],
    ['Sudowoodo M4 43', 'Trials and Trip-ulations'],
  ]) {
    it(`finds both names with ${attack}`, () => {
      const unrelatedItem = 'Ultra Ball MEG';
      const g = setupGame({ turn: 3,
        player1: { active: { card: sudowoodo, energy: ['Water Energy SVE'] },
          deck: [book, unrelatedItem, transformationTome, ...padDeck(12)] },
        player2: { active: { card: 'Ralts SIT' }, deck: padDeck(15) },
      });
      g.overridePrompt('Choose cards', prompt => {
        if (!(prompt instanceof ChooseCardsPrompt)) throw new Error('Expected a deck search prompt');
        const find = (name: string) => prompt.cards.cards.findIndex(card => card.fullName === name);
        expect(prompt.validate(prompt.decode([find(unrelatedItem)]))).toBe(false);
        return [find(book), find(transformationTome)];
      });
      useAttack(g.store, g.state, 0, attack);
      expect(g.player1.hand.cards.map(card => card.fullName)).toEqual([book, transformationTome]);
    });
  }

  it('carries used Adrena-Brain onto a Munkidori that directly replaces a used Munkidori', () => {
    const tome = 'Transformation Tome CRI';
    const g = setupGame({ turn: 3,
      player1: { active: { card: 'Ralts SIT', damage: 40 },
        bench: [{ card: 'Munkidori TWM', energy: ['Darkness Energy SVE'] }],
        hand: [tome, tome], discard: ['Munkidori TWM'], deck: padDeck(15) },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(15) }
    });
    const incoming = g.player1.discard.cards[0];
    const target = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
    g.overridePrompt('Remove damage', () => [{
      from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }
    }]);
    g.store.dispatch(new UseAbilityAction(g.player1.id, 'Adrena-Brain', target));
    g.overridePrompt('Choose pokemon', () => [target]);
    g.overridePrompt('Choose cards', () => [g.player1.discard.cards.indexOf(incoming)]);
    playTrainerCard(g.store, g.state, 0, tome);
    expect(g.player1.bench[0].cards).toContain(incoming);
    expect(g.player1.marker.hasMarker('ADRENA_BRAIN_MARKER', incoming)).toBe(true);
    expect(g.player1.bench[0].boardEffect).toContain(BoardEffect.ABILITY_USED);
    expect(() => g.store.dispatch(new UseAbilityAction(g.player1.id, 'Adrena-Brain', target))).toThrow();
  });
});
