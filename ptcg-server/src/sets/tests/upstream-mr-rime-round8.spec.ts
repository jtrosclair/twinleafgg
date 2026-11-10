import { Card } from '../../game/store/card/card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, MoveCardsEffect } from '../../game/store/effects/game-effects';
import { COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State } from '../../game/store/state/state';
import { GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { Base64 } from '../../utils/base64';
import { AttackAction } from '../../game/store/actions/game-actions';
import { ensureCardsRegistered, getCardByName, padDeck, setupGame } from './test-helpers';

const cases = [
  { name: 'Galarian Mr. Rime V ASR 49', attack: 'Surprising Hand', match: 'Nest Ball SVI', rejected: 'Fire Energy SVE', max: 3 }
];
function setup(name: string, withParasect = false) {
  const g = setupGame({ turn: 2,
    player1: { active: { card: name }, deck: ['Nest Ball SVI', 'Fire Energy SVE', 'Water Energy SVE', ...padDeck(6)] },
    player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(9) }
  });
  if (withParasect) g.player2.bench[0].cards = [getCardByName('Parasect N3')];
  const source = g.player1.active.getPokemonCard()!;
  const attack = new AttackEffect(g.player1, g.player2, source.attacks[0]);
  const effects: MoveCardsEffect[] = [], reduce = g.store.reduceEffect.bind(g.store);
  spyOn(g.store, 'reduceEffect').and.callFake((s: State, e: Effect) => { if (e instanceof MoveCardsEffect) effects.push(e); return reduce(s, e); });
  g.store.reduceEffect(g.state, attack);
  return { ...g, source, attack, effects, reduce };
}
function search(g: ReturnType<typeof setup>) { return g.state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt; }
function show(g: ReturnType<typeof setup>) { return g.state.prompts.find(p => p instanceof ShowCardsPrompt && p.result === undefined) as ShowCardsPrompt; }
function shuffle(g: ReturnType<typeof setup>) { return g.state.prompts.find(p => p instanceof ShuffleDeckPrompt && p.result === undefined) as ShuffleDeckPrompt; }
function resolve(g: ReturnType<typeof setup>, p: any, result: any) { (g.store as any).reducePrompt(g.state, new ResolvePromptAction(p.id, result)); }

