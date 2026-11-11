import { ensureClientCards } from '../../client/cards';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

const rows = [
  {name:'Delibird P7',num:'6',hp:70,type:CardType.WATER,attacks:['Present','Ice Ball']},
  {name:'Stantler P7',num:'9',hp:70,type:CardType.COLORLESS,attacks:['Lead','Frighten Horn']},
  {name:'Mareep P7',num:'14',hp:50,type:CardType.LIGHTNING,attacks:['Thundershock','Static Shock']}
];
function make(name:string, energy:string[], copy:boolean) {
  const g=setupGame({turn:3,player1:{active:{card:copy?'Mew ex 30C':name,energy},bench:copy?[{card:name}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  const target=g.player2.active.getPokemonCard()!; target.hp=1000;target.weakness=[];target.resistance=[];
  return g;
}
function attack(g:ReturnType<typeof make>, move:string, copy:boolean){
 if(copy){g.overridePrompt('Choose attack',()=>({index:0,attack:move}));useAbility(g.store,g.state,0,'Memory Helix');}
 else useAttack(g.store,g.state,0,move);
}
describe('POP7 source reprints',()=>{
 beforeAll(()=>ensureClientCards());
 for(const r of rows)it('identity '+r.name,()=>{const c=getCardByName(r.name) as PokemonCard;expect([c.set,c.setNumber,c.fullName,c.hp,c.cardType]).toEqual(['P7',r.num,r.name,r.hp,r.type]);expect(c.attacks.map(a=>a.name)).toEqual(r.attacks)});
 for(const copy of [false,true]){
  for(const heads of [false,true])it('Delibird Present copied='+copy+' heads='+heads,()=>{
   const g=make('Delibird P7',[],copy),chosen=g.player1.deck.cards[0];let shuffles=0;
   spyOn(Math,'random').and.returnValue(heads?0.1:0.9);
   g.overridePrompt('Choose cards',()=>[0]);g.overridePrompt('Shuffle deck',()=>{shuffles++;return g.player1.deck.cards.map((_,i)=>i)});
   attack(g,'Present',copy);expect(g.player1.hand.cards.includes(chosen)).toBe(heads);expect(shuffles).toBe(heads?1:0);
  });
  it('Stantler Lead finds and reveals Supporter copied='+copy,()=>{
   const g=make('Stantler P7',[],copy),chosen=getCardByName("Boss's Orders PAL");chosen.id=992001;g.player1.deck.cards.unshift(chosen);let reveals=0,shuffles=0;
   g.overridePrompt('Choose cards',()=>[0]);g.overridePrompt('Show cards',()=>{reveals++;return true});g.overridePrompt('Shuffle deck',()=>{shuffles++;return g.player1.deck.cards.map((_,i)=>i)});
   attack(g,'Lead',copy);expect(g.player1.hand.cards).toContain(chosen);expect(reveals).toBe(1);expect(shuffles).toBe(1);
  });
  for(const [name,move,energy,condition,heads] of [
   ['Stantler P7','Frighten Horn',['Water Energy SVE','Water Energy SVE'],SpecialCondition.CONFUSED,true],
   ['Mareep P7','Thundershock',['Lightning Energy SVE'],SpecialCondition.PARALYZED,true],
   ['Mareep P7','Thundershock',['Lightning Energy SVE'],SpecialCondition.PARALYZED,false]
  ] as Array<[string,string,string[],SpecialCondition,boolean]>)it(name+' '+move+' copied='+copy+' heads='+heads,()=>{
   const g=make(name,energy,copy),seen:SpecialCondition[]=[];
   const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const result=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)seen.push(...e.specialConditions);return result});
   spyOn(Math,'random').and.returnValue(heads?0.1:0.9);attack(g,move,copy);
   expect(g.player2.active.damage).toBe(move==='Frighten Horn'?20:10);expect(seen.includes(condition)).toBe(heads);
  });
 }
});

describe('POP7 protections and evolved defender',()=>{
 for(const copy of [false,true]) for(const [name,move,energy,condition] of [
  ['Stantler P7','Frighten Horn',['Water Energy SVE','Water Energy SVE'],SpecialCondition.CONFUSED],
  ['Mareep P7','Thundershock',['Lightning Energy SVE'],SpecialCondition.PARALYZED]
 ] as Array<[string,string,string[],SpecialCondition]>)it('prevents '+name+' condition copied='+copy,()=>{
  const g=make(name,energy,copy),seen:SpecialCondition[]=[];g.player2.active.preventEffectsOfAttacksNextTurn=true;
  const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const r=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)seen.push(...e.specialConditions);return r});
  spyOn(Math,'random').and.returnValue(0.1);attack(g,move,copy);expect(seen).not.toContain(condition);
 });
 for(const copy of [false,true])it('Stantler does not confuse an evolved defender copied='+copy,()=>{
  const g=make('Stantler P7',['Water Energy SVE','Water Energy SVE'],copy);
  const basic=getCardByName('Mareep SW'),evolved=getCardByName('Flaaffy SW') as PokemonCard;evolved.hp=1000;evolved.weakness=[];evolved.resistance=[];
  g.player2.active.cards=[basic,evolved];const seen:SpecialCondition[]=[];
  const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const r=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)seen.push(...e.specialConditions);return r});
  attack(g,'Frighten Horn',copy);expect(g.player2.active.damage).toBe(20);expect(seen).not.toContain(SpecialCondition.CONFUSED);
 });
});
