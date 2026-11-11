import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, EvolveEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect, CheckHpEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { checkCopiedAttackCost, cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Landorus } from '../set-delta-reign/landorus';
import { Thundurus } from '../set-delta-reign/thundurus';
import { Tornadus } from '../set-delta-reign/tornadus';
import { Enamorus } from '../set-delta-reign/enamorus';
import { EnamorusIR } from '../set-delta-reign/other-pokemon-prints';
import { Stakataka } from '../set-unbroken-bonds/stakataka';
import { StakatakaSMP, Stakataka2SMP } from '../set-sun-and-moon-promos/other-prints';
import { Crustle } from '../set-boundaries-crossed/crustle';
import { Shedinja } from '../set-dragons-exalted/shedinja';
import { Registeel } from '../set-celestial-storm/registeel';
import { Sceptile } from '../set-celestial-storm/sceptile';
import { Sceptile2CES } from '../set-celestial-storm/other-prints';
import { Ninjask } from '../set-vivid-voltage/ninjask';
import { Klinklang } from '../set-stellar-crown/klinklang';

class Dummy extends PokemonCard { public name='Dummy';public fullName='Dummy TEST';public hp=500;public set='TEST'; }
class Energy extends EnergyCard { public name='Energy';public fullName='Energy TEST';public set='TEST';public provides=[CardType.GRASS]; }
class Stadium extends TrainerCard { public name='Stadium';public fullName='Stadium TEST';public set='TEST';public trainerType=TrainerType.STADIUM; }
function battle(card:PokemonCard,copied:boolean,index=0) {
 const state=new State(),player=new Player(),opponent=new Player(),mew=new Mewex();
 player.id=1;opponent.id=2;state.players=[player,opponent];state.turn=2;state.activePlayer=0;state.phase=GamePhase.ATTACK;
 player.active.cards=[copied?mew:card];opponent.active.cards=[new Dummy()];const store=new Store({onStateChange:()=>undefined});store.state=state;
 const attacks=copied?cloneAttacks(card.attacks):card.attacks;if(copied)openCopyAttackSession(state,player,mew,card,attacks,attacks[index]);
 return {state,player,opponent,store,card,mew,attack:new AttackEffect(player,opponent,attacks[index])};
}
function disabled(b:ReturnType<typeof battle>){const reduce=b.store.reduceEffect.bind(b.store);spyOn(b.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof PowerEffect)throw new Error('Ability disabled');return reduce(s,e);});}
function resolve(b:ReturnType<typeof battle>,result:any){const prompt=b.state.prompts.filter(p=>p.result===undefined).pop();if(!prompt)throw new Error('Expected prompt');(b.store as any).reducePrompt(b.state,new ResolvePromptAction(prompt.id,result));}
function bench(b:ReturnType<typeof battle>,card:PokemonCard){const slot=new PokemonCardList();slot.cards=[card];b.player.bench.push(slot);}
function attached(b:ReturnType<typeof battle>){const energy=new Energy();b.player.active.cards.push(energy);return energy;}

