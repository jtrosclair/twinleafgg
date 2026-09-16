import { TrainerCard } from '../../game/store/card/trainer-card';
import { SpecialCondition } from '../../game/store/card/card-types';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { AttackEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { UseStadiumAction } from '../../game/store/actions/game-actions';
import { useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';
import { GreatTree } from '../set-stellar-crown/grand-tree';
import { Whismur } from '../set-celestial-storm/whismur';
import { MowRotom } from '../set-destined-rivals/mow-rotom';
import { WindupArm } from '../set-lost-origin/windup-arm';

describe('Integrated safe-fix boundary simulations', () => {
  it('allows a Trainer play while Whismur has not applied its marker', () => {
    const game = setupGame({
      turn: 2,
      player1: { active: { card: 'Whismur CES' }, deck: padDeck(10) },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });
    const whismur = game.player1.active.getPokemonCard() as Whismur;
    const trainer = {} as TrainerCard;

    expect(() => whismur.reduceEffect(
      game.store,
      game.state,
      new PlayItemEffect(game.player2, trainer)
    )).not.toThrow();
  });

  it('lets Grand Tree evolve an eligible Basic that was not played this turn', () => {
    const game = setupGame({
      turn: 4,
      player1: {
        active: { card: 'Ralts SIT' },
        deck: ['Kirlia SIT', ...padDeck(9)]
      },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });
    const grandTree = new GreatTree();
    game.player1.stadium.cards.push(grandTree);

    game.overridePrompt(ChoosePokemonPromptType, (prompt: any) => {
      const activeTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
      expect(prompt.options.blocked).not.toContain(activeTarget);
      return [activeTarget];
    });
    const chooseKirlia = (prompt: any) => {
      game.overridePrompt(ChooseCardsPromptType, chooseKirlia);
      const index = prompt.cards.cards.findIndex((card: any) => card.fullName === 'Kirlia SIT');
      return index === -1 ? null : [index];
    };
    game.overridePrompt(ChooseCardsPromptType, chooseKirlia);

    game.store.dispatch(new UseStadiumAction(game.player1.id));

    expect(game.player1.active.getPokemonCard()?.fullName).toBe('Kirlia SIT');
  });

  it('does no Gadget Show damage when no Tools are attached', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: {
          card: 'Heat Rotom DRI',
          energy: ['Fire Energy SVE', 'Fire Energy SVE']
        },
        deck: padDeck(10)
      },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });

    useAttack(game.store, game.state, 0, 'Gadget Show');

    expect(game.player2.active.damage).toBe(0);
  });

  it('does not emit a MoveCardsEffect when Mow Rotom has no Stadium to discard', () => {
    const game = setupGame({
      turn: 2,
      player1: { active: { card: 'Mow Rotom DRI' }, deck: padDeck(10) },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });
    const mowRotom = game.player1.active.getPokemonCard() as MowRotom;
    const reduceEffect = spyOn(game.store, 'reduceEffect').and.callThrough();

    mowRotom.reduceEffect(
      game.store,
      game.state,
      new AttackEffect(game.player1, game.player2, mowRotom.attacks[0])
    );

    expect(reduceEffect.calls.allArgs().some(([, effect]) => effect instanceof MoveCardsEffect)).toBe(false);
  });

  it("burns Heat Rotom's opponent Active without burning its controller's Active", () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Heat Rotom DRI', energy: ['Fire Energy SVE'] },
        deck: padDeck(10)
      },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });

    const heatRotom = game.player1.active.getPokemonCard()!;
    heatRotom.reduceEffect(
      game.store,
      game.state,
      new AttackEffect(game.player1, game.player2, heatRotom.attacks[0])
    );

    expect(game.player1.active.specialConditions).not.toContain(SpecialCondition.BURNED);
    expect(game.player2.active.specialConditions).toContain(SpecialCondition.BURNED);
  });

  it('limits Windup Arm status immunity to the UseAttackEffect that it handles', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
        deck: padDeck(10)
      },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });
    const windupArm = new WindupArm();
    const attack = game.player1.active.getPokemonCard()!.attacks[0];
    const useAttackEffect = new UseAttackEffect(game.player1, attack);
    const attackEffect = new AttackEffect(game.player1, game.player2, attack);
    game.player1.active.tools.push(windupArm);

    windupArm.reduceEffect(game.store, game.state, useAttackEffect);
    windupArm.reduceEffect(game.store, game.state, attackEffect);

    expect((useAttackEffect as any).ignoreStatusConditions).toBe(true);
    expect((attackEffect as any).ignoreStatusConditions).toBeUndefined();
  });

  it('preserves incoming Active markers while clearing effects from the leaver', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        bench: [{ card: 'Manaphy BRS' }],
        deck: padDeck(10)
      },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });
    const leavingActive = game.player1.active;
    const incomingActive = game.player1.bench[0];
    const leavingCard = leavingActive.getPokemonCard()!;
    const incomingCard = incomingActive.getPokemonCard()!;
    leavingActive.marker.addMarker('leaver-effect', leavingCard, 'ability');
    incomingActive.marker.addMarker('incoming-effect', incomingCard, 'ability');

    game.player1.switchPokemon(incomingActive);

    expect(game.player1.active.marker.markers.some(marker => marker.name === 'incoming-effect')).toBe(true);
    expect(game.player1.bench[0].marker.markers).toEqual([]);
  });

  it('does not bench a Basic Fire Pokémon from hand for Chandelure Spirit Burner', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Chandelure UNM', energy: ['Fire Energy SVE'] },
        hand: ['Charmander MEW'],
        deck: padDeck(5)
      },
      player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) }
    });

    useAttack(game.store, game.state, 0, 'Spirit Burner');

    expect(game.player1.hand.cards.some(card => card.fullName === 'Charmander MEW')).toBe(true);
    expect(game.player1.bench.some(slot => slot.getPokemonCard()?.fullName === 'Charmander MEW')).toBe(false);
  });
});
