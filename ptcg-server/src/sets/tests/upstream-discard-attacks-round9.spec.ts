import { Card } from '../../game/store/card/card';
import { CardType, Stage, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttackEffect, MoveCardsEffect } from '../../game/store/effects/game-effects';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { Store } from '../../game/store/store';
import { Effect } from '../../game/store/effects/effect';
import { Onix } from '../set-ex-unseen-forces/onix';
import { Slowpoke } from '../set-ex-unseen-forces/slowpoke';
import { SeasManaphy2 } from '../set-pcg-p-promotional-cards/seas-manaphy2';
import { FloatzelGL } from '../set-rising-rivals/floatzel-gl';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Parasect } from '../set-neo-revelation/parasect';
import { PokemonTower } from '../set-wotc-promos/pokemon-tower';
import { FireEnergy } from '../set-scarlet-and-violet-energy/fire-energy';
import { DoubleColorlessEnergy } from '../set-base-set/double-colorless-energy';
import { HolonFarmer } from '../set-ex-delta-species/holon-farmer';
import { TeamRocketsProton } from '../set-destined-rivals/team-rockets-proton';
import { NestBall } from '../set-scarlet-and-violet/nest-ball';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { Base64 } from '../../utils/base64';
import { CardList } from '../../game/store/state/card-list';
import { AttackAction } from '../../game/store/actions/game-actions';

class Basic extends PokemonCard { public name='Fixture'; public fullName='Fixture TST'; public set='TST'; public hp=100; public stage=Stage.BASIC; }
class Evolution extends Basic { public stage=Stage.STAGE_1; }
class LevelX extends Basic { public stage=Stage.LV_X; }
type Case={name:string,make:()=>PokemonCard,select:'energy'|'pokemon'|'supporter',optional:boolean};
const cases:Case[]=[
 {name:'Onix UF',make:()=>new Onix(),select:'energy',optional:false},
 {name:'Slowpoke UF',make:()=>new Slowpoke(),select:'pokemon',optional:false},
 {name:"Sea's Manaphy PCGP 146",make:()=>new SeasManaphy2(),select:'energy',optional:false},
 {name:'Floatzel GL RR',make:()=>new FloatzelGL(),select:'supporter',optional:true},
];
function setup(c:Case,copy=false,block:'none'|'tower'|'parasect'='none') {
 const state=new State(),player=new Player(),opponent=new Player(),source=c.make(), mew=new Mewex();
 player.id=1;opponent.id=2;state.players=[player,opponent];state.turn=2;state.phase=GamePhase.ATTACK;state.activePlayer=0;
 player.active.cards=[copy?mew:source];opponent.active.cards=[new Basic()];
 if(copy){const slot=new PokemonCardList();slot.cards=[source];player.bench.push(slot);}
 if(block==='tower') player.stadium.cards=[new PokemonTower()];
 if(block==='parasect'){const slot=new PokemonCardList();slot.cards=[new Parasect()];opponent.bench.push(slot);}
 const fire=new FireEnergy(),special=new DoubleColorlessEnergy(),basic=new Basic(),evolution=new Evolution(),level=new LevelX(),supporter=new HolonFarmer(),supporter2=new TeamRocketsProton(),item=new NestBall();
 player.discard.cards=[fire,special,basic,evolution,level,supporter,supporter2,item];player.discard.cards.forEach((card,index)=>card.id=index+1);
 const store=new Store({onStateChange:()=>undefined});store.state=state;
 const effects:MoveCardsEffect[]=[];const reduce=store.reduceEffect.bind(store);
 spyOn(store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof MoveCardsEffect)effects.push(e);return reduce(s,e);});
 let attack:AttackEffect;
 if(copy){const attacks=cloneAttacks(source.attacks);openCopyAttackSession(state,player,mew,source,attacks,attacks[0]);attack=new AttackEffect(player,opponent,attacks[0]);}
 else attack=new AttackEffect(player,opponent,source.attacks[0]);
 store.reduceEffect(state,attack);
 return {state,player,opponent,source,mew,store,attack,effects,fire,special,basic,evolution,level,supporter,supporter2,item};
}
function pending<T>(g:ReturnType<typeof setup>,ctor:new (...args:any[])=>T) {return g.state.prompts.find(p=>p instanceof ctor && p.result===undefined) as unknown as T|undefined;}
function send(g:ReturnType<typeof setup>,p:any,result:any) {(g.store as any).reducePrompt(g.state,new ResolvePromptAction(p.id,result));}
function selected(g:ReturnType<typeof setup>,c:Case):Card {return c.select==='energy'?g.special:c.select==='pokemon'?g.basic:g.supporter;}

