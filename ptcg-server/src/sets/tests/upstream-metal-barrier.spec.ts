import { ensureClientCards } from '../../client/cards';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { compactSerializedState } from '../../game/serializer/compact-state';
import { PassTurnAction } from '../../game/store/actions/game-actions';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const metal = 'Arceus Metal AR';
const gallade = 'Gallade E4 LV.X RR';
const magnezone = 'Magnezone LV.X LA';
const mismagius = 'Mismagius GL LV.X RR';
const metalCost = ['Metal Energy SVE', 'Water Energy SVE', 'Water Energy SVE'];
const ownActive: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const psychicCost = ['Psychic Energy SVE', 'Water Energy SVE', 'Water Energy SVE'];

function game(active: PlayerConfig['active'], options: Partial<PlayerConfig> = {}, copy = false) {
  return setupGame({
    turn: 5,
    player1: {
      active: { card: copy ? 'Mew ex 30C' : metal, energy: metalCost },
      bench: [{ card: copy ? metal : 'Arceus V BRS' }],
      deck: padDeck(16),
    },
    player2: { active, deck: padDeck(16), ...options },
  });
}

describe('Arceus AR9 Metal Barrier', () => {
  beforeAll(ensureClientCards);

  it('deals 40 and allows an ordinary reply to damage and Confuse Arceus', () => {
    const g = game({ card: 'Arceus Psychic AR', energy: psychicCost });
    useAttack(g.store, g.state, 0, 'Metal Barrier');
    expect(g.player2.active.damage).toBe(40);

    useAttack(g.store, g.state, 1, 'Mind Bend');
    expect(g.player1.active.damage).toBe(20);
    expect(g.player1.active.specialConditions).toContain(SpecialCondition.CONFUSED);
    g.store.cleanup();
  });

  it('blocks damage and confusion when a real Level-Up uses its inherited Mind Bend', () => {
    const g = game({ card: 'Arceus Psychic AR', energy: psychicCost }, { hand: ['Arceus LV.X 2 AR'] });
    const leveledUp = g.player2.hand.cards[0];
    useAttack(g.store, g.state, 0, 'Metal Barrier');
    g.store.dispatch(new PlayCardAction(g.player2.id, 0, ownActive));
    expect(g.player2.active.cards).toContain(leveledUp);

    useAttack(g.store, g.state, 1, 'Mind Bend');
    expect(g.player1.active.damage).toBe(0);
    expect(g.player1.active.specialConditions).not.toContain(SpecialCondition.CONFUSED);
    g.store.cleanup();
  });

  it('blocks Aimed Cut once and expires even when the defending Arceus stays Active', () => {
    const g = game({ card: gallade, energy: psychicCost });
    useAttack(g.store, g.state, 0, 'Metal Barrier');
    useAttack(g.store, g.state, 1, 'Aimed Cut');
    expect(g.player1.active.damage).toBe(0);

    g.store.dispatch(new PassTurnAction(g.player1.id));
    useAttack(g.store, g.state, 1, 'Aimed Cut');
    expect(g.player1.active.damage).toBe(20);
    g.store.cleanup();
  });

  it('blocks Cyber Shock damage and Paralysis while Magnezone still discards its own Energy', () => {
    const g = game({ card: magnezone, energy: ['Lightning Energy SVE', 'Metal Energy SVE'] });
    const energy = g.player2.active.energies.cards.slice();
    useAttack(g.store, g.state, 0, 'Metal Barrier');
    useAttack(g.store, g.state, 1, 'Cyber Shock');

    expect(g.player1.active.damage).toBe(0);
    expect(g.player1.active.specialConditions).not.toContain(SpecialCondition.PARALYZED);
    expect(energy.length).toBe(2);
    expect(g.player2.discard.cards).toEqual(jasmine.arrayContaining(energy));
    g.store.cleanup();
  });

  it('blocks Darkness Magic damage counters only on the protected turn', () => {
    const g = game({ card: mismagius, energy: ['Psychic Energy SVE', ...psychicCost.slice(0, 2)] },
      { hand: ['Nest Ball SVI', 'Switch SVI'] });
    useAttack(g.store, g.state, 0, 'Metal Barrier');
    useAttack(g.store, g.state, 1, 'Darkness Magic');
    expect(g.player1.active.damage).toBe(0);

    g.store.dispatch(new PassTurnAction(g.player1.id));
    const expected = g.player2.hand.cards.length * 10;
    expect(expected).toBeGreaterThan(0);
    useAttack(g.store, g.state, 1, 'Darkness Magic');
    expect(g.player1.active.damage).toBe(expected);
    g.store.cleanup();
  });

  it('is cleared by a real opposing switch before a Benched attack', () => {
    const g = game({
      card: 'Palkia G LV.X PL',
      energy: padDeck(4, 'Water Energy SVE'),
    }, { hand: ['Boss\'s Orders PAL'] });
    const arceus = g.player1.active;
    const benchChoice: CardTarget = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
    g.overridePrompt('Choose pokemon', () => [benchChoice]);

    useAttack(g.store, g.state, 0, 'Metal Barrier');
    playTrainerCard(g.store, g.state, 1, 'Boss\'s Orders PAL');
    expect(g.player1.bench[0]).toBe(arceus);
    useAttack(g.store, g.state, 1, 'Hydro Shot');
    expect(arceus.damage).toBe(80);
    g.store.cleanup();
  });

  it('does not block a real Ability that Poisons Arceus during the protected turn', () => {
    const g = game({ card: gallade, energy: psychicCost },
      { bench: [{ card: 'Brute Bonnet PAR', tools: ['Ancient Booster Energy Capsule PAR'] }] });
    useAttack(g.store, g.state, 0, 'Metal Barrier');
    useAbility(g.store, g.state, 1, 'Toxic Powder');
    expect(g.player1.active.specialConditions).toContain(SpecialCondition.POISONED);
    g.store.cleanup();
  });

  it('protects the copier and leaves the printed source on the Bench unprotected', () => {
    const g = game({ card: gallade, energy: psychicCost }, {}, true);
    g.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Metal Barrier' }));
    useAbility(g.store, g.state, 0, 'Memory Helix');
    expect(g.player2.active.damage).toBe(70);

    useAttack(g.store, g.state, 1, 'Aimed Cut');
    expect(g.player1.active.damage).toBe(0);
    expect(g.player1.bench[0].preventDamageNextTurn).toBe(false);
    g.store.cleanup();
  });

  it('keeps filtered protection when a compact mid-turn state is restored', () => {
    const g = game({ card: gallade, energy: psychicCost });
    useAttack(g.store, g.state, 0, 'Metal Barrier');

    const cards = new Set(g.state.players.flatMap(player => [
      player.active, ...player.bench, player.deck, player.hand, player.discard,
      player.stadium, player.supporter, player.lostzone, ...player.prizes,
    ].flatMap(zone => zone.cards)));
    const physicalCards = Array.from(cards);
    physicalCards.forEach((card, id) => { card.id = id; });
    g.state.cardNames = physicalCards.map(card => card.fullName);
    const serializer = new StateSerializer();
    const restored = serializer.deserialize(compactSerializedState(serializer.serialize(g.state)));
    g.store.restoreState(restored);

    const attack = new AttackEffect(restored.players[1], restored.players[0], { name: 'Probe', cost: [], damage: 10, text: '' });
    const damage = new DealDamageEffect(attack, 10);
    const status = new AddSpecialConditionsEffect(attack, [SpecialCondition.CONFUSED]);
    g.store.reduceEffect(restored, damage);
    g.store.reduceEffect(restored, status);
    expect(damage.preventDefault).toBe(true);
    expect(status.preventDefault).toBe(true);

    // A real Basic replacement must bypass both restored filters.
    const replacement = getCardByName('Rookidee SSH');
    restored.players[1].active.cards = [replacement];
    const ordinary = new DealDamageEffect(attack, 10);
    const ordinaryStatus = new AddSpecialConditionsEffect(attack, [SpecialCondition.CONFUSED]);
    g.store.reduceEffect(restored, ordinary);
    g.store.reduceEffect(restored, ordinaryStatus);
    expect(ordinary.preventDefault).toBe(false);
    expect(ordinaryStatus.preventDefault).toBe(false);
    g.store.cleanup();
  });
});

