import { Card } from '../../game/store/card/card';
import { Stage, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttackEffect, MoveCardsEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { Store } from '../../game/store/store';
import { Effect } from '../../game/store/effects/effect';
import { resolveAfterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Raticate } from '../set-ex-firered-leafgreen/raticate';
import { Magneton } from '../set-cosmic-eclipse/magneton';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { DoubleColorlessEnergy } from '../set-base-set/double-colorless-energy';
import { NestBall } from '../set-scarlet-and-violet/nest-ball';
import { TeamRocketsProton } from '../set-destined-rivals/team-rockets-proton';
import { PokemonTower } from '../set-wotc-promos/pokemon-tower';
import { Parasect } from '../set-neo-revelation/parasect';
class Basic extends PokemonCard { public name='Fixture'; public fullName='Fixture TST'; public set='TST'; public hp=100; public stage=Stage.BASIC; }
class Evolution extends Basic { public stage=Stage.STAGE_1; }
class LevelX extends Basic { public stage=Stage.LV_X; }
class RaticateMetadata extends Raticate { public set='REPRINT'; public fullName='Raticate REPRINT'; }
class RaticateOverride extends Raticate {
 public set='OVERRIDE'; public fullName='Raticate OVERRIDE';
 public reduceEffect(store:any,state:State,effect:Effect):State { return super.reduceEffect(store,state,effect); }
}

function base() {const state=new State(),p=new Player(),o=new Player();p.id=1;o.id=2;state.players=[p,o];state.turn=2;state.phase=GamePhase.PLAYER_TURN;state.activePlayer=0;p.active.cards=[new Basic()];o.active.cards=[new Basic()];const store=new Store({onStateChange:()=>undefined});store.state=state;const moves:MoveCardsEffect[]=[];const reduce=store.reduceEffect.bind(store);spyOn(store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof MoveCardsEffect)moves.push(e);return reduce(s,e)});return {state,p,o,store,moves};}
function ids(...cards:Card[]) {cards.forEach((card,i)=>card.id=i+1);}
function pending<T>(x:ReturnType<typeof base>,ctor:new (...args:any[])=>T) {return x.state.prompts.find(p=>p instanceof ctor&&p.result===undefined) as unknown as T|undefined;}
function send(x:ReturnType<typeof base>,p:any,result:any) {(x.store as any).reducePrompt(x.state,new ResolvePromptAction(p.id,result));}
function shuffle(x:ReturnType<typeof base>) {const p=pending(x,ShuffleDeckPrompt)!;expect(p).toBeDefined();send(x,p,x.p.deck.cards.map((_c,i)=>i));}

describe('Raticate Pickup timing and provenance',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 function setup(copy=false,block:'none'|'tower'|'parasect'='none',source=new Raticate()){const x=base(),mew=new Mewex(),basic=new Basic(),level=new LevelX(),item=new NestBall(),energy=new DoubleColorlessEnergy();ids(source,mew,basic,level,item,energy);x.p.active.cards=[copy?mew:source];if(copy){const slot=new PokemonCardList();slot.cards=[source];x.p.bench.push(slot)}if(block==='tower')x.p.stadium.cards=[new PokemonTower()];if(block==='parasect'){const slot=new PokemonCardList();slot.cards=[new Parasect()];x.o.bench.push(slot)}x.p.discard.cards=[basic,level,item,energy];let attack:AttackEffect;if(copy){const a=cloneAttacks(source.attacks);openCopyAttackSession(x.state,x.p,mew,source,a,a[0]);attack=new AttackEffect(x.p,x.o,a[0]);}else attack=new AttackEffect(x.p,x.o,source.attacks[0]);x.store.reduceEffect(x.state,attack);expect(pending(x,ChooseCardsPrompt)).toBeUndefined();const generator=resolveAfterAttackDamage(()=>undefined,x.store,x.state,attack);generator.next();return {...x,source,mew,basic,level,item,energy,attack};}
 it('requires the available Pokemon, Trainer and Energy and reveals them before movement',()=>{const x=setup(),q=pending(x,ChooseCardsPrompt)!;expect(q.options.min).toBe(3);expect(q.validate([x.basic,x.item,x.energy])).toBe(true);expect(q.validate([x.level,x.item,x.energy])).toBe(false);send(x,q,[x.basic,x.item,x.energy]);expect(x.p.hand.cards.length).toBe(0);const show=pending(x,ShowCardsPrompt)!;expect(show.cards.length).toBe(3);send(x,show,true);expect(x.p.hand.cards).toContain(x.basic);expect(x.p.hand.cards).toContain(x.item);expect(x.p.hand.cards).toContain(x.energy);const move=x.moves.find(m=>m.source===x.p.discard)!;expect(move.sourceCard).toBe(x.source);expect(move.sourceEffect).toBe(x.attack);});
 for(const source of [new RaticateMetadata(),new RaticateOverride()]) it(`executes copied Pickup from ${source.fullName} without inheriting its passive`,()=>{const x=setup(true,'none',source);send(x,pending(x,ChooseCardsPrompt)!,[x.basic,x.item,x.energy]);send(x,pending(x,ShowCardsPrompt)!,true);expect(x.p.hand.cards).toContain(x.basic);expect(x.moves.find(m=>m.source===x.p.discard)!.sourceCard).toBe(x.mew);const incoming=new AttackEffect(x.o,x.p,x.source.attacks[0]);const condition=new AddSpecialConditionsEffect(incoming,[SpecialCondition.POISONED]);x.store.reduceEffect(x.state,condition);expect(condition.preventDefault).toBe(false);});
 for(const block of ['tower','parasect'] as const)for(const copy of [false,true]) it(`respects ${block} when ${copy?'copied':'direct'}`,()=>{const x=setup(copy,block);send(x,pending(x,ChooseCardsPrompt)!,[x.basic,x.item,x.energy]);send(x,pending(x,ShowCardsPrompt)!,true);expect(x.p.hand.cards.length).toBe(0);expect(x.moves.find(m=>m.source===x.p.discard)!.sourceCard).toBe(copy?x.mew:x.source);});
});

