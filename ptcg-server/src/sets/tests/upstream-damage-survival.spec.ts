import { AttackAction } from '../../game/store/actions/game-actions';
import { padDeck, setupGame } from './test-helpers';

const arceus = 'Arceus VSTAR BRS';
const machamp = 'Machamp FFI';
const pikachu = 'Pikachu ex SSP';
const sash = 'Focus Sash FFI';

describe('Damage that would knock out through a survival effect', () => {
  for (const { attack, attacker, energyCount, target, tool, damage, hp } of [
    { attack: 'Trinity Nova', attacker: arceus, energyCount: 3, target: pikachu, damage: 200, hp: 200 },
    { attack: 'Talon Hunt', attacker: 'Talonflame ex M6', energyCount: 2, target: machamp, tool: sash, damage: 150, hp: 150 },
    { attack: 'Trinity Nova', attacker: arceus, energyCount: 3, target: machamp, tool: sash, damage: 200, hp: 150 }
  ]) {
    it(`leaves ${target} at 10 HP after ${damage} damage from ${attack}`, () => {
      const { store, player1, overridePrompt } = setupGame({
        turn: 5,
        player1: {
          active: { card: attacker, energy: Array(energyCount).fill('Water Energy SVE') },
          deck: padDeck(10)
        },
        player2: {
          active: { card: target, tools: tool ? [tool] : [] },
          bench: [{ card: 'Mew ex MEW' }],
          deck: padDeck(10)
        }
      });
      const startingPrizes = player1.getPrizeLeft();
      overridePrompt('Choose cards', () => []);
      store.dispatch(new AttackAction(player1.id, attack));

      const [attackingPlayer, defendingPlayer] = store.state.players;
      expect(defendingPlayer.active.getPokemonCard()?.fullName).toBe(target);
      expect(defendingPlayer.active.damage).toBe(hp - 10);
      expect(defendingPlayer.active.attackDamageKnockOut).toBeUndefined();
      expect(attackingPlayer.getPrizeLeft()).toBe(startingPrizes);
      if (tool) {
        expect(defendingPlayer.discard.cards.map(card => card.fullName)).toContain(tool);
      }
    });
  }

  it('still awards a Knock Out when Pikachu ex had damage before the attack', () => {
    const { store, player1, overridePrompt } = setupGame({
      turn: 5,
      player1: {
        active: { card: arceus, energy: Array(3).fill('Water Energy SVE') },
        deck: padDeck(10)
      },
      player2: {
        active: { card: pikachu, damage: 10 },
        bench: [{ card: 'Mew ex MEW' }],
        deck: padDeck(10)
      }
    });
    const startingPrizes = player1.getPrizeLeft();
    overridePrompt('Choose cards', () => []);
    store.dispatch(new AttackAction(player1.id, 'Trinity Nova'));

    const [attackingPlayer, defendingPlayer] = store.state.players;
    expect(defendingPlayer.discard.cards.map(card => card.fullName)).toContain(pikachu);
    expect(attackingPlayer.getPrizeLeft()).toBe(startingPrizes - 2);
  });
});
