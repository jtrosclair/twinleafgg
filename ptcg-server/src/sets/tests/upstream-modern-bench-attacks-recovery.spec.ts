import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { SpecialCondition } from '../../game/store/card/card-types';
import { ChooseAttackPrompt, ChooseAttackPromptType } from '../../game/store/prompts/choose-attack-prompt';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const psi = 'Psychic Energy SVE';
const alakazam = 'Alakazam ex MEW';
const alakazamAttack = 'Dimensional Manipulation';
const mem = 'Mew ex 30C';
const mew = 'Mew ex MEW';
const dark = 'Darkness Energy SVE';
const rellor = 'Rellor TEF';
const headquarters = 'Pokémon League Headquarters OBF';
const mine = 'Night Mine M2a';
const zone = 'Neutralization Zone SFA';
const switchCard = 'Switch SVI';

function start(player1: PlayerConfig, options: { stadium?: string; opposingActive?: string } = {}) {
  const game = setupGame({ turn: 5, player1: { deck: padDeck(12), ...player1 },
    player2: { active: { card: options.opposingActive ?? mew }, deck: padDeck(12) } });
  game.player2.active.getPokemonCard()!.hp = 500;
  if (options.stadium) game.player2.stadium.cards.push(getCardByName(options.stadium));
  return game;
}

describe('Actual attacker for Bench attacks', () => {
  for (const [stadium, teammate] of [[headquarters, rellor], [mine, 'Charizard ex OBF']] as const) {
    it(`pays two Psychic Energy with Benched Alakazam under ${stadium}`, () => {
      const game = start({ active: { card: teammate }, bench: [{ card: alakazam, energy: [psi, psi] }] }, { stadium });
      useAttack(game.store, game.state, 0, alakazamAttack);
      expect(game.player2.active.damage).toBe(120);
      expect(game.player1.active.getPokemonCard()?.fullName).toBe(teammate);
    });
  }

  it('does not borrow Sparkling Crystal from the Active teammate', () => {
    const game = start({
      active: { card: 'Charizard ex OBF', tools: ['Sparkling Crystal SCR'], energy: [psi] },
      bench: [{ card: alakazam, energy: [psi] }],
    });
    expect(() => useAttack(game.store, game.state, 0, alakazamAttack))
      .toThrow(new GameError(GameMessage.NOT_ENOUGH_ENERGY));
  });

  for (const opposingActive of ['Espathra ex PAF', 'Seismitoad OBF']) {
    it(`does not charge a Benched attacker for ${opposingActive}'s Active-only Ability`, () => {
      const game = start({ active: { card: rellor }, bench: [{ card: alakazam, energy: [psi, psi] }] }, { opposingActive });
      useAttack(game.store, game.state, 0, alakazamAttack);
      expect(game.player2.active.damage).toBe(120);
    });
  }

  for (const condition of [SpecialCondition.ASLEEP, SpecialCondition.PARALYZED]) {
    it(`can use the Bench attack while the Active teammate has ${condition}`, () => {
      const game = start({ active: { card: rellor }, bench: [{ card: alakazam, energy: [psi, psi] }] });
      game.player1.active.specialConditions.push(condition);
      useAttack(game.store, game.state, 0, alakazamAttack);
      expect(game.player2.active.damage).toBe(120);
    });
  }

  it('continues to block an ordinary attack by a paralyzed Active Pokémon', () => {
    const game = start({ active: { card: alakazam, energy: [psi, psi] } });
    game.player1.active.specialConditions.push(SpecialCondition.PARALYZED);
    expect(() => useAttack(game.store, game.state, 0, alakazamAttack))
      .toThrow(new GameError(GameMessage.BLOCKED_BY_SPECIAL_CONDITION));
  });

  it('lets Benched Memory Helix copy Dimensional Hand and blocks Mind Jack', () => {
    const game = start({ active: { card: rellor }, bench: [{ card: mem, energy: [psi, psi] }, { card: alakazam }, { card: mew }] });
    game.overridePrompt(ChooseAttackPromptType, value => {
      const prompt = value as ChooseAttackPrompt;
      expect(prompt.cards.map(card => card.fullName)).toEqual([alakazam]);
      expect(prompt.options.blocked).toEqual([{ index: 0, attack: 'Mind Jack' }]);
      return { index: 0, attack: alakazamAttack };
    });
    useAbility(game.store, game.state, 0, 'Memory Helix');
    expect(game.player2.active.damage).toBe(120);
    expect(game.player1.active.getPokemonCard()?.fullName).toBe(rellor);
  });

  it('uses Basic Mew to calculate the copied Bench attack’s Stadium cost', () => {
    for (const energy of [[psi, psi], [psi, psi, dark]]) {
      const game = start({
        active: { card: 'Charizard ex OBF' }, bench: [{ card: mem, energy }, { card: alakazam }],
      }, { stadium: headquarters });
      game.overridePrompt(ChooseAttackPromptType, value => {
        const prompt = value as ChooseAttackPrompt;
        expect(prompt.options.blocked.some(option => option.attack === alakazamAttack)).toBe(energy.length === 2);
        return energy.length === 2 ? null : { index: 0, attack: alakazamAttack };
      });
      useAbility(game.store, game.state, 0, 'Memory Helix');
      expect(game.player2.active.damage).toBe(energy.length === 2 ? 0 : 120);
    }
  });

  it('does not open Memory Helix on the Bench when no source can attack from there', () => {
    const game = start({ active: { card: rellor }, bench: [{ card: mem, energy: [psi] }, { card: 'Dedenne SSP' }] });
    expect(() => useAbility(game.store, game.state, 0, 'Memory Helix'))
      .toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
  });
});

describe('Electromagnetic Sonar discard eligibility', () => {
  it('skips the choice when Neutralization Zone is the only discarded Trainer', () => {
    const game = start({ active: { card: 'Dedenne SSP', energy: [psi] }, discard: [zone, psi] });
    game.overridePrompt(ChooseCardsPromptType, () => {
      fail('There is no Trainer that can be put into hand');
      return [0];
    });
    useAttack(game.store, game.state, 0, 'Electromagnetic Sonar');
    expect(game.player1.discard.cards.map(card => card.fullName)).toContain(zone);
  });

  for (const copied of [false, true]) {
    it(`blocks the Stadium and requires the eligible Trainer when Sonar is ${copied ? 'copied' : 'used directly'}`, () => {
      const game = start({
        active: { card: copied ? mem : 'Dedenne SSP', energy: [psi] },
        bench: copied ? [{ card: 'Dedenne SSP' }] : [],
        discard: [switchCard, zone, psi],
      });
      game.overridePrompt(ChooseCardsPromptType, value => {
        const prompt = value as ChooseCardsPrompt;
        const restricted = prompt.cards.cards.find(card => card.fullName === zone)!;
        const eligible = prompt.cards.cards.findIndex(card => card.fullName === switchCard);
        expect(prompt.options.allowCancel).toBe(false);
        expect(prompt.validate([restricted])).toBe(false);
        expect(prompt.validate(prompt.decode([eligible]))).toBe(true);
        return [eligible];
      });
      if (copied) {
        game.overridePrompt(ChooseAttackPromptType, () => ({ index: 0, attack: 'Electromagnetic Sonar' }));
        useAbility(game.store, game.state, 0, 'Memory Helix');
      } else {
        useAttack(game.store, game.state, 0, 'Electromagnetic Sonar');
      }
      expect(game.player1.hand.cards.map(card => card.fullName)).toContain(switchCard);
      expect(game.player1.discard.cards.map(card => card.fullName)).toContain(zone);
    });
  }
});