describe('upstream public-discard attack recovery',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 cases.forEach(c=>{
  it(`${c.name} reveals a selected eligible card before moving it`,()=>{
   const g=setup(c), p=pending(g,ChooseCardsPrompt)!, card=selected(g,c);
   expect(p).toBeDefined(); expect(p.options.allowCancel).toBe(c.optional); expect(p.options.min).toBe(c.optional?0:1);expect(p.validate([card])).toBe(true);
   send(g,p,[card]); const show=pending(g,ShowCardsPrompt)!;expect(show).toBeDefined();expect(show.cards).toEqual([card]);expect(show.playerId).toBe(g.opponent.id);
   expect(g.player.discard.cards).toContain(card);expect(g.player.hand.cards).not.toContain(card);expect(g.effects.length).toBe(0);
   send(g,show,true);expect(g.player.hand.cards).toContain(card);expect(g.player.discard.cards).not.toContain(card);
   const move=g.effects.find(e=>e.source===g.player.discard)!;expect(move.sourceCard).toBe(g.source);expect(move.sourceEffect).toBe(g.attack);
  });
  it(`${c.name} rejects stale, wrong-type and duplicate selections with retry`,()=>{
   const g=setup(c),p=pending(g,ChooseCardsPrompt)!,card=selected(g,c),wrong=c.select==='supporter'?g.item:g.supporter;
   for(const value of [[wrong],[new Basic()],[card,card]]) {expect(()=>send(g,p,value)).toThrow();expect(p.result).toBeUndefined();}
   expect(g.player.discard.cards).toContain(card);expect(pending(g,ShowCardsPrompt)).toBeUndefined();send(g,p,[card]);expect(pending(g,ShowCardsPrompt)).toBeDefined();
  });
  (['tower','parasect'] as const).forEach(block=>[false,true].forEach(copy=>{
   it(`${c.name} respects ${block} when ${copy?'copied':'direct'}`,()=>{
    const g=setup(c,copy,block),card=selected(g,c);send(g,pending(g,ChooseCardsPrompt)!,[card]);const show=pending(g,ShowCardsPrompt)!;
    expect(show.cards).toEqual([card]);send(g,show,true);expect(g.player.discard.cards).toContain(card);expect(g.player.hand.cards).not.toContain(card);
    const move=g.effects.find(e=>e.source===g.player.discard)!;expect(move).toBeDefined();expect(move.sourceEffect).toBe(g.attack);expect(move.sourceCard).toBe(copy?g.mew:g.source);
   });
  }));
  it(`${c.name} preserves recovery after the original copied source leaves play`,()=>{
   const g=setup(c,true),card=selected(g,c);g.player.bench[0].moveCardTo(g.source,g.player.lostzone);
   send(g,pending(g,ChooseCardsPrompt)!,[card]);send(g,pending(g,ShowCardsPrompt)!,true);expect(g.player.hand.cards).toContain(card);
   expect(g.effects.find(e=>e.source===g.player.discard)!.sourceCard).toBe(g.mew);
  });
 });
 it('Slowpoke accepts a Basic or Evolution Pokémon or Basic Energy, excluding Special Energy and Pokémon LV.X',()=>{
  const g=setup(cases[1]),p=pending(g,ChooseCardsPrompt)!;expect(p.validate([g.basic])).toBe(true);expect(p.validate([g.evolution])).toBe(true);expect(p.validate([g.fire])).toBe(true);
  expect(p.validate([g.special])).toBe(false);expect(p.validate([g.level])).toBe(false);expect(p.validate([g.item])).toBe(false);
 });
 it('Onix and Sea’s Manaphy require choosing an Energy when one is available',()=>{
  [cases[0],cases[2]].forEach(c=>{const g=setup(c),p=pending(g,ChooseCardsPrompt)!;expect(p.validate([])).toBe(false);expect(p.validate(null)).toBe(false);expect(p.validate([g.fire])).toBe(true);expect(p.validate([g.special])).toBe(true);});
 });
 it('Floatzel allows zero, one or two different Supporters and rejects duplicate physical cards',()=>{
  const g=setup(cases[3]),p=pending(g,ChooseCardsPrompt)!;expect(p.validate([])).toBe(true);expect(p.validate(null)).toBe(true);expect(p.validate([g.supporter,g.supporter2])).toBe(true);
  expect(()=>send(g,p,[g.supporter,g.supporter])).toThrow();expect(p.result).toBeUndefined();send(g,p,[g.supporter,g.supporter2]);send(g,pending(g,ShowCardsPrompt)!,true);expect(g.player.hand.cards).toContain(g.supporter);expect(g.player.hand.cards).toContain(g.supporter2);
 });
 it('Floatzel can decline its optional recovery without a reveal',()=>{const g=setup(cases[3]);send(g,pending(g,ChooseCardsPrompt)!,null);expect(pending(g,ShowCardsPrompt)).toBeUndefined();expect(g.player.hand.cards.length).toBe(0);});
 cases.forEach(c=>{
  it(`${c.name} has no choice when no eligible card exists`,()=>{
   const state=new State(),p=new Player(),o=new Player(),source=c.make();p.id=1;o.id=2;state.players=[p,o];state.turn=2;state.phase=GamePhase.ATTACK;
   p.active.cards=[source];o.active.cards=[new Basic()];p.discard.cards=[new NestBall()];
   const store=new Store({onStateChange:()=>undefined});store.state=state;
   store.reduceEffect(state,new AttackEffect(p,o,source.attacks[0]));expect(state.prompts.filter(x=>x.result===undefined).length).toBe(0);
  });
  it(`${c.name} completes the choice and reveal in the actual local simulator`,()=>{
   ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];
   const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);return card;};
   state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Dummy':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(prize=>add(prize,'Fire Energy SVE'));add(p.deck,'Fire Energy SVE');add(p.active,index?'Squirtle BS':c.name);});
   const energy=add(state.players[0].active,'Grass Energy SVE');state.players[0].active.energies.cards.push(energy);
   const picked=c.select==='energy'?'Fire Energy SVE':c.select==='pokemon'?'Squirtle BS':'Holon Farmer DS';add(state.players[0].discard,picked);
   const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});sim.dispatch(new AttackAction(1,c.make().attacks[0].name));
   const p=sim.state.prompts.find(x=>x instanceof ChooseCardsPrompt && x.result===undefined) as ChooseCardsPrompt;expect(p).toBeDefined();
   const index=sim.state.players[0].discard.cards.findIndex(card=>card.fullName===picked);expect(index).toBeGreaterThan(-1);
   sim.resolvePrompt(p.id,[index]);expect(sim.state.players[0].hand.cards.some(card=>card.fullName===picked)).toBe(true);expect(sim.state.prompts.some(x=>x.result===undefined)).toBe(false);sim.cleanup();
  });
 });
});
