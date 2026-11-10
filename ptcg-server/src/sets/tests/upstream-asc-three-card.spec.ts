import { CardTag, CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { GamePhase } from '../../game/store/state/state';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { Pangoro as EarlierPangoro } from '../set-crown-zenith/pangoro';
import { useAttack } from './card-test-helpers';

describe('Ascended Heroes Pangoro, Vullaby and Team Rocket\'s Exeggcute', () => {
  it('registers each distinct print, including the Team Rocket tag', () => {
    const cards = ['Team Rocket\'s Exeggcute ASC', 'Vullaby ASC', 'Pangoro ASC'].map(name => getCardByName(name) as PokemonCard);
    expect(cards.map(c => [c.name, c.set, c.setNumber, c.hp])).toEqual([
      ['Team Rocket\'s Exeggcute', 'ASC', '77', 60], ['Vullaby', 'ASC', '138', 70], ['Pangoro', 'ASC', '140', 140]
    ]);
    expect(cards[0].tags).toContain(CardTag.TEAM_ROCKET);
    expect(cards[2].evolvesFrom).toBe('Pancham');
  });
  for (const heads of [true, false]) {
    it(`Focused Wish deals the correct damage when ${heads ? 'heads' : 'tails'}`, () => {
      const g = setupGame({ turn: 2, player1: { active: { card: 'Team Rocket\'s Exeggcute ASC', energy: ['Psychic Energy SVE'] }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      const reduce = g.store.reduceEffect.bind(g.store);
      spyOn(g.store, 'reduceEffect').and.callFake((s: State, e: Effect) => {
        if (e instanceof CoinFlipEffect) { e.callback!(heads); return s; }
        return reduce(s, e);
      });
      useAttack(g.store, g.state, 0, 'Focused Wish');
      expect(g.player2.active.damage).toBe(heads ? 30 : 10);
    });
  }
  it('Vullaby deals Flap damage in an actual attack', () => {
    const g = setupGame({ turn: 2, player1: { active: { card: 'Vullaby ASC', energy: ['Darkness Energy SVE', 'Darkness Energy SVE'] }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    g.player2.active.getPokemonCard()!.weakness = [];
    useAttack(g.store, g.state, 0, 'Flap'); expect(g.player2.active.damage).toBe(20);
  });
  for (const condition of ['no bench', 'healthy', 'damaged', 'opponent', 'other', 'evolved'] as const) {
    it(`Master's Punch resolves correctly with ${condition}`, () => {
      const g = setupGame({ turn: 2, player1: { active: { card: 'Pangoro ASC', energy: ['Darkness Energy SVE', 'Darkness Energy SVE', 'Darkness Energy SVE'] }, bench: condition === 'no bench' || condition === 'opponent' ? [] : [{ card: condition === 'other' ? 'Vullaby ASC' : 'Pancham FFI' }], deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, bench: condition === 'opponent' ? [{ card: 'Pancham FFI' }] : [], deck: padDeck(10) } });
      if (condition === 'opponent') g.player2.bench[0].damage = 10;
      else if (condition !== 'no bench' && condition !== 'healthy') g.player1.bench[0].damage = 10;
      if (condition === 'evolved') g.player1.bench[0].cards.push(new EarlierPangoro());
      g.player2.active.getPokemonCard()!.weakness = [];
      g.player2.active.getPokemonCard()!.hp = 400;
      useAttack(g.store, g.state, 0, 'Master\'s Punch');
      expect(g.player2.active.damage).toBe(condition === 'damaged' ? 200 : 80);
    });
  }
  it("Mew copies Master's Punch with the damaged Benched Pancham bonus", () => {
    const g = setupGame({ turn: 2, player1: { active: { card: 'Mew ex 30C', energy: ['Darkness Energy SVE', 'Darkness Energy SVE', 'Darkness Energy SVE'] }, bench: [{ card: 'Pangoro ASC' }, { card: 'Pancham FFI' }], deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    g.player1.bench[1].damage = 10;
    g.player2.active.getPokemonCard()!.hp = 400;
    g.player2.active.getPokemonCard()!.weakness = [];
    const mew = g.player1.active.getPokemonCard()!;
    const source = g.player1.bench[0].getPokemonCard()!;
    g.store.reduceEffect(g.state, new PowerEffect(g.player1, mew.powers[0], mew));
    const choice = g.state.prompts.find(p => p instanceof ChooseAttackPrompt && p.result === undefined) as ChooseAttackPrompt;
    expect(choice).toBeDefined();
    const selected = choice.decode({ index: choice.cards.indexOf(source), attack: source.attacks[1].name }, g.state);
    expect(choice.validate(selected)).toBe(true);
    (g.store as any).reducePrompt(g.state, new ResolvePromptAction(choice.id, selected));
    const wait = g.state.prompts.find(p => p instanceof WaitPrompt && p.result === undefined);
    if (wait) { g.state.phase = GamePhase.FINISHED; (g.store as any).reducePrompt(g.state, new ResolvePromptAction(wait.id, null)); }
    expect(g.player2.active.damage).toBe(200);
  });
  it('Corkscrew Punch never receives the damaged Pancham bonus', () => {
    const g = setupGame({ player1: { active: { card: 'Pangoro ASC' }, bench: [{ card: 'Pancham FFI' }], deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    g.player1.bench[0].damage = 10;
    const card = g.player1.active.getPokemonCard()!;
    const effect = new AttackEffect(g.player1, g.player2, card.attacks[0]);
    g.store.reduceEffect(g.state, effect); expect(effect.damage).toBe(40);
  });
});
