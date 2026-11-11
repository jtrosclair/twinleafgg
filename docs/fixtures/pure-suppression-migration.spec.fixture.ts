import { Card, CardTag, PlayerType, PokemonCard, PowerType, SlotType } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { SuppressionDecision, SuppressionPower, SuppressionRuleKind, SuppressionView, evaluatePureSuppression } from '../../game/store/pure-suppression';
import { GalarianWeezing } from '../set-shining-fates/galarian-weezing';
import { EmpoleonV } from '../set-battle-styles/empoleon-v';
import { IronThornsex } from '../set-twilight-masquerade/iron-thorns-ex';
import { Victreebel } from '../set-unbroken-bonds/victreebel';
import { Arbok } from '../set-x-and-y/arbok';
import { Goodra } from '../set-fusion-strike/goodra';
import { StealthyHood } from '../set-unbroken-bonds/stealthy-hood';
import { padDeck, setupGame, getCardByName } from './test-helpers';

type Game = ReturnType<typeof setupGame>;
type Rule = { kind: SuppressionRuleKind; source: PokemonCard; owner: 0 | 1 };
const dummy: SuppressionPower={name:'test',powerType:PowerType.ABILITY};
function game(): Game {
 return setupGame({turn:3,player1:{active:{card:'Pikachu BS'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
}
function snapshot(g:Game, rules:Rule[], coverage:'complete'|'partial'='complete',
 protection?:{source:PokemonCard;target:PokemonCard;result:'clear'|'target-removed'|'unknown'}): {view:SuppressionView;id:(c:Card)=>string} {
 const ids=new Map<Card,string>();const id=(c:Card)=>{if(!ids.has(c))ids.set(c,`c${ids.size}`);return ids.get(c)!;};
 const slot=(x:any)=>({cards:x.cards.map((c:Card)=>id(c)),topPokemon:x.getPokemonCard()?id(x.getPokemonCard()):undefined,
  hasRuleBox:x.hasRuleBox(),markers:x.marker.markers.map((m:any)=>({name:m.name,source:m.source?id(m.source):''}))});
 const players=g.state.players.map(p=>({active:slot(p.active),bench:p.bench.map(slot)}));
 for(const rule of rules)id(rule.source);if(protection){id(protection.source);id(protection.target);}
 const cards=[...ids].map(([c,name])=>({id:name,tags:[...c.tags]}));
 const view:SuppressionView={coverage,players:players as any,cards,rules:rules.map(r=>({kind:r.kind,source:id(r.source),owner:r.owner,sourcePower:r.source.powers[0] ? {
   name:r.source.powers[0].name,powerType:r.source.powers[0].powerType,useFromHand:r.source.powers[0].useFromHand,
   useFromDiscard:r.source.powers[0].useFromDiscard,exemptFromAbilityLock:r.source.powers[0].exemptFromAbilityLock} : undefined})),
  protections:protection?[{source:id(protection.source),target:id(protection.target),result:protection.result}]:[]};
 return {view,id};
}
function parity(g:Game, rules:Rule[], target:PokemonCard, player:0|1, expected:SuppressionDecision,
 power:SuppressionPower=dummy, protection?:{source:PokemonCard;target:PokemonCard;result:'clear'|'target-removed'|'unknown'}) {
 const {view,id}=snapshot(g,rules,'complete',protection);const before=JSON.stringify(view);const rng=spyOn(Math,'random').and.callThrough();
 const actual=evaluatePureSuppression(view,{player,card:id(target),power});expect(actual).toBe(expected);expect(JSON.stringify(view)).toBe(before);expect(rng).not.toHaveBeenCalled();rng.and.callThrough();
 let blocked=false;try{g.store.reduceEffect(g.state,new PowerEffect(g.state.players[player],{...power,text:''},target));}catch{blocked=true;}
 expect(actual).toBe(blocked?'blocked':'allowed');
}

describe('explicit pure suppression migration (unwired; five rule families)',()=>{
 it('matches opposing active Galarian Weezing and honors hand/exempt powers',()=>{
  const g=game(),source=new GalarianWeezing(),target=new Goodra();g.player1.active.cards=[source];g.player2.active.cards=[target];
  const rules:Rule[]=[{kind:'weezing',source,owner:0}];parity(g,rules,target,1,'blocked');
 });
 it('allows an exempt ability through Weezing',()=>{
  const g=game(),source=new GalarianWeezing(),target=new Goodra();g.player1.active.cards=[source];g.player2.active.cards=[target];
  parity(g,[{kind:'weezing',source,owner:0}],target,1,'allowed',{...dummy,exemptFromAbilityLock:true});
 });
 it('allows an Ability used from hand through Weezing',()=>{
  const g=game(),source=new GalarianWeezing(),target=new Goodra();g.player1.active.cards=[source];g.player2.active.cards=[target];
  parity(g,[{kind:'weezing',source,owner:0}],target,1,'allowed',{...dummy,useFromHand:true});
 });
 it('matches Empoleon V current rule-box behavior without changing PowerEffect',()=>{
  const g=game(),source=new EmpoleonV(),target=getCardByName('Pikachu BS') as PokemonCard;g.player1.active.cards=[source];g.player2.active.cards=[target];
  parity(g,[{kind:'empoleon',source,owner:0}],target,1,'allowed');
 });
 it('matches Empoleon branch when neither Active has a rule box',()=>{
  const g=game(),source=new EmpoleonV(),target=getCardByName('Pikachu BS') as PokemonCard;source.tags=[];g.player1.active.cards=[source];g.player2.active.cards=[target];
  parity(g,[{kind:'empoleon',source,owner:0}],target,1,'blocked');
 });
 it('matches opposing Iron Thorns ex with explicitly clear protection',()=>{
  const g=game(),source=new IronThornsex(),target=getCardByName('Mew ex MEW') as PokemonCard;g.player1.active.cards=[source];g.player2.active.cards=[target];
  parity(g,[{kind:'iron-thorns',source,owner:0}],target,1,'blocked',dummy,{source,target,result:'clear'});
 });
 it('matches Stealthy Hood preventing opposing Iron Thorns ex',()=>{
  const g=game(),source=new IronThornsex(),target=getCardByName('Mew ex MEW') as PokemonCard,hood=new StealthyHood();g.player1.active.cards=[source];g.player2.active.cards=[target];g.player2.active.tools.push(hood);
  parity(g,[{kind:'iron-thorns',source,owner:0}],target,1,'allowed',dummy,{source,target,result:'target-removed'});
 });
 it('matches Victreebel marker ownership on the specific affected slot',()=>{
  const g=game(),source=new Victreebel(),target=new Goodra();g.player1.bench[0].cards=[source];g.player2.active.cards=[target];g.player2.active.marker.addMarker(source.GASTRO_ACID_MARKER,source);
  parity(g,[{kind:'victreebel',source,owner:0}],target,1,'blocked');
 });
 it('matches Arbok marker on the effect player active slot',()=>{
  const g=game(),source=new Arbok(),target=new Goodra();g.player1.bench[0].cards=[source];g.player2.active.cards=[target];g.player2.active.marker.addMarker(source.GASTRO_ACID_MARKER,source);
  parity(g,[{kind:'arbok',source,owner:0}],target,1,'blocked');
 });
 it('matches a suppressor whose own Ability is suppressed by Victreebel',()=>{
  const g=game(),source=new GalarianWeezing(),blocker=new Victreebel(),target=new Goodra();g.player1.active.cards=[source];g.player1.bench[0].cards=[blocker];g.player2.active.cards=[target];g.player1.active.marker.addMarker(blocker.GASTRO_ACID_MARKER,blocker);
  parity(g,[{kind:'weezing',source,owner:0},{kind:'victreebel',source:blocker,owner:0}],target,1,'allowed');
 });
 it('returns unsupported for incomplete coverage and unknown protection',()=>{
  const g=game(),source=new IronThornsex(),target=getCardByName('Mew ex MEW') as PokemonCard;g.player1.active.cards=[source];g.player2.active.cards=[target];
  const partial=snapshot(g,[{kind:'iron-thorns',source,owner:0}],'partial',{source,target,result:'clear'});expect(evaluatePureSuppression(partial.view,{player:1,card:partial.id(target),power:dummy})).toBe('unsupported');
  const unknown=snapshot(g,[{kind:'iron-thorns',source,owner:0}],'complete',{source,target,result:'unknown'});expect(evaluatePureSuppression(unknown.view,{player:1,card:unknown.id(target),power:dummy})).toBe('unsupported');
 });
});

import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
it('pure evaluation does not dispatch unrelated PowerEffect observers or consume RNG',()=>{
 const g=game(),source=new GalarianWeezing(),target=new Goodra();let calls=0;
 class Observer extends PokemonCard {
  public name='Observer';public fullName='Observer Test';public set='TEST';
  public reduceEffect(_store:StoreLike,state:State,effect:Effect):State { if(effect instanceof PowerEffect)calls++;return state; }
 }
 g.player1.active.cards=[source];g.player1.bench[0].cards=[new Observer()];g.player2.active.cards=[target];
 const {view,id}=snapshot(g,[{kind:'weezing',source,owner:0}]);const rng=spyOn(Math,'random').and.callThrough();
 expect(evaluatePureSuppression(view,{player:1,card:id(target),power:dummy})).toBe('blocked');expect(calls).toBe(0);expect(rng).not.toHaveBeenCalled();
 try{g.store.reduceEffect(g.state,new PowerEffect(g.player2,{...dummy,text:''},target));}catch{}
 expect(calls).toBeGreaterThan(0);
});
it('returns unsupported for a suppression cycle rather than guessing',()=>{
 const slot=(card:string,rulebox=false)=>({cards:[card],topPokemon:card,hasRuleBox:rulebox,markers:[]});
 const view:SuppressionView={coverage:'complete',players:[{active:slot('w',true),bench:[]},{active:slot('i',true),bench:[slot('t')]}],
  cards:[{id:'w',tags:[CardTag.POKEMON_ex]},{id:'i',tags:[CardTag.POKEMON_ex]},{id:'t',tags:[]}],
  rules:[{kind:'weezing',source:'w',owner:0,sourcePower:{name:'Neutralizing Gas',powerType:PowerType.ABILITY}},{kind:'iron-thorns',source:'i',owner:1,sourcePower:{name:'Initialization',powerType:PowerType.ABILITY}}],protections:[]};
 expect(evaluatePureSuppression(view,{player:1,card:'t',power:dummy})).toBe('unsupported');
});
