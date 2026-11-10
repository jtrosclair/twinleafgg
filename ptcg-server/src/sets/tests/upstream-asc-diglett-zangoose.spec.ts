import { CardTag, CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, MoveCardsEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { State, GamePhase } from '../../game/store/state/state';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

function rigFlips(game: ReturnType<typeof setupGame>, results: boolean[]) {
  const reduce = game.store.reduceEffect.bind(game.store);
  spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    if (effect instanceof CoinFlipEffect) {
      if (!results.length) throw new Error('Unexpected extra coin flip');
      effect.callback!(results.shift()!);
      return state;
    }
    return reduce(state, effect);
  });
}

describe('Ascended Heroes Diglett and Zangoose ex', () => {
  it('registers unique identities and their printed tags and statistics', () => {
    const diglett = getCardByName("Team Rocket's Diglett ASC") as PokemonCard;
    const zangoose = getCardByName('Zangoose ex ASC') as PokemonCard;
    expect([diglett.set, diglett.setNumber, diglett.hp, diglett.cardType]).toEqual(['ASC', '100', 60, CardType.FIGHTING]);
    expect(diglett.tags).toContain(CardTag.TEAM_ROCKET);
    expect([zangoose.set, zangoose.setNumber, zangoose.hp, zangoose.cardType]).toEqual(['ASC', '167', 200, CardType.COLORLESS]);
    expect(zangoose.tags).toContain(CardTag.POKEMON_ex);
  });
  for (const heads of [0, 1, 3, 7]) {
    it(`Relentless Burrowing discards the top ${heads} opposing cards after ${heads} heads`, () => {
      const game = setupGame({ turn: 2,
        player1: { active: { card: "Team Rocket's Diglett ASC", energy: ['Fighting Energy SVE'] }, deck: padDeck(10) },
        player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(4) }
      });
      const original = game.player2.deck.cards.slice();
      const flips = [...Array(heads).fill(true), false]; rigFlips(game, flips);
      const diglett = game.player1.active.getPokemonCard()!;
      game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, diglett.attacks[0]));
      expect(flips.length).toBe(0);
      expect(game.player2.discard.cards).toEqual(original.slice(0, heads));
      expect(game.player2.deck.cards).toEqual(original.slice(heads));
      expect(game.player1.deck.cards.length).toBe(10);
    });
  }
  it('discards cards during a complete Relentless Burrowing attack', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: "Team Rocket's Diglett ASC", energy: ['Fighting Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    const original = game.player2.deck.cards.slice();
    rigFlips(game, [true, true, false]);
    useAttack(game.store, game.state, 0, 'Relentless Burrowing');
    expect(game.player2.discard.cards).toEqual(original.slice(0, 2));
  });
  it('Mew copies Relentless Burrowing and discards from the opponent deck', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Mew ex 30C', energy: ['Fighting Energy SVE'] }, bench: [{ card: "Team Rocket's Diglett ASC" }], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    const original = game.player2.deck.cards.slice();
    rigFlips(game, [true, true, false]);
    const mew = game.player1.active.getPokemonCard()!, source = game.player1.bench[0].getPokemonCard()!;
    game.store.reduceEffect(game.state, new PowerEffect(game.player1, mew.powers[0], mew));
    const choice = game.state.prompts.find(p => p instanceof ChooseAttackPrompt && p.result === undefined) as ChooseAttackPrompt;
    const selected = choice.decode({ index: choice.cards.indexOf(source), attack: source.attacks[0].name }, game.state);
    expect(choice.validate(selected)).toBe(true);
    (game.store as any).reducePrompt(game.state, new ResolvePromptAction(choice.id, selected));
    const wait = game.state.prompts.find(p => p instanceof WaitPrompt && p.result === undefined);
    if (wait) { game.state.phase = GamePhase.FINISHED; (game.store as any).reducePrompt(game.state, new ResolvePromptAction(wait.id, null)); }
    expect(game.player2.discard.cards).toEqual(original.slice(0, 2));
    expect(game.player2.deck.cards).toEqual(original.slice(2));
  });
  it('preserves the copied attack identity through the actual asynchronous coin sequence', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Mew ex 30C', energy: ['Fighting Energy SVE'] }, bench: [{ card: "Team Rocket's Diglett ASC" }], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    const mew = game.player1.active.getPokemonCard()!, source = game.player1.bench[0].getPokemonCard()!;
    const originalAttacks = mew.attacks;
    const moves: MoveCardsEffect[] = [];
    let copiedAttack: AttackEffect['attack'] | undefined;
    let coinIndex = 0;
    const random = spyOn(Math, 'random').and.returnValue(0.5);
    const reduce = game.store.reduceEffect.bind(game.store);
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof AttackEffect && effect.attack.name === 'Relentless Burrowing') copiedAttack = effect.attack;
      if (effect instanceof MoveCardsEffect && effect.source === game.player2.deck) moves.push(effect);
      if (effect instanceof CoinFlipEffect) random.and.returnValue(coinIndex++ === 0 ? 0.1 : 0.9);
      return reduce(state, effect);
    });
    game.store.reduceEffect(game.state, new PowerEffect(game.player1, mew.powers[0], mew));
    const choice = game.state.prompts.find(p => p instanceof ChooseAttackPrompt && p.result === undefined) as ChooseAttackPrompt;
    const selected = choice.decode({ index: choice.cards.indexOf(source), attack: source.attacks[0].name }, game.state);
    expect(choice.validate(selected)).toBe(true);
    (game.store as any).reducePrompt(game.state, new ResolvePromptAction(choice.id, selected));

    expect(coinIndex).toBe(1);
    const resolveWait = () => {
      const wait = game.state.prompts.find(p => p instanceof WaitPrompt && p.result === undefined) as WaitPrompt;
      expect(wait).toBeDefined();
      if (!wait) throw new Error('Expected pending animation');
      (game.store as any).reducePrompt(game.state, new ResolvePromptAction(wait.id, null));
    };
    game.state.phase = GamePhase.FINISHED;
    expect(copiedAttack?.name).toBe('Relentless Burrowing');
    expect(mew.attacks).toBe(originalAttacks);
    expect(moves.length).toBe(0);
    resolveWait(); // First coin is heads; the next flip remains pending.
    expect(coinIndex).toBe(2);
    expect(moves.length).toBe(0);
    resolveWait(); // Tails completes the sequence and dispatches the card move.
    expect(moves.length).toBe(1);
    expect(moves[0].sourceCard).toBe(mew);
    expect(moves[0].sourceEffect).toBe(copiedAttack);
    expect(game.player2.discard.cards.length).toBe(1);
  });
  for (const count of [0, 1, 3]) {
    it(`Spike Draw deals damage and draws at most two from ${count} cards`, () => {
      const game = setupGame({ turn: 2,
        player1: { active: { card: 'Zangoose ex ASC', energy: ['Grass Energy SVE'] }, deck: padDeck(count) },
        player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
      });
      const top = game.player1.deck.cards.slice();
      useAttack(game.store, game.state, 0, 'Spike Draw');
      expect(game.player2.active.damage).toBe(20);
      expect(game.player1.hand.cards).toEqual(top.slice(0, 2));
      expect(game.player1.deck.cards).toEqual(top.slice(2));
    });
  }
  it('Wild Scissors deals 180 and exactly 30 recoil to its user', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Zangoose ex ASC', energy: ['Grass Energy SVE', 'Grass Energy SVE', 'Grass Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    game.player2.active.getPokemonCard()!.hp = 400;
    useAttack(game.store, game.state, 0, 'Wild Scissors');
    expect(game.player2.active.damage).toBe(180);
    expect(game.player1.active.damage).toBe(30);
  });
  it('Mew copying Wild Scissors takes the recoil itself', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Mew ex 30C', energy: ['Grass Energy SVE', 'Grass Energy SVE', 'Grass Energy SVE'] }, bench: [{ card: 'Zangoose ex ASC' }], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    game.player2.active.getPokemonCard()!.hp = 400;
    const mew = game.player1.active.getPokemonCard()!, source = game.player1.bench[0].getPokemonCard()!;
    game.store.reduceEffect(game.state, new PowerEffect(game.player1, mew.powers[0], mew));
    const choice = game.state.prompts.find(p => p instanceof ChooseAttackPrompt && p.result === undefined) as ChooseAttackPrompt;
    const selected = choice.decode({ index: choice.cards.indexOf(source), attack: source.attacks[1].name }, game.state);
    expect(choice.validate(selected)).toBe(true);
    (game.store as any).reducePrompt(game.state, new ResolvePromptAction(choice.id, selected));
    const wait = game.state.prompts.find(p => p instanceof WaitPrompt && p.result === undefined);
    if (wait) { game.state.phase = GamePhase.FINISHED; (game.store as any).reducePrompt(game.state, new ResolvePromptAction(wait.id, null)); }
    expect(game.player2.active.damage).toBe(180);
    expect(game.player1.active.damage).toBe(30);
    expect(game.player1.bench[0].damage).toBe(0);
  });
});
