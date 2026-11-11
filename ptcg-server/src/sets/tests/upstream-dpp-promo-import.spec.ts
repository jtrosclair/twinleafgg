import { getCardByName } from './test-helpers';
import { padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';

const importedPrints: Array<[string, string]> = [
  ['Arceus DPP', 'DP50'],
  ['Carnivine G DPP', 'DP42'],
  ['Cranidos DPP', 'DP07'],
  ['Cresselia DPP', 'DP51'],
  ['Darkrai DPP', 'DP24'],
  ['Darkrai DPP2', 'DP52'],
  ['Dialga DPP', 'DP26'],
  ['Dialga DPP2', 'DP49'],
  ['Drifblim DPP', 'DP34'],
  ['Dusknoir DPP', 'DP33'],
  ['Glameow DPP', 'DP23'],
  ['Gliscor DPP', 'DP36'],
  ['Magmortar DPP', 'DP20'],
  ['Magnezone DPP', 'DP32'],
  ['Magnezone DPP2', 'DP44'],
  ['Mime Jr. DPP', 'DP22'],
  ['Pikachu DPP', 'DP16'],
  ['Porygon-Z DPP', 'DP35'],
  ['Probopass G DPP', 'DP43'],
  ['Raichu DPP', 'DP21'],
  ['Regigigas DPP', 'DP40'],
  ['Shieldon DPP', 'DP08'],
  ['Tropical Wind DPP', 'DP05'],
  ['Ultimate Zone DPP', 'DP55'],
];

describe('Diamond & Pearl promo catalog imports', () => {
  for (const [fullName, setNumber] of importedPrints) {
    it(`registers ${fullName} with its upstream collector number`, () => {
      const card = getCardByName(fullName);
      expect(card.set).toBe('DPP');
      expect(card.setNumber).toBe(setNumber);
    });
  }
});

describe('Diamond & Pearl promo gameplay smoke checks', () => {
  it('Dialga DPP draws from its Time Bellow attack', () => {
    const game = setupGame({
      turn: 3,
      player1: { active: { card: 'Dialga DPP', energy: ['Metal Energy SVE'] }, deck: padDeck(12) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(12) },
    });
    const initialHandSize = game.player1.hand.cards.length;

    useAttack(game.store, game.state, 0, 'Time Bellow');

    expect(game.player1.hand.cards.length).toBe(initialHandSize + 1);
  });

  for (const shouldSwitch of [false, true]) {
    it(`Regigigas DPP Drag Off switches before damage: ${shouldSwitch}`, () => {
      const game = setupGame({
        turn: 3,
        player1: {
          active: { card: 'Regigigas DPP', energy: ['Water Energy SVE', 'Water Energy SVE', 'Water Energy SVE'] },
          deck: padDeck(12),
        },
        player2: { active: { card: 'Mew ex MEW' }, bench: [{ card: 'Charmander BS' }], deck: padDeck(12) },
      });
      const originalActive = game.player2.active;
      const benchedPokemon = game.player2.bench[0];
      game.overridePrompt('Confirm', () => shouldSwitch);
      game.overridePrompt(ChoosePokemonPromptType, () => [
        { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 },
      ]);

      useAttack(game.store, game.state, 0, 'Drag Off');

      expect(game.player2.active).toBe(shouldSwitch ? benchedPokemon : originalActive);
      expect(game.player2.bench[0]).toBe(shouldSwitch ? originalActive : benchedPokemon);
      expect(game.player2.active.damage).toBe(30);
      if (shouldSwitch) expect(game.player2.bench[0].damage).toBe(0);
    });
  }
});
