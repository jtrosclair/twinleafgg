import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { setupGame, padDeck, getCardByName } from './test-helpers';

function evolve(g: ReturnType<typeof setupGame>) {
  const card = g.player1.hand.cards[0] as PokemonCard;
  g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card, g.player1.hand));
}
function confirm(g: ReturnType<typeof setupGame>, value: boolean) {
  const p = g.state.prompts.find(p => p instanceof ConfirmPrompt && p.result === undefined)!;
  expect(p).toBeDefined();
  (g.store as any).reducePrompt(g.state, new ResolvePromptAction(p.id, value));
}
function floette(hand: string[]) {
  return setupGame({turn: 5,
    player1: {active: {card:'Flabébé BKT'}, hand: ['Floette CEC'], deck: padDeck(10)},
    player2: {active: {card:'Pikachu BS'}, hand, deck: padDeck(10)} });
}
function forretress(hoodActive = false, hoodBench = false, ownHood = false, enemy = 'Pikachu BS') {
  return setupGame({turn: 5,
    player1: {active: {card:'Pineco FLF', tools: ownHood ? ['Stealthy Hood UNB'] : []}, hand:['Forretress FLF'], deck:padDeck(10)},
    player2: {active: {card:enemy, tools: hoodActive ? ['Stealthy Hood UNB'] : []}, bench:[{card:'Squirtle BS', tools: hoodBench ? ['Stealthy Hood UNB'] : []}], deck:padDeck(10)} });
}
describe('evolution Ability effect and reveal fixes', () => {
  for (const size of [0, 1, 3]) it(`Floette reveals exactly one before moving it from a hand of ${size}`, () => {
    const names = ['Water Energy SVE', 'Fire Energy SVE', 'Grass Energy SVE'].slice(0,size);
    const g=floette(names); g.player2.hand.cards = names.map(name=>getCardByName(name));
    g.player2.hand.cards.forEach((card,i)=>card.id=800+i);
    const before=g.player2.hand.cards.slice(); spyOn(Math,'random').and.returnValue(0);
    evolve(g); confirm(g,true);
    const shown=g.state.prompts.find(p=>p instanceof ShowCardsPrompt && p.result===undefined) as ShowCardsPrompt | undefined;
    if (!size) { expect(shown).toBeUndefined(); expect(g.player2.hand.cards.length).toBe(0); return; }
    expect(shown).toBeDefined(); expect(shown!.playerId).toBe(g.player1.id); expect(shown!.cards).toEqual([before[0]]);
    expect(g.player2.hand.cards.length).toBe(size); expect(g.player2.deck.cards.length).toBe(10);
    (g.store as any).reducePrompt(g.state,new ResolvePromptAction(shown!.id,true));
    expect(g.player2.hand.cards.length).toBe(size-1); expect(g.player2.deck.cards.length).toBe(11);
    expect(g.player2.deck.cards).toContain(before[0]);
  });
  it('Floette does not reveal or move a card when declined',()=>{
    const g=floette(['Water Energy SVE']); evolve(g); confirm(g,false);
    expect(g.state.prompts.some(p=>p instanceof ShowCardsPrompt && p.result===undefined)).toBe(false);
    expect(g.player2.hand.cards.length).toBe(1); expect(g.player2.deck.cards.length).toBe(10);
  });
  it('Forretress places a counter on each unprotected opposing Pokémon',()=>{
    const g=forretress(); evolve(g); confirm(g,true);
    expect(g.player2.active.damage).toBe(10); expect(g.player2.bench[0].damage).toBe(10);
  });
  it('Stealthy Hood prevents opposing Ability counters only on its bearer',()=>{
    const g=forretress(true,false); evolve(g); confirm(g,true);
    expect(g.player2.active.damage).toBe(0); expect(g.player2.bench[0].damage).toBe(10);
  });
  it('Stealthy Hood also protects a benched bearer',()=>{
    const g=forretress(false,true); evolve(g); confirm(g,true);
    expect(g.player2.active.damage).toBe(10); expect(g.player2.bench[0].damage).toBe(0);
  });
  it('Corviknight VMAX prevents opposing Ability counters on itself',()=>{
    const g=forretress(false,false,false,'Corviknight VMAX BST'); evolve(g); confirm(g,true);
    expect(g.player2.active.damage).toBe(0); expect(g.player2.bench[0].damage).toBe(10);
  });
  it('Floette reveals then moves the chosen card through normal public dispatch',()=>{
    const g=floette(['Water Energy SVE','Fire Energy SVE']);
    g.player1.canEvolve=true; g.player1.active.pokemonPlayedTurn=1;
    const chosen=g.player2.hand.cards[0]; spyOn(Math,'random').and.returnValue(0);
    let revealSeen=false;
    g.overridePrompt('Confirm',()=>true);
    g.overridePrompt('Show cards',(prompt)=>{
      const show=prompt as ShowCardsPrompt;
      revealSeen=true; expect(show.playerId).toBe(g.player1.id); expect(show.cards).toEqual([chosen]);
      expect(g.player2.hand.cards).toContain(chosen); expect(g.player2.deck.cards).not.toContain(chosen);
      return true;
    });
    g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
    expect(revealSeen).toBe(true); expect(g.player2.hand.cards).not.toContain(chosen); expect(g.player2.deck.cards).toContain(chosen);
  });
  it('Forretress does not place counters when its Ability is blocked',()=>{
    const g=forretress(false,false,false,'Wobbuffet PHF'); evolve(g);
    expect(g.state.prompts.some(p=>p instanceof ConfirmPrompt && p.result===undefined)).toBe(false);
    expect(g.player2.active.damage).toBe(0); expect(g.player2.bench[0].damage).toBe(0);
  });
  it('Forretress does not place counters when declined',()=>{
    const g=forretress(); evolve(g); confirm(g,false);
    expect(g.player2.active.damage).toBe(0); expect(g.player2.bench[0].damage).toBe(0);
  });
});