describe('Galarian Mr. Rime V search ordering and provenance', () => {
  beforeAll(() => ensureCardsRegistered(['Combee ASR']));
  for (const c of cases) {
    it(`${c.name} resolves the reveal and shuffle in the actual local simulator`, () => {
      ensureClientCards();
      const state = new State(); state.phase = GamePhase.PLAYER_TURN; state.turn = 2;
      state.players = [new Player(), new Player()];
      const add = (list: CardList, name: string) => {
        const card = CardManager.getInstance().getCardByName(name)!;
        card.id = state.cardNames.length; state.cardNames.push(card.fullName); list.cards.push(card);
        return card;
      };
      state.players.forEach((player, index) => {
        player.id = index + 1; player.name = index ? 'Dummy' : 'Player';
        player.bench = Array.from({ length: 5 }, () => new PokemonCardList());
        player.prizes = Array.from({ length: 6 }, () => new CardList());
        player.prizes.forEach(prize => add(prize, 'Fire Energy SVE'));
        add(player.deck, 'Water Energy SVE'); add(player.deck, 'Fire Energy SVE');
        add(player.active, index ? 'Squirtle BS' : c.name);
      });
      const energy = add(state.players[0].active, 'Water Energy SVE');
      state.players[0].active.energies.cards.push(energy);
      add(state.players[0].deck, c.match);
      const simulator = new ClientSimulator();
      simulator.loadSnapshot({ stateData: new Base64().encode(new StateSerializer().serialize(state)) });
      simulator.dispatch(new AttackAction(1, c.attack));
      const prompt = simulator.state.prompts.find(p => p instanceof ChooseCardsPrompt && p.result === undefined) as ChooseCardsPrompt;
      expect(prompt).toBeDefined();
      const index = simulator.state.players[0].deck.cards.findIndex(card => card.fullName === c.match);
      expect(index).toBeGreaterThan(-1);
      const arbiter = (simulator as any).arbiter, resolve = arbiter.resolvePrompt.bind(arbiter), seen: string[] = [];
      spyOn(arbiter, 'resolvePrompt').and.callFake((s: State, prompt: any) => { seen.push(prompt.type); return resolve(s, prompt); });
      simulator.resolvePrompt(prompt.id, [index]);
      expect(seen.indexOf('Show cards')).toBeGreaterThan(-1);
      expect(seen.indexOf('Shuffle deck')).toBeGreaterThan(seen.indexOf('Show cards'));
      expect(simulator.state.players[0].hand.cards.some(card => card.fullName === c.match)).toBe(true);
      expect(simulator.state.prompts.some(p => p.result === undefined)).toBe(false);
      simulator.cleanup();
    });
    it(`${c.name} reveals before moving, then shuffles after movement`, () => {
      const g = setup(c.name, true), p = search(g), chosen = g.player1.deck.cards.find(card => card.fullName === c.match)!;
      expect(p.options.max).toBe(c.max); expect(p.validate([chosen])).toBe(true);
      expect(p.validate([g.player1.deck.cards.find(card => card.fullName === c.rejected)!])).toBe(false);
      resolve(g, p, [chosen]); expect(show(g)).toBeDefined(); expect(shuffle(g)).toBeUndefined();
      expect(g.player1.deck.cards).toContain(chosen); expect(g.player1.hand.cards).not.toContain(chosen);
      expect(show(g).playerId).toBe(g.player2.id); expect(show(g).cards).toEqual([chosen]);
      expect(() => resolve(g, show(g), true)).not.toThrow();
      expect(g.player1.deck.cards).not.toContain(chosen); expect(g.player1.hand.cards).toContain(chosen);
      const move = g.effects.find(e => e.source === g.player1.deck && e.destination === g.player1.hand)!;
      expect(move).toBeDefined(); expect(move.sourceCard).toBe(g.source); expect(move.sourceEffect).toBe(g.attack);
      expect(shuffle(g)).toBeDefined();
      const cards = g.player1.deck.cards.slice(), order = cards.map((_, i) => cards.length - 1 - i);
      resolve(g, shuffle(g), order); expect(g.player1.deck.cards).toEqual(cards.reverse());
    });
    it(`${c.name} handles an empty deck without creating prompts`, () => {
      const g = setupGame({ turn: 2, player1: { active: { card: c.name }, deck: padDeck(3) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(3) } });
      g.player1.deck.cards = []; const source = g.player1.active.getPokemonCard()!;
      g.store.reduceEffect(g.state, new AttackEffect(g.player1, g.player2, source.attacks[0]));
      expect(g.state.prompts.filter(p => p.result === undefined).length).toBe(0);
    });
    it(`${c.name} allows finding nothing and still shuffles`, () => {
      const g = setup(c.name); resolve(g, search(g), []);
      expect(show(g)).toBeUndefined(); expect(shuffle(g)).toBeDefined(); expect(g.effects.length).toBe(0);
    });
    it(`${c.name} rejects stale or wrong-type selections and permits retry`, () => {
      const g = setup(c.name), p = search(g), chosen = g.player1.deck.cards.find(card => card.fullName === c.match)!;
      const wrong = g.player1.deck.cards.find(card => card.fullName === c.rejected)!;
      expect(() => resolve(g, p, [wrong])).toThrow(); expect(p.result).toBeUndefined();
      g.player1.deck.moveCardTo(chosen, g.player1.discard);
      expect(() => resolve(g, p, [chosen])).toThrow(); expect(p.result).toBeUndefined();
      expect(g.player1.discard.cards).toContain(chosen); resolve(g, p, []); expect(shuffle(g)).toBeDefined();
    });
    it(`${c.name} preserves prevented movement and still shuffles after reveal`, () => {
      const g = setup(c.name), p = search(g), chosen = g.player1.deck.cards.find(card => card.fullName === c.match)!;
      (g.store.reduceEffect as jasmine.Spy).and.callFake((s: State, e: Effect) => {
        if (e instanceof MoveCardsEffect && e.source === g.player1.deck) e.preventDefault = true;
        return g.reduce(s, e);
      });
      resolve(g, p, [chosen]); resolve(g, show(g), true);
      expect(g.player1.deck.cards).toContain(chosen); expect(g.player1.hand.cards).not.toContain(chosen); expect(shuffle(g)).toBeDefined();
    });
  }
  it('selects up to three distinct Items and rejects duplicate or excess choices', () => {
    const g = setup('Galarian Mr. Rime V ASR 49'), p = search(g);
    const items = [g.player1.deck.cards.find(c => c.fullName === 'Nest Ball SVI')!];
    for (let i = 0; i < 3; i++) { const card = getCardByName('Nest Ball SVI'); items.push(card); g.player1.deck.cards.push(card); }
    expect(() => resolve(g, p, [items[0], items[0]])).toThrow();
    expect(p.result).toBeUndefined();
    expect(() => resolve(g, p, items)).toThrow();
    expect(p.result).toBeUndefined();
    resolve(g, p, items.slice(0, 3));
    expect(show(g).cards).toEqual(items.slice(0, 3));
    resolve(g, show(g), true);
    items.slice(0, 3).forEach(card => expect(g.player1.hand.cards).toContain(card));
    expect(g.player1.deck.cards).toContain(items[3]);
    expect(shuffle(g)).toBeDefined();
  });
  it('preserves Customized Cane damage with and without an attached Tool', () => {
    const g = setupGame({ turn: 2, player1: { active: { card: 'Galarian Mr. Rime V ASR 49' }, deck: padDeck(3) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(3) } });
    const source = g.player1.active.getPokemonCard()!;
    let attack = new AttackEffect(g.player1, g.player2, source.attacks[1]);
    g.store.reduceEffect(g.state, attack); expect(attack.damage).toBe(90);
    const tool = getCardByName('Bravery Charm PAL'); g.player1.active.tools = [tool]; g.player1.active.cards.push(tool);
    attack = new AttackEffect(g.player1, g.player2, source.attacks[1]);
    g.store.reduceEffect(g.state, attack); expect(attack.damage).toBe(180);
  });
  for (const c of cases) it(`copied ${c.attack} keeps attacker and attack provenance after the asynchronous reveal`, () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},deck:[c.match,...padDeck(8)]},player2:{active:{card:c.name},bench:[{card:'Parasect N3'}],deck:padDeck(9)}});
    const mew=g.player1.active.getPokemonCard()!, source=g.player2.active.getPokemonCard()!;
    const effects: MoveCardsEffect[] = [], reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof MoveCardsEffect) effects.push(e);return reduce(s,e);});
    g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[0]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    const p=g.state.prompts.find(x=>x instanceof ChooseCardsPrompt && x.result===undefined) as ChooseCardsPrompt;
    const item=g.player1.deck.cards.find(card=>card.fullName===c.match)!;
    (g.store as any).reducePrompt(g.state,new ResolvePromptAction(p.id,[item]));
    const q=g.state.prompts.find(x=>x instanceof ShowCardsPrompt && x.result===undefined) as ShowCardsPrompt;
    expect(q).toBeDefined();expect(g.player1.hand.cards).not.toContain(item);
    (g.store as any).reducePrompt(g.state,new ResolvePromptAction(q.id,true));
    const move=effects.find(e=>e.source===g.player1.deck && e.destination===g.player1.hand)!;
    expect(move.sourceCard).toBe(mew);expect(move.sourceEffect instanceof AttackEffect).toBe(true);
    expect(g.player1.hand.cards).toContain(item);expect(g.state.prompts.some(x=>x instanceof ShuffleDeckPrompt && x.result===undefined)).toBe(true);
  });
});
