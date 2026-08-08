import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { playTrainerCard, useAbility, zoneContains } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

describe('Mega Greninja ex M4 — Mortal Shuriken', () => {
  it('accepts a Basic Water Energy returned to hand by Night Stretcher as its discard cost', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Mega Greninja ex M4' },
        hand: ['Night Stretcher SFA'],
        discard: ['Water Energy SVE'],
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });

    playTrainerCard(game.store, game.state, 0, 'Night Stretcher SFA');
    game.overridePrompt(ChooseCardsPromptType, (prompt, state) => {
      const waterEnergy = state.players[0].hand.cards.find(card => card.fullName === 'Water Energy SVE');
      expect(waterEnergy).toBeDefined();
      expect(prompt.validate([waterEnergy!], state)).toBe(true);
      game.overridePrompt(ChoosePokemonPromptType, () => [
        { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }
      ]);
      return [0];
    });
    useAbility(game.store, game.state, 0, 'Mortal Shuriken');

    expect(zoneContains(game.state, 0, 'discard', 'Water Energy SVE')).toBe(true);
  });
});
