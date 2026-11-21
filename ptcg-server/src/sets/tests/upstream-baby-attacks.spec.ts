import { ensureClientCards } from '../../client/cards';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { endTurn, useAttack } from './card-test-helpers';
import { Card } from '../../game/store/card/card';
import { MoveEnergyPrompt } from '../../game/store/prompts/move-energy-prompt';
import { padDeck, setupGame } from './test-helpers';

describe('HeartGold & SoulSilver printed baby attacks', () => {
  beforeAll(ensureClientCards);

  it('prevents Energy Antics from taking Energy from an effect-protected source', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Smoochum HS' }, deck: padDeck(12) },
      player2: { active: { card: 'Finneon MT', energy: ['Water Energy SVE'] },
        bench: [{ card: 'Squirtle BS' }], deck: padDeck(12) },
    });
    game.player2.active.preventEffectsOfAttacksNextTurn = true;
    const energy = game.player2.active.energies.cards[0];
    const from = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    const to = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
    let prompted = false;
    game.overridePrompt('Move energy', () => {
      prompted = true;
      return [{ from, to, index: game.player2.active.cards.indexOf(energy) }];
    });
    game.overridePrompt('Coin flip', () => false);
    useAttack(game.store, game.state, 0, 'Energy Antics');
    expect(prompted).toBe(false);
    expect(game.player2.active.cards).toContain(energy);
    expect(game.player2.bench[0].cards).not.toContain(energy);
    expect(game.player1.active.specialConditions).toContain(SpecialCondition.ASLEEP);
    game.store.cleanup();
  });

  it('discards Energy if the destination alone is protected against Energy Antics', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Smoochum HS' }, deck: padDeck(12) },
      player2: { active: { card: 'Finneon MT', energy: ['Water Energy SVE'] },
        bench: [{ card: 'Squirtle BS' }], deck: padDeck(12) },
    });
    game.player2.bench[0].preventEffectsOfAttacksNextTurn = true;
    const energy = game.player2.active.energies.cards[0];
    const from = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    const to = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
    game.overridePrompt('Move energy', () => [{ from, to, index: game.player2.active.cards.indexOf(energy) }]);
    game.overridePrompt('Coin flip', () => false);
    useAttack(game.store, game.state, 0, 'Energy Antics');
    expect(game.player2.active.cards).not.toContain(energy);
    expect(game.player2.bench[0].cards).not.toContain(energy);
    expect(game.player2.discard.cards).toContain(energy);
    expect(game.player1.active.specialConditions).toContain(SpecialCondition.ASLEEP);
    game.store.cleanup();
  });

  it('blocks Graffiti’s extra cost on an effect-protected defender and still applies self-Sleep', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Igglybuff HS' }, deck: padDeck(12) },
      player2: { active: { card: 'Finneon MT', energy: padDeck(2) }, deck: padDeck(12) },
    });
    game.player2.active.preventEffectsOfAttacksNextTurn = true;
    game.overridePrompt('Coin flip', () => false);
    useAttack(game.store, game.state, 0, 'Graffiti');
    expect(game.player1.active.specialConditions).toContain(SpecialCondition.ASLEEP);
    expect(game.player2.active.attackCostIncreaseDuringNextTurn).toBe(0);
    expect(() => useAttack(game.store, game.state, 1, 'Tackle')).not.toThrow();
    game.store.cleanup();
  });
});

describe('Energy Antics transfer validation', () => {
  beforeAll(ensureClientCards);

  for (const storage of ['cards-only', 'energies-only'] as const) {
    it(`moves the selected physical attachment from saved ${storage} slots`, () => {
      const game = setupGame({
        turn: 5,
        player1: { active: { card: 'Smoochum HS' }, deck: padDeck(12) },
        player2: { active: { card: 'Finneon MT', energy: ['Water Energy SVE'] },
          bench: [{ card: 'Squirtle BS' }], deck: padDeck(12) },
      });
      const source = game.player2.active;
      const destination = game.player2.bench[0];
      const energy = source.energies.cards[0];
      if (storage === 'cards-only') source.energies.cards = [];
      else source.cards = source.cards.filter(card => card !== energy);
      game.overridePrompt('Move energy', rawPrompt => {
        const prompt = rawPrompt as MoveEnergyPrompt;
        const from = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
        const to = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
        const transfer = { from, to, card: energy };
        expect(prompt.options.min).toBe(1);
        expect(prompt.validate([transfer], game.state)).toBe(true);
        expect(prompt.validate([transfer, transfer], game.state)).toBe(false);
        expect(prompt.validate([], game.state)).toBe(false);
        expect(prompt.validate([{ from, to: from, card: energy }], game.state)).toBe(false);
        expect(prompt.validate([{ from, to: { ...to, index: 4 }, card: energy }], game.state)).toBe(false);
        expect(prompt.validate([{ from, to: { ...from, player: PlayerType.BOTTOM_PLAYER }, card: energy }], game.state)).toBe(false);
        expect(prompt.validate([{ from, to, card: source.getPokemonCard() as Card }], game.state)).toBe(false);
        expect(game.player1.active.specialConditions).toEqual([]);
        return [{ from, to, index: MoveEnergyPrompt.sourceCards(source).indexOf(energy) }];
      });
      game.overridePrompt('Coin flip', () => false);
      useAttack(game.store, game.state, 0, 'Energy Antics');
      expect(source.cards).not.toContain(energy);
      expect(source.energies.cards).not.toContain(energy);
      expect(destination.cards).toContain(energy);
      expect(destination.energies.cards).toContain(energy);
      expect(game.player1.active.specialConditions).toContain(SpecialCondition.ASLEEP);
      game.store.cleanup();
    });
  }

  it('raises the original defender’s attack cost for exactly its next turn', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Igglybuff HS' }, deck: padDeck(12) },
      player2: { active: { card: 'Finneon MT', energy: padDeck(2) }, deck: padDeck(12) },
    });
    useAttack(game.store, game.state, 0, 'Graffiti');
    expect(game.player2.active.attackCostIncreaseDuringNextTurn).toBe(1);
    expect(() => useAttack(game.store, game.state, 1, 'Tackle')).toThrow();
    const state = game.store.state;
    endTurn(game.store, state);
    expect(state.players[1].active.attackCostIncreaseDuringNextTurn).toBe(0);
    endTurn(game.store, state);
    useAttack(game.store, state, 1, 'Tackle');
    game.store.cleanup();
  });
});
