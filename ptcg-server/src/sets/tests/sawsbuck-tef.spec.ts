import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { useAbility } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

describe('Sawsbuck TEF — Changing Seasons', () => {
  it('restricts the deck search to Stadium cards', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Sawsbuck TEF' },
        deck: ['Buddy-Buddy Poffin TEF', 'Perilous Jungle TEF', 'Awakening Drum TEF', ...padDeck(7, 'Buddy-Buddy Poffin TEF')]
      },
      player2: {
        active: { card: 'Great Tusk TEF' },
        deck: padDeck(10, 'Buddy-Buddy Poffin TEF')
      }
    });

    game.overridePrompt(ChooseCardsPromptType, (prompt, state) => {
      const chooseCardsPrompt = prompt as ChooseCardsPrompt;
      const blockedCardNames = (chooseCardsPrompt.options.blocked || [])
        .map((index: number) => state.players[0].deck.cards[index].fullName);

      expect(blockedCardNames).toContain('Buddy-Buddy Poffin TEF');
      expect(blockedCardNames).toContain('Awakening Drum TEF');
      expect(blockedCardNames).not.toContain('Perilous Jungle TEF');
      return [];
    });

    useAbility(game.store, game.state, 0, 'Changing Seasons');
  });
});
