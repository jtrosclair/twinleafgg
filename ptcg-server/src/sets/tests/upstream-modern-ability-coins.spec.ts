import { GameLog } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { ChooseAttackPromptType } from '../../game/store/prompts/choose-attack-prompt';
import { ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../game/store/state/state';
import { endTurn, playTrainerCard, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PokemonSlotConfig, setupGame, SetupGameResult } from './test-helpers';

const fighting = 'Fighting Energy SVE';
const fire = 'Fire Energy SVE';
const grass = 'Grass Energy SVE';
const water = 'Water Energy SVE';
const psychic = 'Psychic Energy SVE';
const dark = 'Darkness Energy SVE';
const mew = 'Mew ex MEW';

const koraidon = { card: 'Koraidon TEF', energy: [fighting, fire, water] };
const glimmora = { card: 'Glimmora PAL', damage: 110 };
const fez = { card: 'Fezandipiti TWM', energy: [dark] };
const cinccino = 'Cinccino ex M4';

function duel(defender: PokemonSlotConfig, attacker = koraidon) {
  return setupGame({
    turn: 5,
    player1: { active: attacker, bench: [{ card: mew }], deck: padDeck(8) },
    player2: { active: defender, bench: [{ card: mew }], deck: padDeck(8) },
  });
}

function settleFlips(game: SetupGameResult, heads: boolean) {
  // A redundant random roll will land on the opposite side of the visible flip.
  spyOn(Math, 'random').and.returnValue(heads ? 0.9 : 0.1);
  const store = game.store;
  const reduce = store.reduceEffect.bind(store);
  const flips: CoinFlipEffect[] = [];
  spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    if (effect instanceof CoinFlipEffect) {
      flips.push(effect);
      effect.forcedResult = heads;
    }
    return reduce(state, effect);
  });
  return flips;
}

function coinLogs(state: State) {
  return state.logs.filter(log => log.message === GameLog.LOG_PLAYER_FLIPS_HEADS
    || log.message === GameLog.LOG_PLAYER_FLIPS_TAILS);
}

describe('Shattering Crystal', () => {
  for (const heads of [true, false]) {
    for (const checkup of [true, false]) {
      it(`uses the displayed ${heads ? 'heads' : 'tails'} after ${checkup ? 'Poison Checkup' : 'attack damage'}`, () => {
        const game = duel({ ...glimmora, damage: checkup ? 120 : 110 });
        const flips = settleFlips(game, heads);
        const { store, state, player1, player2 } = game;
        const startPrizes = player1.getPrizeLeft();
        if (checkup) {
          player2.active.addSpecialCondition(SpecialCondition.POISONED);
          endTurn(store, state);
        } else {
          useAttack(store, state, 0, 'Primordial Beatdown');
        }
        expect(flips.length).toBe(1);
        expect(flips[0].player).toBe(player2);
        expect(coinLogs(state).map(log => log.message)).toEqual([
          heads ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS,
        ]);
        expect(player2.discard.cards.some(card => card.fullName === glimmora.card)).toBe(true);
        expect(player1.getPrizeLeft()).toBe(startPrizes - (heads ? 0 : 1));
      });
    }
  }

  it('prevents all Prizes from the official Critical Bite interaction', () => {
    const game = duel(glimmora, { card: 'Crobat SIT', energy: [water, water, water] });
    const flips = settleFlips(game, true);
    const { store, state, player1, overridePrompt } = game;
    const startPrizes = player1.getPrizeLeft();
    overridePrompt(ChoosePokemonPromptType, () => [
      { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 },
    ]);
    useAttack(store, state, 0, 'Critical Bite');
    expect(flips.length).toBe(1);
    expect(player1.getPrizeLeft()).toBe(startPrizes);
  });
});

