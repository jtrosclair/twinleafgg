import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { GamePhase } from '../../game/store/state/state';
import { getCardByName, padDeck, PokemonSlotConfig, setupGame } from './test-helpers';
import { playTrainerCard, useAttack } from './card-test-helpers';

const giovanni = "Giovanni's Charisma MEW";
const mew = 'Mew ex MEW';
const rhyperior = 'Rhyperior SCR';
const milotic = 'Milotic TWM';
const water = 'Water Energy SVE';
const psychic = 'Psychic Energy SVE';
const grass = 'Grass Energy SVE';
const fire = 'Fire Energy SVE';
const metal = 'Metal Energy SVE';
const peak = 'Path to the Peak CRE';
const salamence = 'Salamence LV.X AR';
const bench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };

function charisma(defender: PokemonSlotConfig, benchCard?: string, hand = [water]) {
  return setupGame({
    turn: 5,
    player1: { active: { card: mew }, hand: [giovanni, ...hand],
      bench: benchCard && benchCard !== 'Garbodor DRX' ? [{ card: benchCard }] : [], deck: padDeck(10) },
    player2: { active: defender, bench: benchCard === 'Garbodor DRX' ? [{ card: benchCard }] : [], deck: padDeck(10) }
  });
}

describe("Giovanni's Charisma", () => {
  for (const protection of [rhyperior, milotic, 'Mr. Mime TEU']) {
    it(`resolves without either move under ${protection}`, () => {
      const active = protection === rhyperior ? rhyperior : mew;
      const game = charisma({ card: active, damage: 20, energy: [fire] }, protection === rhyperior ? undefined : protection);
      const returned = game.player2.active.energies.cards[0];
      const attempted = game.player1.hand.cards[1];
      playTrainerCard(game.store, game.state, 0, giovanni);
      expect(game.player2.active.cards).toContain(returned);
      expect(game.player2.hand.cards).not.toContain(returned);
      expect(game.player1.hand.cards).toContain(attempted);
      expect(game.player1.active.cards).not.toContain(attempted);
      expect(game.player1.discard.cards.map(card => card.fullName)).toContain(giovanni);
      expect(game.player1.supporterTurn).toBe(1);
    });
  }

  it("resolves both moves when Garbotoxin removes Wide Wall", () => {
    const game = charisma({ card: rhyperior, energy: [fire] }, 'Garbodor DRX');
    const garbodor = game.player2.bench[0];
    const tool = getCardByName('Bravery Charm PAL');
    garbodor.cards.push(tool);
    garbodor.tools.push(tool);
    const returned = game.player2.active.energies.cards[0];
    const own = game.player1.hand.cards[1];
    game.overridePrompt('Attach energy', prompt => {
      expect((prompt as AttachEnergyPrompt).options.min).toBe(1);
      return [{ to: ownActive, index: game.player1.hand.cards.indexOf(own) }];
    });
    game.player1.energyPlayedTurn = game.state.turn;
    playTrainerCard(game.store, game.state, 0, giovanni);
    expect(game.player2.hand.cards).toContain(returned);
    expect(game.player2.active.energies.cards).not.toContain(returned);
    expect(game.player1.active.energies.cards).toContain(own);
  });

  it("returns a legacy attachment when the player's hand has no Energy", () => {
    const game = charisma({ card: mew, energy: [fire] }, undefined, []);
    const slot = game.player2.active;
    const energy = slot.energies.cards[0];
    slot.cards.splice(slot.cards.indexOf(energy), 1);
    playTrainerCard(game.store, game.state, 0, giovanni);
    expect(game.player2.hand.cards).toContain(energy);
    expect(slot.energies.cards).toEqual([]);
    expect(game.state.prompts.some(prompt => prompt.type === 'Attach energy')).toBe(false);
  });

  it('returns the opposing Energy even when Aurora Energy cannot pay its attachment cost', () => {
    const game = charisma({ card: mew, energy: [fire] }, undefined, ['Aurora Energy SSH']);
    const returned = game.player2.active.energies.cards[0];
    const aurora = game.player1.hand.cards[1];
    playTrainerCard(game.store, game.state, 0, giovanni);
    expect(game.player2.hand.cards).toContain(returned);
    expect(game.player1.hand.cards).toContain(aurora);
    expect(game.state.prompts.some(prompt => prompt.type === 'Attach energy')).toBe(false);
  });

  it('rejects the play without spending the Supporter when the opposing Active has no Energy', () => {
    const game = charisma({ card: mew });
    expect(() => playTrainerCard(game.store, game.state, 0, giovanni))
      .toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(game.player1.hand.cards[0].fullName).toBe(giovanni);
    expect(game.player1.supporterTurn).toBe(0);
  });
});