describe('Magneton Call Signal search sequencing',()=>{
 function setup(){const x=base(),magneton=new Magneton(),supporter=new TeamRocketsProton(),other=new NestBall(),energy=new WaterEnergy();ids(magneton,supporter,other,energy);x.p.active.cards=[magneton];x.p.deck.cards=[supporter,other,energy];const power=new PowerEffect(x.p,magneton.powers[0],magneton);x.store.reduceEffect(x.state,power);return {...x,magneton,supporter,other,energy,power};}
 it('reveals selected Supporters, moves them, shuffles, then knocks itself out',()=>{const x=setup(),q=pending(x,ChooseCardsPrompt)!;expect(q.validate([x.supporter])).toBe(true);expect(q.validate([x.other])).toBe(false);send(x,q,[x.supporter]);expect(x.p.deck.cards).toContain(x.supporter);expect(x.p.active.damage).toBe(0);const show=pending(x,ShowCardsPrompt)!;send(x,show,true);expect(x.p.hand.cards).toContain(x.supporter);expect(x.p.active.damage).toBe(0);expect(x.moves.find(m=>m.source===x.p.deck)!.sourceEffect).toBe(x.magneton.powers[0]);shuffle(x);expect(x.p.active.damage).toBe(999);});
 it('rejects cancellation without shuffling or knocking out and allows an empty search',()=>{const x=setup(),q=pending(x,ChooseCardsPrompt)!;expect(q.options.allowCancel).toBe(false);expect(q.validate(null)).toBe(false);expect(q.validate([])).toBe(true);expect(()=>send(x,q,null)).toThrow();expect(q.result).toBeUndefined();expect(pending(x,ShuffleDeckPrompt)).toBeUndefined();expect(x.p.active.damage).toBe(0);send(x,q,[]);shuffle(x);expect(x.p.active.damage).toBe(999);});
 it('shuffles and knocks itself out after searching for zero cards',()=>{const x=setup();send(x,pending(x,ChooseCardsPrompt)!,[]);expect(pending(x,ShowCardsPrompt)).toBeUndefined();expect(x.p.active.damage).toBe(0);shuffle(x);expect(x.p.active.damage).toBe(999);});
 it('rejects invalid or duplicate selections and permits retry',()=>{const x=setup(),q=pending(x,ChooseCardsPrompt)!;for(const bad of [[x.other],[x.supporter,x.supporter],[new TeamRocketsProton()]]){expect(()=>send(x,q,bad)).toThrow();expect(q.result).toBeUndefined()}send(x,q,[x.supporter]);expect(pending(x,ShowCardsPrompt)).toBeDefined();});
});

import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { CardList } from '../../game/store/state/card-list';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
function simulator(active:string,setup:(add:(list:CardList,name:string)=>Card,state:State)=>void) {
 ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=3;state.players=[new Player(),new Player()];
 const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;if(!card)throw Error('Missing '+name);card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);return card;};
 state.players.forEach((p,i)=>{p.id=i+1;p.name=i?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(prize=>add(prize,'Fire Energy SVE'));add(p.deck,'Fire Energy SVE');add(p.active,i?'Squirtle BS':active);});
 setup(add,state);const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});return sim;
}
describe('real simulator search sequencing',()=>{

 it('Raticate Pickup resolves after its animation in the actual simulator',()=>{const sim=simulator('Raticate RG',(add,s)=>{const p=s.players[0];const energy=add(p.active,'Water Energy SVE');p.active.energies.cards.push(energy);add(p.discard,'Squirtle BS');add(p.discard,'Nest Ball SVI');add(p.discard,'Fire Energy SVE')});sim.dispatch(new AttackAction(1,'Pickup'));const q=sim.state.prompts.find(x=>x instanceof ChooseCardsPrompt&&x.result===undefined) as ChooseCardsPrompt;expect(q).toBeDefined();const names=['Squirtle BS','Nest Ball SVI','Fire Energy SVE'];const indices=names.map(n=>sim.state.players[0].discard.cards.findIndex(c=>c.fullName===n));sim.resolvePrompt(q.id,indices);expect(names.every(n=>sim.state.players[0].hand.cards.some(c=>c.fullName===n))).toBe(true);expect(sim.state.prompts.some(x=>x.result===undefined)).toBe(false);sim.cleanup();});
 it('Magneton takes the search and self-KO through the actual simulator',()=>{const sim=simulator('Magneton CEC',(add,s)=>{const p=s.players[0];add(p.bench[0],'Charmander BS');add(p.deck,'Team Rocket\'s Proton DRI')});sim.dispatch(new UseAbilityAction(1,'Call Signal',{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));const q=sim.state.prompts.find(x=>x instanceof ChooseCardsPrompt&&x.result===undefined) as ChooseCardsPrompt;expect(q).toBeDefined();const index=sim.state.players[0].deck.cards.findIndex(c=>c.fullName==='Team Rocket\'s Proton DRI');sim.resolvePrompt(q.id,[index]);expect(sim.state.players[0].hand.cards.some(c=>c.fullName==='Team Rocket\'s Proton DRI')).toBe(true);expect(sim.state.players[0].discard.cards.some(c=>c.fullName==='Magneton CEC')).toBe(true);sim.cleanup();});
});