describe('explicit ownership migration batch 2 - actual attack and Ability branches',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 const team=[()=>new Landorus(),()=>new Thundurus(),()=>new Enamorus(),()=>new Tornadus()];
 for(let n=0;n<team.length;n++) it('DLR Incarnate Solidarity cost belongs to the original Ability only: '+n,()=>{
   const direct=battle(team[n](),false);team.forEach((make,i)=>{if(i!==n)bench(direct,make());});
   const cost=new CheckAttackCostEffect(direct.player,direct.card.attacks[0]);direct.store.reduceEffect(direct.state,cost);
   expect(cost.cost).toEqual(direct.card.attacks[0].cost.filter(c=>c!==CardType.COLORLESS));
   disabled(direct);const blocked=new CheckAttackCostEffect(direct.player,direct.card.attacks[0]);direct.store.reduceEffect(direct.state,blocked);expect(blocked.cost).toEqual(direct.card.attacks[0].cost);
   const copy=battle(team[n](),true);team.forEach(make=>bench(copy,make()));
   expect(checkCopiedAttackCost(copy.store,copy.state,copy.player,copy.card,copy.card.attacks[0],copy.mew).effect.cost).toEqual(copy.card.attacks[0].cost);
 });
 for(const copied of [false,true]) it('Landorus Gaia Crush discards the Stadium, copied='+copied,()=>{
   const b=battle(new Landorus(),copied),stadium=new Stadium();b.player.stadium.cards=[stadium];b.store.reduceEffect(b.state,b.attack);expect(b.player.discard.cards).toContain(stadium);
 });
 for(const copied of [false,true]) it('Thundurus Thunderous Edge deals damage ignoring effects, copied='+copied,()=>{
   const b=battle(new Thundurus(),copied);b.store.reduceEffect(b.state,b.attack);expect(b.opponent.active.damage).toBe(90);expect(b.attack.damage).toBe(0);
 });
 for(const make of [()=>new Enamorus(),()=>new EnamorusIR()]) for(const copied of [false,true]) it('Enamorus and alternate print Rising Heart retain ex bonus, copied='+copied,()=>{
   const card=make(),name=card.fullName,b=battle(card,copied);(b.opponent.active.cards[0] as PokemonCard).tags=[CardTag.POKEMON_ex];
   b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(200);expect(card.fullName).toBe(name);
 });
 for(const copied of [false,true]) it('Tornadus optional draw resolves after confirmation, copied='+copied,()=>{
   const b=battle(new Tornadus(),copied);b.player.deck.cards=[new Dummy(),new Dummy(),new Dummy()];b.store.reduceEffect(b.state,b.attack);resolve(b,true);expect(b.player.hand.cards.length).toBe(3);
 });
 for(const make of [()=>new Stakataka(),()=>new StakatakaSMP(),()=>new Stakataka2SMP()]) it('Stakataka prints retain Wall of Stone and suppression',()=>{
   const b=battle(make(),false),hp=new CheckHpEffect(b.player,b.player.active);b.store.reduceEffect(b.state,hp);expect(hp.hp).toBe(200);
   b.player.active.hpBonus=0;disabled(b);const blocked=new CheckHpEffect(b.player,b.player.active);b.store.reduceEffect(b.state,blocked);expect(blocked.hp).toBe(120);
 });
 it('copied Stakataka does not grant Wall of Stone HP',()=>{
   const b=battle(new Stakataka(),true),hp=new CheckHpEffect(b.player,b.player.active);b.store.reduceEffect(b.state,hp);expect(hp.hp).toBe(b.mew.hp);
 });
 for(const make of [()=>new Stakataka(),()=>new StakatakaSMP(),()=>new Stakataka2SMP()]) for(const copied of [false,true]) it('Stakataka prints retain sequential Top Down coin callbacks, copied='+copied,()=>{
   spyOn(Math,'random').and.returnValues(0,0.9);const card=make(),name=card.fullName,b=battle(card,copied);b.opponent.deck.cards=[new Dummy(),new Dummy()];
   b.store.reduceEffect(b.state,b.attack);resolve(b,null);resolve(b,null);expect(b.opponent.discard.cards.length).toBe(1);expect(card.fullName).toBe(name);
 });
 for(const copied of [false,true]) it('Crustle Stone Edge retains its heads bonus, copied='+copied,()=>{
   spyOn(Math,'random').and.returnValue(0);const b=battle(new Crustle(),copied);b.store.reduceEffect(b.state,b.attack);resolve(b,null);expect(b.attack.damage).toBe(b.card.attacks[0].damage+20);
 });
 it('Crustle Sturdy stays direct, disabled, and absent from a copied attack',()=>{
   for(const mode of ['direct','disabled','copied']){
     const b=battle(new Crustle(),mode==='copied');if(mode==='disabled')disabled(b);
     const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:500,text:''}),damage=new PutDamageEffect(hit,500);b.store.reduceEffect(b.state,damage);
     expect(damage.surviveOnTenHPReason).toBe(mode==='direct'?'Sturdy':undefined);
   }
 });
 it('Shedinja Empty Shell stays direct and is not copied, including when disabled',()=>{
   for(const mode of ['direct','disabled','copied']){
     const b=battle(new Shedinja(),mode==='copied');if(mode==='disabled')disabled(b);
     const ko=new KnockOutEffect(b.player,b.player.active);b.store.reduceEffect(b.state,ko);expect(ko.prizeCount).toBe(mode==='direct'?0:mode==='copied'?2:1);
   }
 });
 for(const copied of [false,true]) it('Shedinja Cursed Drop still prompts for damage counters, copied='+copied,()=>{
   const b=battle(new Shedinja(),copied);b.store.reduceEffect(b.state,b.attack);expect(b.state.prompts.length).toBeGreaterThan(0);
 });
 for(const copied of [false,true]) it('Registeel Silver Fist counts an opponent Ability, copied='+copied,()=>{
   const b=battle(new Registeel(),copied);b.opponent.active.cards=[new Stakataka()];b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(120);
 });
 it('Registeel Exoskeleton stays direct, disabled and absent from copy',()=>{
   for(const mode of ['direct','disabled','copied']){
     const b=battle(new Registeel(),mode==='copied');if(mode==='disabled')disabled(b);
     const attack=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:100,text:''}),hit=new DealDamageEffect(attack,100);b.store.reduceEffect(b.state,hit);
     expect(hit.damage).toBe(mode==='direct'?80:100);
   }
 });
 for(const make of [()=>new Sceptile(),()=>new Sceptile2CES()]) for(const copied of [false,true]) it('Sceptile prints preserve Powerful Storm energy scaling, copied='+copied,()=>{
   const card=make(),name=card.fullName,b=battle(card,copied);attached(b);attached(b);b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(40);expect(card.fullName).toBe(name);
 });
 it('Sceptile Power of Nature stays direct, disabled and absent from copy',()=>{
   for(const mode of ['direct','disabled','copied']){
     const b=battle(new Sceptile(),mode==='copied');attached(b);if(mode==='disabled')disabled(b);(b.opponent.active.cards[0] as PokemonCard).tags=[CardTag.ULTRA_BEAST];
     const attack=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:100,text:''}),hit=new PutDamageEffect(attack,100);b.store.reduceEffect(b.state,hit);
     expect(hit.preventDefault).toBe(mode==='direct');
   }
 });
 for(const copied of [false,true]) it('Ninjask Absorb heals, copied='+copied,()=>{
   const b=battle(new Ninjask(),copied);b.player.active.damage=50;b.store.reduceEffect(b.state,b.attack);expect(b.player.active.damage).toBe(20);
 });
 for(const block of [false,true]) it('Ninjask evolve Ability honors suppression, disabled='+block,()=>{
   const b=battle(new Ninjask(),false),basic=new Dummy();basic.name='Nincada';basic.stage=Stage.BASIC;b.player.active.cards=[basic];b.player.hand.cards=[b.card];
   b.player.deck.cards=[new Shedinja()];b.player.bench=[new PokemonCardList()];b.state.phase=GamePhase.PLAYER_TURN;if(block)disabled(b);
   b.store.reduceEffect(b.state,new EvolveEffect(b.player,b.player.active,b.card));expect(b.state.prompts.length).toBe(block?0:1);
 });
 for(const copied of [false,true]) it('Klinklang Hyper Ray discards attached Energy, copied='+copied,()=>{
   const b=battle(new Klinklang(),copied),energy=attached(b);b.store.reduceEffect(b.state,b.attack);expect(b.player.discard.cards).toContain(energy);
 });
 for(const block of [false,true]) it('Klinklang hand Ability honors suppression, disabled='+block,()=>{
   const b=battle(new Klinklang(),false);b.player.active.cards=[new Dummy()];b.player.hand.cards=[b.card];b.player.bench=[new PokemonCardList()];
   (b.opponent.active.cards[0] as PokemonCard).stage=Stage.STAGE_2;if(block)disabled(b);
   const use=new PowerEffect(b.player,b.card.powers[0],b.card);
   if(block)expect(()=>b.store.reduceEffect(b.state,use)).toThrow();else b.store.reduceEffect(b.state,use);
   expect(b.player.bench[0].cards.includes(b.card)).toBe(!block);
 });
});