describe('attack protection based on the source Pokémon’s Abilities', () => {
  const variants = [
    { card: 'Simisage PAR', energy: [grass, water, water], attack: 'Arm Thrust Needle' },
    { card: 'Deoxys M4 33', energy: [psychic, psychic, water], attack: 'Psy Protect' },
    { card: 'Deoxys M4 33 33', energy: [psychic, psychic, water], attack: 'Psy Protection' },
    { card: 'Melmetal FST 189', energy: [metal, water, water], attack: 'Ingot Swing' },
  ];
  for (const entry of variants) {
    for (const path of [false, true]) {
      it(`${entry.attack} ${path ? 'allows damage when Path to the Peak removes Crimson Armor' : 'blocks damage while Crimson Armor is present'}`, () => {
        const game = setupGame({
          turn: 5,
          player1: { active: entry, deck: padDeck(10) },
          player2: { active: { card: 'Armarouge ex PAR', energy: [water, water], damage: 10 }, deck: padDeck(8) }
        });
        if (path) game.player2.stadium.cards.push(getCardByName(peak));
        useAttack(game.store, game.state, 0, entry.attack);
        useAttack(game.store, game.state, 1, 'Scorching Bazooka');
        expect(game.player1.active.damage > 0).toBe(path);
      });
    }
  }

  it('recognizes another Simisage as the printed exception even while its Ability is present', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Simisage PAR', energy: [grass, water, water] }, deck: padDeck(10) },
      player2: { active: { card: 'Simisage PAR', energy: [grass, water, water] }, deck: padDeck(8) }
    });
    game.player2.active.getPokemonCard()!.hp = 200;
    game.player1.active.getPokemonCard()!.hp = 200;
    useAttack(game.store, game.state, 0, 'Arm Thrust Needle');
    useAttack(game.store, game.state, 1, 'Arm Thrust Needle');
    expect(game.player1.active.damage).toBe(100);
  });

  it('Monkey Trio removes the Colorless cost from a Technical Machine attack', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Simisage PAR', tools: ['Technical Machine: Blindside PAR'] },
        bench: [{ card: 'Simisear NXD' }, { card: 'Simipour PAR' }], deck: padDeck(10) },
      player2: { active: { card: mew }, deck: padDeck(8) }
    });
    const tool = game.player1.active.tools[0];
    const cost = new CheckAttackCostEffect(game.player1, (tool as TrainerCard).attacks[0]);
    game.store.reduceEffect(game.state, cost);
    expect(cost.cost).toEqual([]);
  });
});

describe('Salamence LV.X Double Fall', () => {
  it('awards an extra Prize for each opposing Knock Out from its inherited Shoot Through attack', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Salamence AR', energy: [fire, water, psychic] }, hand: [salamence], deck: padDeck(10) },
      player2: { active: { card: 'Pidgey MEW', damage: 40 },
        bench: [{ card: 'Pidgey MEW', damage: 40 }, { card: mew }], deck: padDeck(8) }
    });
    game.overridePrompt('Confirm', () => true);
    game.store.dispatch(new PlayCardAction(game.player1.id, 0, ownActive));
    expect(game.player1.active.getPokemonCard()?.fullName).toBe(salamence);
    game.overridePrompt('Choose pokemon', () => [bench]);
    useAttack(game.store, game.state, 0, 'Shoot Through');
    expect(game.player1.getPrizeLeft()).toBe(2);
    expect(game.player1.marker.hasMarker('DOUBLE_FALL_MARKER')).toBe(false);
  });

  it('attributes each Prize only to damage recorded against that Pokémon', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: salamence }, deck: padDeck(10) },
      player2: { active: { card: mew }, bench: [{ card: 'Pidgey MEW' }], deck: padDeck(8) }
    });
    const source = game.player1.active.getPokemonCard()!;
    const attack = new AttackEffect(game.player1, game.player2, source.attacks[0]);
    game.state.phase = GamePhase.ATTACK;
    game.player1.marker.addMarker('DOUBLE_FALL_MARKER', source);
    game.store.reduceEffect(game.state, new PutDamageEffect(attack, 20));
    const counters = new PutCountersEffect(attack, 60);
    counters.target = game.player2.bench[0];
    game.store.reduceEffect(game.state, counters);
    const before = new KnockOutEffect(game.player2, game.player2.bench[0], true);
    game.store.reduceEffect(game.state, before);
    expect(before.prizeCount).toBe(1);
  });
});
