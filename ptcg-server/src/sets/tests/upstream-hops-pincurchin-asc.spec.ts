import { CardTag, CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
import { EnamorusV } from '../set-lost-origin/enamorus-v';

function battle() {
  const game = setupGame({ turn: 3,
    player1: { active: { card: 'Dragapult ex TWM', energy: ['Psychic Energy SVE'] }, deck: padDeck(10) },
    player2: { active: { card: 'Hop\'s Pincurchin ex ASC' }, deck: padDeck(10) }
  });
  return game;
}

function deal(game: ReturnType<typeof battle>, damage: number) {
  game.state.phase = GamePhase.ATTACK;
  const attack = new AttackEffect(game.player1, game.player2, { name: 'Hit', cost: [], damage, text: '' });
  game.store.reduceEffect(game.state, new DealDamageEffect(attack, damage));
}

describe('Hop\'s Pincurchin ex ASC', () => {
  it('registers the correct printing and Hop\'s and ex tags', () => {
    const card = getCardByName('Hop\'s Pincurchin ex ASC') as PokemonCard;
    expect([card.set, card.setNumber, card.hp, card.cardType]).toEqual(['ASC', '68', 200, CardType.LIGHTNING]);
    expect(card.tags).toContain(CardTag.HOPS);
    expect(card.tags).toContain(CardTag.POKEMON_ex);
  });

  it('places 3 damage counters on the attacker after an actual attack', () => {
    const game = battle();
    useAttack(game.store, game.state, 0, 'Jet Headbutt');
    expect(game.player2.active.damage).toBe(70);
    expect(game.player1.active.damage).toBe(30);
  });

  it('still retaliates after lethal attack damage', () => {
    const game = battle(); game.player2.active.damage = 160;
    deal(game, 70);
    expect(game.player2.active.damage).toBe(230);
    expect(game.player1.active.damage).toBe(30);
  });

  it('retaliates before a real Knock Out and awards two prizes', () => {
    const game = battle();
    game.player2.bench[0].cards = [getCardByName('Mew ex MEW')];
    const card = game.player2.active.getPokemonCard()!;
    game.player2.active.damage = 160;
    useAttack(game.store, game.state, 0, 'Jet Headbutt');
    expect(game.player1.active.damage).toBe(30);
    expect(game.player2.discard.cards).toContain(card);
    expect(game.player1.getPrizeLeft()).toBe(4);
  });

  it('does not retaliate when no damage is done', () => {
    const game = battle(); deal(game, 0);
    expect(game.player1.active.damage).toBe(0);
  });

  it('does not retaliate when it is on the Bench', () => {
    const game = battle();
    game.player2.bench[0].cards = game.player2.active.cards;
    game.player2.active.cards = [getCardByName('Mew ex MEW')];
    game.state.phase = GamePhase.ATTACK;
    const attack = new AttackEffect(game.player1, game.player2, { name: 'Bench hit', cost: [], damage: 40, text: '' });
    const effect = new DealDamageEffect(attack, 40); effect.target = game.player2.bench[0];
    game.store.reduceEffect(game.state, effect);
    expect(game.player2.bench[0].damage).toBe(40);
    expect(game.player1.active.damage).toBe(0);
  });

  it('obeys real Garbotoxin Ability suppression', () => {
    const game = battle();
    game.player1.bench[0].cards = [getCardByName('Garbodor DRX')];
    const tool = getCardByName('Bravery Charm PAL');
    game.player1.bench[0].tools = [tool]; game.player1.bench[0].cards.push(tool);
    deal(game, 40); expect(game.player1.active.damage).toBe(0);
  });

  it('respects Stealthy Hood on the attacking Pokémon', () => {
    const game = battle(); const tool = getCardByName('Stealthy Hood UNB');
    game.player1.active.tools = [tool]; game.player1.active.cards.push(tool);
    deal(game, 40); expect(game.player1.active.damage).toBe(0);
  });

  it('respects Enamorus V protection on a Psychic-Energy attacker', () => {
    const game = battle(); game.player1.bench[0].cards = [new EnamorusV()];
    deal(game, 40); expect(game.player1.active.damage).toBe(0);
  });

  for (const deckSize of [0, 1, 3]) {
    it(`Spiky Thunder draws at most two cards from a ${deckSize}-card deck`, () => {
      const game = setupGame({ turn: 3,
        player1: { active: { card: 'Hop\'s Pincurchin ex ASC', energy: ['Lightning Energy SVE', 'Lightning Energy SVE', 'Lightning Energy SVE'] }, deck: padDeck(deckSize) },
        player2: { active: { card: 'Dragapult ex TWM' }, deck: padDeck(10) }
      });
      useAttack(game.store, game.state, 0, 'Spiky Thunder');
      expect(game.player2.active.damage).toBe(120);
      expect(game.player1.hand.cards.length).toBe(Math.min(2, deckSize));
      expect(game.player1.deck.cards.length).toBe(Math.max(0, deckSize - 2));
    });
  }

  it('Mew copies Spiky Thunder and draws two cards without gaining the Ability', () => {
    const game = setupGame({ turn: 3,
      player1: { active: { card: 'Mew ex 30C', energy: ['Lightning Energy SVE', 'Lightning Energy SVE', 'Lightning Energy SVE'] }, bench: [{ card: 'Hop\'s Pincurchin ex ASC' }], deck: padDeck(10) },
      player2: { active: { card: 'Dragapult ex TWM' }, deck: padDeck(10) }
    });
    const mew = game.player1.active.getPokemonCard()!;
    const source = game.player1.bench[0].getPokemonCard()!;
    game.store.reduceEffect(game.state, new PowerEffect(game.player1, mew.powers[0], mew));
    const choice = game.state.prompts.find(p => p instanceof ChooseAttackPrompt && p.result === undefined) as ChooseAttackPrompt;
    const selected = choice.decode({ index: choice.cards.indexOf(source), attack: source.attacks[0].name }, game.state);
    expect(choice.validate(selected)).toBe(true);
    (game.store as any).reducePrompt(game.state, new ResolvePromptAction(choice.id, selected));
    const wait = game.state.prompts.find(p => p instanceof WaitPrompt && p.result === undefined);
    if (wait) { game.state.phase = GamePhase.FINISHED; (game.store as any).reducePrompt(game.state, new ResolvePromptAction(wait.id, null)); }
    expect(game.player2.active.damage).toBe(120);
    expect(game.player1.hand.cards.length).toBe(2);
    game.state.phase = GamePhase.ATTACK; game.state.activePlayer = 1;
    const attack = new AttackEffect(game.player2, game.player1, { name: 'Hit', cost: [], damage: 30, text: '' });
    game.store.reduceEffect(game.state, new DealDamageEffect(attack, 30));
    expect(game.player2.active.damage).toBe(120);
  });
});
