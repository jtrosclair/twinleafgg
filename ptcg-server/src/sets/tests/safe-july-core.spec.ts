import { SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { AttackEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { WindupArm } from '../set-lost-origin/windup-arm';
import { endTurn, playTrainerCard, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

describe('July safe card fixes', () => {
  it("leaves exactly two cards in hand after Lillie's Full Force CEC resolves at end of turn", () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts SIT' },
        hand: [
          "Lillie's Full Force CEC",
          'Water Energy SVE',
          'Water Energy SVE'
        ],
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });

    playTrainerCard(game.store, game.state, 0, "Lillie's Full Force CEC");
    endTurn(game.store, game.state);

    expect(game.player1.hand.cards.length).toBe(2);
  });

  it('makes Windup Arm LOR a Tool that scopes the status exception to its UseAttackEffect', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });
    const windupArm = new WindupArm();
    game.player1.active.tools.push(windupArm);
    const attack = game.player1.active.getPokemonCard()!.attacks[0];
    const useAttackEffect = new UseAttackEffect(game.player1, attack);
    const attackEffect = new AttackEffect(game.player1, game.player2, attack);

    windupArm.reduceEffect(game.store, game.state, useAttackEffect);
    windupArm.reduceEffect(game.store, game.state, attackEffect);

    expect(windupArm.trainerType).toBe(TrainerType.TOOL);
    expect(windupArm.setNumber).toBe('170');
    expect(windupArm.fullName).toBe('Windup Arm LOR 170');
    expect((useAttackEffect as any).ignoreStatusConditions).toBe(true);
    expect((attackEffect as any).ignoreStatusConditions).toBeUndefined();
  });

  it('allows Windup Arm LOR attached to an Asleep Active to attack', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10)
      }
    });
    const windupArm = new WindupArm();
    game.player1.active.tools.push(windupArm);
    game.player1.active.specialConditions.push(SpecialCondition.ASLEEP);

    useAttack(game.store, game.state, 0, 'Ambushing Spark');

    expect(game.player2.active.damage).toBe(40);
  });
});
