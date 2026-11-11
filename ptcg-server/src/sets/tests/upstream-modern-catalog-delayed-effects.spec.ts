import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { playTrainerCard, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

describe('Upstream delayed attack effects in batch 12', () => {
  it('places Pachirisu damage counters when the opponent attaches Energy from hand to the Defending Pokémon', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Pachirisu MEG', energy: ['Lightning Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, hand: ['Lightning Energy SVE'], deck: padDeck(10) },
    });
    const energy = g.player2.hand.cards[0] as EnergyCard;
    useAttack(g.store, g.state, 0, 'Electrified Incisors');
    expect(g.player2.active.pendingEnergyAttachDamageCounters?.damage).toBe(80);
    expect(g.state.activePlayer).toBe(1);
    g.store.reduceEffect(g.state, new AttachEnergyEffect(g.player2, energy, g.player2.active));
    expect(g.player2.active.damage).toBe(90);
    expect(g.player2.active.energies.cards).toContain(energy);
  });

  it('retaliates with damage counters when Iron Boulder ex is damaged during the opponent next turn', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Iron Boulder ex TEF', energy: ['Fighting Energy SVE', 'Metal Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) },
    });
    useAttack(g.store, g.state, 0, 'Repulsor Axe');
    expect(g.player1.active.retaliateOnDamageNextTurn?.damage).toBe(80);
    expect(g.state.activePlayer).toBe(1);
    const damageBeforeRetaliation = g.player2.active.damage;
    expect(damageBeforeRetaliation).toBeGreaterThan(0);
    const attack = new AttackEffect(g.player2, g.player1, {
      name: 'Test Hit', cost: [], damage: 40, text: '',
    });
    attack.source = g.player2.active;
    const damage = new PutDamageEffect(attack, 40);
    damage.target = g.player1.active;
    g.store.reduceEffect(g.state, damage);
    expect(g.player1.active.damage).toBe(40);
    expect(g.player2.active.damage).toBe(damageBeforeRetaliation + 80);
  });

  it('keeps Lucian drawing after each player puts their hand at the bottom of their deck', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Mew ex MEW' }, hand: ['Lucian TWM', 'Lightning Energy SVE'], deck: padDeck(8) },
      player2: { active: { card: 'Mew ex MEW' }, hand: ['Lightning Energy SVE'], deck: padDeck(8) },
    });
    playTrainerCard(g.store, g.state, 0, 'Lucian TWM');
    expect(g.player1.hand.cards.length).toBeGreaterThan(0);
    expect(g.player2.hand.cards.length).toBeGreaterThan(0);
  });
});
