import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility, playTrainerCard } from './card-test-helpers';
import { SpecialCondition } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { State } from '../../game/store/state/state';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';

function game(name:string, copied:boolean, deck:string[], discard:string[] = []) {
 return setupGame({turn:2,
  player1:{active:{card:copied?'Mew ex 30C':name},bench:copied?[{card:name}]:[],deck,discard},
  player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}
 });
}
function attack(g:ReturnType<typeof game>, name:string, copied:boolean) {
 if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}
 else useAttack(g.store,g.state,0,name);
}
describe('Platinum search, reveal and Life Herb',()=>{
 beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  for(const [card,move] of [['Grimer PL','Division'],['Poochyena PL','Howl']]) {
   it(label+card+' searches the deck and puts only the matching Basic onto Bench',()=>{
    const g=game(card,copied,[card,...padDeck(9)]);const target=g.player1.deck.cards[0];target.id=9001;
    g.overridePrompt(ChooseCardsPromptType,(prompt)=>[(prompt as ChooseCardsPrompt).cards.cards.indexOf(target)]);attack(g,move,copied);
    expect(g.player1.deck.cards).not.toContain(target);
    expect(g.player1.bench.some(slot=>slot.cards.includes(target))).toBe(true);
   });
   it(label+card+' tolerates a failed private search',()=>{
    const g=game(card,copied,padDeck(10));const before=g.player1.deck.cards.slice();
    g.overridePrompt(ChooseCardsPromptType,()=>[]);attack(g,move,copied);
    expect(g.player1.deck.cards.length).toBe(before.length);
    expect(g.player1.bench.flatMap(slot=>slot.cards).filter(c=>c.fullName===card).length).toBe(copied?1:0);
   });
  }
  it(label+'Misdreavus Take Back requires and reveals an eligible Trainer on heads',()=>{
   const g=game('Misdreavus PL',copied,padDeck(10),['Rare Candy SVI','Water Energy SVE']);const trainer=g.player1.discard.cards[0];trainer.id=9002;
   let shown=false;const original=g.store.prompt.bind(g.store);
   spyOn(g.store,'prompt').and.callFake(((state:State,prompt:any,callback:any)=>{
    if(prompt instanceof ShowCardsPrompt){shown=true;expect(prompt.playerId).toBe(g.player2.id);expect(prompt.cards).toEqual([trainer]);expect(g.player1.discard.cards).toContain(trainer);}
    return original(state,prompt,callback);
   }) as any);
   g.overridePrompt(ChooseCardsPromptType,(prompt)=>{const choice=prompt as ChooseCardsPrompt;expect(choice.options.min).toBe(1);expect(choice.options.max).toBe(1);expect(choice.options.allowCancel).toBe(false);return [choice.cards.cards.indexOf(trainer)];});
   attack(g,'Take Back',copied);expect(shown).toBe(true);expect(g.player1.hand.cards).toContain(trainer);expect(g.player1.discard.cards).not.toContain(trainer);
  });
  it(label+'Misdreavus Take Back leaves discard untouched on tails',()=>{
   (Math.random as jasmine.Spy).and.returnValue(0.9);const g=game('Misdreavus PL',copied,padDeck(10),['Rare Candy SVI']);const trainer=g.player1.discard.cards[0];
   attack(g,'Take Back',copied);expect(g.player1.discard.cards).toContain(trainer);expect(g.player1.hand.cards).not.toContain(trainer);
  });
  it(label+'Tauros Show Off reveals a chosen basic Energy before moving it',()=>{
   const g=game('Tauros PL',copied,['Grass Energy SVE',...padDeck(9)]);const energy=g.player1.deck.cards[0];energy.id=9003;
   let shown=false;const original=g.store.prompt.bind(g.store);
   spyOn(g.store,'prompt').and.callFake(((state:State,prompt:any,callback:any)=>{
    if(prompt instanceof ShowCardsPrompt){shown=true;expect(prompt.playerId).toBe(g.player2.id);expect(prompt.cards).toEqual([energy]);expect(g.player1.deck.cards).toContain(energy);}
    return original(state,prompt,callback);
   }) as any);
   g.overridePrompt(ChooseCardsPromptType,(prompt)=>[(prompt as ChooseCardsPrompt).cards.cards.indexOf(energy)]);attack(g,'Show Off',copied);
   expect(shown).toBe(true);expect(g.player1.hand.cards).toContain(energy);expect(g.player1.deck.cards).not.toContain(energy);
  });
 }
 for(const heads of [false,true]) it('Life Herb PL '+(heads?'heals and clears conditions':'does nothing on tails'),()=>{
  (Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW',damage:70},hand:['Life Herb PL'],deck:padDeck(10)},player2:{active:{card:'Pikachu BS'},deck:padDeck(10)}});
  g.player1.active.specialConditions=[SpecialCondition.ASLEEP,SpecialCondition.POISONED];
  g.overridePrompt(ChoosePokemonPromptType,()=>[{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}]);
  playTrainerCard(g.store,g.state,0,'Life Herb PL');
  expect(g.player1.active.damage).toBe(heads?10:70);
  expect(g.player1.active.specialConditions.length).toBe(heads?0:2);
  expect(g.player1.discard.cards.some(card=>card.fullName==='Life Herb PL')).toBe(true);
 });
});