describe('modern attack damage prevention flips', () => {
  for (const card of [fez.card, cinccino, 'Cinccino ex M4 73', 'Cinccino ex FA CRI', 'Cinccino ex SIR CRI']) {
    for (const heads of [true, false]) {
      it(`${card} makes one defending flip and uses ${heads ? 'heads' : 'tails'}`, () => {
        const game = duel({ card, energy: card === fez.card ? [dark] : [] });
        const flips = settleFlips(game, heads);
        useAttack(game.store, game.state, 0, 'Primordial Beatdown');
        expect(flips.map(coin => coin.player.id)).toEqual([game.player2.id]);
        expect(coinLogs(game.state).length).toBe(1);
        expect(game.player2.active.damage).toBe(heads ? 0 : 30);
      });
    }
  }

  for (const defender of [fez, { card: cinccino }, { card: 'Cinccino ex M4 73' }]) {
    it(`Shred bypasses ${defender.card} without rolling an Ability coin`, () => {
      const game = duel(defender);
      const flips = settleFlips(game, true);
      useAttack(game.store, game.state, 0, 'Shred');
      expect(flips.length).toBe(0);
      expect(game.player2.discard.cards.some(card => card.fullName === defender.card)
        || game.player2.active.damage === 130).toBe(true);
    });
  }

  it('Smooth Coat does not flip after Rigid Band has reduced the damage to zero', () => {
    const game = duel({ card: cinccino, tools: ['Rigid Band MEW'] });
    const flips = settleFlips(game, true);
    useAttack(game.store, game.state, 0, 'Primordial Beatdown');
    expect(flips.length).toBe(0);
    expect(game.player2.active.damage).toBe(0);
  });

  it('Smooth Coat is suppressed by Team Rocket’s Watchtower on the defending side', () => {
    const game = duel({ card: cinccino });
    const flips = settleFlips(game, true);
    game.player1.stadium.cards.push(getCardByName("Team Rocket's Watchtower DRI"));
    useAttack(game.store, game.state, 0, 'Primordial Beatdown');
    expect(flips.length).toBe(0);
    expect(game.player2.active.damage).toBe(30);
  });

  for (const temple of [true, false]) {
    it(`Adrena-Pheromone checks Luminous Energy with Temple of Sinnoh ${temple ? 'present' : 'absent'}`, () => {
      const game = duel({ card: fez.card, energy: ['Luminous Energy PAL'] });
      const flips = settleFlips(game, true);
      if (temple) game.player1.stadium.cards.push(getCardByName('Temple of Sinnoh ASR'));
      useAttack(game.store, game.state, 0, 'Primordial Beatdown');
      expect(flips.length).toBe(temple ? 0 : 1);
      expect(game.player2.active.damage).toBe(temple ? 30 : 0);
    });
  }

  it('Crunch still discards the Dark Energy when Adrena-Pheromone prevents its damage', () => {
    const game = duel(fez, { card: 'Scream Tail ex TWM', energy: [psychic, water, water] });
    const flips = settleFlips(game, true);
    const energy = game.player2.active.energies.cards[0];
    game.overridePrompt(ChooseCardsPromptType, () => [game.player2.active.cards.indexOf(energy)]);
    useAttack(game.store, game.state, 0, 'Crunch');
    expect(flips.map(coin => coin.player.id)).toEqual([game.player2.id]);
    expect(game.player2.active.getPokemonCard()?.fullName).toBe(fez.card);
    expect(game.player2.active.damage).toBe(0);
    expect(game.player2.active.energies.cards.length).toBe(0);
    expect(game.player2.discard.cards.map(card => card.fullName)).toContain(dark);
  });

  for (const side of [0, 1]) {
    it(`Will chooses ${side === 0 ? 'heads' : 'tails'} when Earthquake damages its own Benched Fezandipiti`, () => {
      const { store, state, player1, player2, overridePrompt } = setupGame({
        turn: 5,
        player1: { active: { card: 'Diggersby M3', energy: [water] },
          bench: [fez], hand: ['Will CEC'], deck: padDeck(8) },
        player2: { active: { card: mew }, deck: padDeck(8) },
      });
      playTrainerCard(store, state, 0, 'Will CEC');
      overridePrompt('Select', prompt => {
        expect(prompt.playerId).toBe(player1.id);
        return side;
      });
      useAttack(store, state, 0, 'Earthquake');
      expect(player1.bench[0].damage).toBe(side === 0 ? 0 : 30);
      expect(player2.active.damage).toBe(140);
      expect(coinLogs(state).map(log => log.message)).toEqual([
        side === 0 ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS,
      ]);
    });
  }

  it('a copied Energy Feather counts the Energy of the copying attacker', () => {
    const game = duel({ card: fez.card, energy: [grass] }, { card: mew, energy: [psychic, water, water] });
    game.overridePrompt(ChooseAttackPromptType, () => ({ index: 0, attack: 'Energy Feather' }));
    useAttack(game.store, game.state, 0, 'Genome Hacking');
    expect(game.player2.active.damage).toBe(90);
  });
});