describe('Clefable BKP Moon Barrier', () => {
  beforeAll(ensureClientCards);

  function moonBarrierGame(active: PlayerConfig['active']) {
    return setupGame({
      turn: 5,
      player1: {
        active: { card: 'Clefable BKP', energy: ['Fairy Energy XY'] },
        bench: [{ card: 'Arceus V BRS' }],
        deck: padDeck(16),
      },
      player2: { active, deck: padDeck(16) },
    });
  }

  it('stops Severe Poison and its stronger Checkup damage for one turn', () => {
    const g = moonBarrierGame({ card: 'Dragalge BKP', energy: ['Psychic Energy SVE'] });
    useAttack(g.store, g.state, 0, 'Moon Barrier');
    expect(g.player2.active.damage).toBe(60);

    useAttack(g.store, g.state, 1, 'Severe Poison');
    expect(g.player1.active.specialConditions).not.toContain(SpecialCondition.POISONED);
    expect(g.player1.active.poisonDamage).toBe(10);
    expect(g.player1.active.damage).toBe(0);

    g.store.dispatch(new PassTurnAction(g.player1.id));
    useAttack(g.store, g.state, 1, 'Severe Poison');
    expect(g.player1.active.specialConditions).toContain(SpecialCondition.POISONED);
    expect(g.player1.active.damage).toBe(40);
    g.store.cleanup();
  });

  it('allows a non-Dragon attacker to damage and Confuse Clefable', () => {
    const g = moonBarrierGame({ card: 'Arceus Psychic AR', energy: psychicCost });
    useAttack(g.store, g.state, 0, 'Moon Barrier');

    useAttack(g.store, g.state, 1, 'Mind Bend');
    expect(g.player1.active.damage).toBe(40);
    expect(g.player1.active.specialConditions).toContain(SpecialCondition.CONFUSED);
    g.store.cleanup();
  });

  it('allows the printed damage from N’s Zekrom’s Shred', () => {
    const g = moonBarrierGame({ card: 'N\'s Zekrom M2a', energy: padDeck(3) });
    useAttack(g.store, g.state, 0, 'Moon Barrier');

    useAttack(g.store, g.state, 1, 'Shred');
    expect(g.player1.active.damage).toBe(70);
    g.store.cleanup();
  });
});
