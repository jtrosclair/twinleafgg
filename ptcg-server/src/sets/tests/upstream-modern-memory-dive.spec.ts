import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import { ChooseAttackPrompt, ChooseAttackPromptType } from '../../game/store/prompts/choose-attack-prompt';
import { endTurn, useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const fire = 'Fire Energy SVE';
const dark = 'Darkness Energy SVE';
const psychic = 'Psychic Energy SVE';
const relicanth = 'Relicanth TEF';
const feraligatr = 'Feraligatr TEF';
const totodile = 'Totodile TEF';
const croconaw = 'Croconaw TEF';
const incineroar = 'Incineroar ex TEF';
const torracat = 'Torracat TEF';
const litten = 'Litten TEF';
const mew = 'Mew ex MEW';

function board(player: PlayerConfig, opponent: PlayerConfig = { active: { card: mew } }) {
  const game = setupGame({
    turn: 5,
    player1: { ...player, deck: padDeck(10) },
    player2: { ...opponent, deck: padDeck(10) },
  });
  game.player2.active.getPokemonCard()!.hp = 500;
  return game;
}

function stack(game: ReturnType<typeof board>, ...cards: string[]) {
  const evolved = game.player1.active;
  evolved.cards.unshift(...cards.map(getCardByName));
  return evolved;
}

describe('Relicanth Memory Dive', () => {
  it('grants both previous attacks on a Stage 2 and never duplicates them with two Relicanth', () => {
    const { store, state, player1 } = board({
      active: { card: feraligatr, energy: [water] }, bench: [{ card: relicanth }, { card: relicanth }],
    });
    player1.active.cards.unshift(getCardByName(totodile), getCardByName(croconaw));
    const query = new CheckPokemonAttacksEffect(player1);
    store.reduceEffect(state, query);
    expect(query.attacks.map(attack => attack.name)).toEqual(['Big Bite', 'Reverse Thrust']);
    expect(player1.active.getPokemonCard()?.attacks.map(attack => attack.name)).toEqual(['Giant Wave']);
  });

  it('uses an inherited attack through the normal attack action after Rare Candy', () => {
    const game = board({ active: { card: feraligatr, energy: [water] }, bench: [{ card: relicanth }] });
    const active = stack(game, totodile);
    const physicalAttacker = active.getPokemonCard()!;
    useAbility(game.store, game.state, 0, 'Torrential Heart');
    useAttack(game.store, game.state, 0, 'Big Bite');
    expect(game.player2.active.damage).toBe(130);
    expect(game.store.state.playerLastAttack[game.player1.id].attack.name).toBe('Big Bite');
    expect(game.store.state.playerLastAttack[game.player1.id].sourceCard).toBe(physicalAttacker);
  });

  it('keeps the Ability selection path and lists only cards physically in the Active evolution stack', () => {
    const game = board({ active: { card: feraligatr, energy: [water] },
      bench: [{ card: relicanth }, { card: croconaw }] });
    stack(game, totodile);
    game.overridePrompt(ChooseAttackPromptType, prompt => {
      const choices = prompt as ChooseAttackPrompt;
      expect(choices.cards.map(card => card.fullName)).toEqual([totodile]);
      expect(choices.options.blocked).toEqual([]);
      return { index: 0, attack: 'Big Bite' };
    });
    useAbility(game.store, game.state, 0, 'Memory Dive');
    expect(game.player2.active.damage).toBe(10);
  });

  it('blocks the inherited attack when the evolved attacker lacks its printed Energy', () => {
    const game = board({ active: { card: feraligatr, energy: [dark] }, bench: [{ card: relicanth }] });
    stack(game, totodile);
    game.overridePrompt(ChooseAttackPromptType, prompt => {
      expect((prompt as ChooseAttackPrompt).options.blocked).toEqual([{ index: 0, attack: 'Big Bite' }]);
      return null;
    });
    useAbility(game.store, game.state, 0, 'Memory Dive');
    expect(game.state.activePlayer).toBe(0);
    expect(() => useAttack(game.store, game.state, 0, 'Big Bite'))
      .toThrow(new GameError(GameMessage.NOT_ENOUGH_ENERGY));
  });

  it('withholds attacks when Mischievous Lock suppresses Memory Dive', () => {
    const game = board({ active: { card: feraligatr, energy: [water] }, bench: [{ card: relicanth }] },
      { active: { card: 'Klefki SVI' } });
    stack(game, totodile);
    const query = new CheckPokemonAttacksEffect(game.player1);
    game.store.reduceEffect(game.state, query);
    expect(query.attacks).toEqual([]);
    expect(() => useAttack(game.store, game.state, 0, 'Big Bite'))
      .toThrow(new GameError(GameMessage.UNKNOWN_ATTACK));
  });

  it('does not grant the attack from a Relicanth in the discard pile or on the other side', () => {
    const game = board({ active: { card: feraligatr, energy: [water] }, discard: [relicanth] },
      { active: { card: relicanth } });
    stack(game, totodile);
    expect(() => useAttack(game.store, game.state, 0, 'Big Bite'))
      .toThrow(new GameError(GameMessage.UNKNOWN_ATTACK));
  });

  it('cannot attack with a move from a Benched evolution stack', () => {
    const game = board({ active: { card: mew, energy: [water] },
      bench: [{ card: relicanth }, { card: croconaw }] });
    game.player1.bench[1].cards.unshift(getCardByName(totodile));
    expect(() => useAttack(game.store, game.state, 0, 'Big Bite'))
      .toThrow(new GameError(GameMessage.UNKNOWN_ATTACK));
  });

  it('grants Memory Dive from the registered illustration rare', () => {
    const game = board({ active: { card: croconaw, energy: [water] }, bench: [{ card: 'RelicanthIR TEF' }] });
    stack(game, totodile);
    useAttack(game.store, game.state, 0, 'Big Bite');
    expect(game.player2.active.damage).toBe(10);
  });

  it('does not invent an evolution source for a saved board with only the Stage 2', () => {
    const game = board({ active: { card: feraligatr, energy: [water] }, bench: [{ card: relicanth }] });
    expect(() => useAbility(game.store, game.state, 0, 'Memory Dive'))
      .toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
    const query = new CheckPokemonAttacksEffect(game.store.state.players[0]);
    game.store.reduceEffect(game.store.state, query);
    expect(query.attacks).toEqual([]);
  });

  it('Genome Hacking offers the opposing Pokémon’s printed moves while Memory Dive is active', () => {
    const game = board({ active: { card: mew, energy: [psychic, water, water] } },
      { active: { card: feraligatr }, bench: [{ card: relicanth }] });
    game.player2.active.cards.unshift(getCardByName(totodile));
    game.overridePrompt(ChooseAttackPromptType, prompt => {
      const choices = prompt as ChooseAttackPrompt;
      expect(choices.cards[0].attacks.map(attack => attack.name)).toEqual(['Giant Wave']);
      return { index: 0, attack: 'Giant Wave' };
    });
    useAttack(game.store, game.state, 0, 'Genome Hacking');
    expect(game.player2.active.damage).toBe(160);
  });

  it('applies Hustle Play and the inherited attack’s next-turn lock to Incineroar', () => {
    const game = board({ active: { card: incineroar, energy: [fire] }, bench: [{ card: relicanth }] },
      { active: { card: mew }, bench: [{ card: mew }, { card: mew }] });
    stack(game, litten, torracat);
    game.overridePrompt(ChooseAttackPromptType, prompt => {
      expect((prompt as ChooseAttackPrompt).options.blocked).toEqual([]);
      return { index: 1, attack: 'Flare Strike' };
    });
    useAbility(game.store, game.state, 0, 'Memory Dive');
    expect(game.player2.active.damage).toBe(80);
    endTurn(game.store, game.store.state);
    expect(() => useAttack(game.store, game.store.state, 0, 'Flare Strike'))
      .toThrow(new GameError(GameMessage.BLOCKED_BY_EFFECT));
  });

  it('Hustle Play cannot discount the Fire symbol on the inherited Fake Out', () => {
    const game = board({ active: { card: incineroar, energy: [water] }, bench: [{ card: relicanth }] },
      { active: { card: mew }, bench: [{ card: mew }, { card: mew }] });
    stack(game, litten, torracat);
    expect(() => useAttack(game.store, game.state, 0, 'Fake Out'))
      .toThrow(new GameError(GameMessage.NOT_ENOUGH_ENERGY));
  });
});
