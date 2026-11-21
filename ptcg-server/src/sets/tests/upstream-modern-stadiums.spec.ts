import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { UseStadiumAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { CheckHpEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { ChoosePokemonPrompt, ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { endTurn, playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const moonTeam = [{ card: 'Lunatone OBF' }, { card: 'Solrock M1L' }];
const water = 'Water Energy SVE';
const psychic = 'Psychic Energy SVE';
const fire = 'Fire Energy SVE';
const dark = 'Darkness Energy SVE';
const rellor = 'Rellor TEF';
const mew = 'Mew ex MEW';
const zone = 'Neutralization Zone SFA';
const chooseOpposingBench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
const chooseOwnActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };

function start(stadium: string, own: Partial<PlayerConfig> = {}, opponent: Partial<PlayerConfig> = {}) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: rellor }, deck: padDeck(12), ...own },
    player2: { active: { card: mew }, deck: padDeck(12), ...opponent },
  });
  game.player2.stadium.cards.push(getCardByName(stadium));
  return game;
}

function useStadium(game: ReturnType<typeof start>) {
  game.store.dispatch(new UseStadiumAction(game.player1.id));
}

describe('New Moon and modern Stadiums', () => {
  for (const [stadium, active, attack] of [
    ['Pokémon League Headquarters OBF', { card: rellor, energy: [water] }, 'Slight Intrusion'],
    ['Night Mine M2a', { card: 'Charizard ex OBF', energy: [fire, fire] }, 'Burning Darkness'],
  ] as const) {
    it(`keeps the printed Energy cost under ${stadium} for the Pokémon protected by New Moon`, () => {
      const configuredActive = { card: active.card, energy: [...active.energy] };
      const unprotected = start(stadium, { active: configuredActive });
      expect(() => useAttack(unprotected.store, unprotected.state, 0, attack))
        .toThrow(new GameError(GameMessage.NOT_ENOUGH_ENERGY));
      const protectedGame = start(stadium, { active: configuredActive, bench: moonTeam });
      expect(() => useAttack(protectedGame.store, protectedGame.state, 0, attack)).not.toThrow();
    });
  }

  it('ignores N’s Castle when New Moon protects the Pokémon that would retreat', () => {
    const game = start("N's Castle JTG", { active: { card: "N's Zoroark ex JTG" }, bench: moonTeam });
    const query = new CheckRetreatCostEffect(game.player1);
    game.store.reduceEffect(game.state, query);
    expect(query.cost).toEqual(game.player1.active.getPokemonCard()!.retreat);
  });

  it('ignores Calamitous Wasteland on a protected Basic', () => {
    const game = start('Calamitous Wasteland PAL', { bench: moonTeam });
    const query = new CheckRetreatCostEffect(game.player1);
    game.store.reduceEffect(game.state, query);
    expect(query.cost).toEqual(game.player1.active.getPokemonCard()!.retreat);
  });

  it('prevents Calamitous Snowy Mountain counters from a normal hand attachment', () => {
    const game = start('Calamitous Snowy Mountain PAL', { bench: moonTeam, hand: [water] });
    game.store.dispatch(new PlayCardAction(game.player1.id, 0, chooseOwnActive));
    expect(game.player1.active.getPokemons().length).toBe(1);
    expect(game.player1.active.damage).toBe(0);
  });

  for (const [stadium, card, adjustment] of [
    ['Exciting Stadium SSP', rellor, 30],
    ['Gravity Mountain SSP', 'Charizard ex OBF', -30],
  ] as const) {
    it(`applies ${stadium} to the unprotected side only`, () => {
      const game = start(stadium, { active: { card }, bench: moonTeam }, { active: { card } });
      const baseHp = game.player1.active.getPokemonCard()!.hp;
      for (const player of [game.player1, game.player2]) {
        const hp = new CheckHpEffect(player, player.active);
        game.store.reduceEffect(game.state, hp);
        expect(hp.hp).toBe(baseHp + (player === game.player2 ? adjustment : 0));
      }
    });
  }

  it('keeps the ordinary poison counter instead of adding Perilous Jungle counters', () => {
    const game = start('Perilous Jungle TEF', { bench: moonTeam });
    game.player1.active.specialConditions = [SpecialCondition.POISONED];
    game.player2.active.specialConditions = [SpecialCondition.POISONED];
    endTurn(game.store, game.state);
    expect(game.player1.active.damage).toBe(10);
    expect(game.player2.active.damage).toBe(30);
  });

  it('lets a protected Colorless Pokémon use its Ability under Team Rocket’s Watchtower', () => {
    const game = start("Team Rocket's Watchtower DRI", {
      active: { card: 'Squawkabilly ex PAL' }, bench: moonTeam,
    });
    game.state.turn = 1;
    expect(() => useAbility(game.store, game.state, 0, 'Squawk and Seize')).not.toThrow();
    expect(game.player1.hand.cards.length).toBe(6);
  });

  it('applies the Practice Studio bonus before Weakness to an unprotected attacker only', () => {
    for (const protectedAttacker of [false, true]) {
      const game = start('Practice Studio PAL',
        { active: { card: 'Croconaw TEF', energy: [water, water] }, bench: protectedAttacker ? moonTeam : [] },
        { active: { card: 'Charmander OBF' } });
      game.player2.active.getPokemonCard()!.hp = 500;
      useAttack(game.store, game.state, 0, 'Reverse Thrust');
      expect(game.player2.active.damage).toBe(protectedAttacker ? 60 : 80);
    }
  });

  it('applies Neutralization Zone to an ordinary non-Rule Box target but New Moon overrides it', () => {
    for (const protectedTarget of [false, true]) {
      const game = start(zone, { active: { card: 'Wellspring Mask Ogerpon ex TWM', energy: [water] } },
        { active: { card: rellor }, bench: protectedTarget ? moonTeam : [] });
      useAttack(game.store, game.state, 0, 'Sob');
      expect(game.player2.active.damage).toBe(protectedTarget ? 20 : 0);
      expect(game.player2.active.marker.markers.length).toBeGreaterThan(0);
    }
  });

  it('Neutralization Zone still stops Calamity Storm damage when that attack discards it', () => {
    for (const protectedTarget of [false, true]) {
      const game = start(zone, { active: { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] } },
        { active: { card: rellor }, bench: protectedTarget ? moonTeam : [] });
      game.player2.active.getPokemonCard()!.hp = 500;
      game.overridePrompt('Confirm', () => true);
      useAttack(game.store, game.state, 0, 'Calamity Storm');
      expect(game.player2.active.damage).toBe(protectedTarget ? 220 : 0);
      expect(game.player2.discard.cards.map(card => card.fullName)).toContain(zone);
    }
  });

  it('does not recover Neutralization Zone from discard when moving multiple cards', () => {
    const game = start('Beach Court SVI', { discard: [zone, water, psychic] });
    const { store, state, player1 } = game;
    store.reduceEffect(state, new MoveCardsEffect(player1.discard, player1.hand, { count: 2 }));
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([zone, psychic]);
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([water]);
  });

  for (const stadium of ['Granite Cave DRI', 'Full Metal Lab TEF']) {
    it(`${stadium} reduces damage only on the side without New Moon`, () => {
      for (const protectedTarget of [false, true]) {
        const game = start(stadium, { active: { card: 'Wellspring Mask Ogerpon ex TWM', energy: [water] } },
          { active: { card: "Steven's Metang DRI" }, bench: protectedTarget ? moonTeam : [] });
        useAttack(game.store, game.state, 0, 'Sob');
        expect(game.player2.active.damage).toBe(protectedTarget ? 20 : 0);
      }
    });
  }

  it('Postwick does not boost the opposing Active hit when the Hop Pokémon has New Moon', () => {
    for (const protectedAttacker of [false, true]) {
      const game = start('Postwick JTG', {
        active: { card: "Hop's Zacian ex JTG", energy: [water] }, bench: protectedAttacker ? moonTeam : [],
      }, { bench: [{ card: mew }] });
      game.overridePrompt('Choose Pokemon', () => [chooseOpposingBench]);
      useAttack(game.store, game.state, 0, 'Insta-Strike');
      expect(game.player2.active.damage).toBe(protectedAttacker ? 30 : 60);
      expect(game.player2.bench[0].damage).toBe(30);
    }
  });

  it('New Moon blocks Surfing Beach before choosing the new Active', () => {
    const game = start('Surfing Beach M1S', { active: { card: 'Totodile TEF' },
      bench: [{ card: 'Croconaw TEF' }, ...moonTeam] });
    expect(() => useStadium(game)).toThrow(new GameError(GameMessage.CANNOT_USE_STADIUM));
  });

  it('Surfing Beach offers only eligible Benched Pokémon when resolving the switch', () => {
    const initialWater = 'Totodile TEF';
    const own = { active: { card: initialWater }, bench: [{ card: 'Croconaw TEF' }, { card: rellor }] };
    const game = start('Surfing Beach M1S', own);
    const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
    game.overridePrompt(ChoosePokemonPromptType, targetPrompt => {
      const prompt = targetPrompt as ChoosePokemonPrompt;
      expect(prompt.validate([game.player1.active], game.state)).toBe(false);
      expect(prompt.validate([game.player1.bench[1]], game.state)).toBe(false);
      return [ownBench];
    });
    useStadium(game);
    expect(game.player1.active.getPokemonCard()?.fullName).toBe('Croconaw TEF');
    expect(game.player1.bench[0].getPokemonCard()?.fullName).toBe(initialWater);
  });

  it('New Moon blocks Battle Cage on the defending Bench', () => {
    const game = start('Battle Colosseum M2', {
      active: { card: rellor, damage: 40 }, bench: [{ card: 'Munkidori TWM', energy: [dark] }],
    }, { bench: [{ card: mew }, ...moonTeam] });
    game.overridePrompt('Remove damage', () => [{ from: chooseOwnActive, to: chooseOpposingBench }]);
    useAbility(game.store, game.state, 0, 'Adrena-Brain');
    expect(game.player1.active.damage).toBe(30);
    expect(game.player2.bench[0].damage).toBe(10);
  });

  it('Moonlit Hill discards a Basic Psychic Energy then heals 30 from each damaged Pokémon', () => {
    const game = start('Moonlit Hill PAF', { bench: [{ card: mew }], hand: [water, psychic] });
    game.player1.active.damage = 40;
    game.player1.bench[0].damage = 40;
    game.overridePrompt(ChooseCardsPromptType, prompt => {
      expect((prompt as ChooseCardsPrompt).filter).toEqual(jasmine.objectContaining({ name: 'Psychic Energy' }));
      return [1];
    });
    useStadium(game);
    expect(game.player1.hand.cards.map(card => card.fullName)).toEqual([water]);
    expect(game.player1.discard.cards.map(card => card.fullName)).toContain(psychic);
    expect([game.player1.active.damage, game.player1.bench[0].damage]).toEqual([10, 10]);
  });

  it('Moonlit Hill can be retried after canceling the discard choice', () => {
    const game = start('Moonlit Hill PAF', { hand: [psychic] });
    game.player1.active.damage = 40;
    game.overridePrompt(ChooseCardsPromptType, () => null);
    useStadium(game);
    expect(game.player1.stadiumUsedTurn).not.toBe(game.state.turn);
    expect(game.player1.active.damage).toBe(40);
    game.overridePrompt(ChooseCardsPromptType, () => [0]);
    useStadium(game);
    expect(game.player1.active.damage).toBe(10);
  });

  it('Celebration Fanfare heals the whole board before ending the turn once', () => {
    const game = start('Celebration Fanfare SVP', { bench: [{ card: mew }] });
    game.player1.active.damage = 30;
    game.player1.bench[0].damage = 20;
    useStadium(game);
    expect([game.player1.active.damage, game.player1.bench[0].damage]).toEqual([20, 10]);
    expect(game.state.activePlayer).toBe(1);
  });

  it('Community Center heals after a Supporter has been played from hand', () => {
    const game = start('Community Center TWM', { hand: ["Professor's Research SVI"] });
    game.player1.active.damage = 30;
    expect(() => useStadium(game)).toThrow(new GameError(GameMessage.CANNOT_USE_STADIUM));
    playTrainerCard(game.store, game.state, 0, "Professor's Research SVI");
    useStadium(game);
    expect(game.store.state.players[0].active.damage).toBe(20);
  });
});
