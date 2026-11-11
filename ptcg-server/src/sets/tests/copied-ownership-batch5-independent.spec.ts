import { padDeck,setupGame,getCardByName } from './test-helpers';
import { useAbility,useAttack } from './card-test-helpers';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { PowerEffect,AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase } from '../../game/store/state/state';

const fire='Fire Energy SVE';
describe('independent ownership real actions',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true]) it('Meowth Tuck Tail actual action returns attacker, energy and actual tool, copied='+copied,()=>{
  const g=setupGame({turn:5,player1:{active:{card:copied?'Mew ex 30C':'Meowth ex POR',energy:[fire,fire,fire]},bench:copied?[{card:'Meowth ex POR'},{card:'Charmander BS'}]:[{card:'Charmander BS'}],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  const attacker=g.player1.active.getPokemonCard()!,source=copied?g.player1.bench[0].getPokemonCard()!:null,tool=getCardByName('Air Balloon SSH');g.player1.active.tools.push(tool);
  const energy=[...g.player1.active.cards].filter(c=>c.name==='Fire Energy');g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Tuck Tail'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Tuck Tail');
  expect(g.player2.active.damage).toBe(60);expect(g.player1.hand.cards).toContain(attacker);expect(g.player1.hand.cards).toContain(tool);for(const e of energy)expect(g.player1.hand.cards).toContain(e);if(source)expect([g.player1.active,...g.player1.bench].some(slot=>slot.cards.includes(source))).toBe(true);
 });
 for(const suppressed of [false,true]) it('Genome Hacking copies Eevee attack with real Garbotoxin suppression='+suppressed,()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Mew ex MEW',energy:[fire,fire,fire]},deck:padDeck(12)},player2:{active:{card:'Eevee ex PRE'},bench:[{card:'Garbodor DRX'}],deck:padDeck(12)}});
  const eevee=g.player2.active.getPokemonCard()!;eevee.hp=1000;eevee.weakness=[];if(suppressed)g.player2.bench[0].tools.push(getCardByName('Air Balloon SSH'));
  const check=()=>g.store.reduceEffect(g.state,new PowerEffect(g.player2,eevee.powers[0],eevee));if(suppressed)expect(check).toThrow();else expect(check).not.toThrow();
  g.overridePrompt('Choose attack',()=>({index:0,attack:'Coruscating Quartz'}));useAttack(g.store,g.state,0,'Genome Hacking');expect(g.player2.active.damage).toBe(200);
 });
 for(const target of ['eevee','mew'])it('actual copied Eevee attack retains physical bench Tera only: '+target,()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Mew ex 30C',energy:[fire,'Water Energy SVE','Lightning Energy SVE']},bench:[{card:'Eevee ex PRE'},{card:'Charmander BS'}],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];g.overridePrompt('Choose attack',()=>({index:0,attack:'Coruscating Quartz'}));useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(200);
  g.player1.switchPokemon(g.player1.bench[1]);g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;const slot=g.player1.bench[target==='eevee'?0:1];const attack=new AttackEffect(g.player2,g.player1,{name:'Bench hit',cost:[],damage:40,text:''});const hit=new PutDamageEffect(attack,40);hit.target=slot;g.store.reduceEffect(g.state,hit);expect(slot.damage).toBe(target==='eevee'?0:40);
 });
 for(const copied of [false,true])it('inherited Clefairy full art uses actual Full Moon Rondo, copied='+copied,()=>{
  const print="Lillie's Clefairy exFA JTG";const g=setupGame({turn:5,player1:{active:{card:copied?'Mew ex 30C':print,energy:['Psychic Energy SVE',fire]},bench:copied?[{card:print},{card:'Charmander BS'}]:[{card:'Charmander BS'}],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Charmander BS'}],deck:padDeck(12)}});
  g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Full Moon Rondo'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Full Moon Rondo');expect(g.player2.active.damage).toBe(copied?80:60);
 });
 it('nested Memory Helix then Genome Hacking uses opponent Scratch with real prompts',()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Mew ex 30C',energy:[fire,fire,fire]},bench:[{card:'Mew ex MEW'}],deck:padDeck(12)},player2:{active:{card:'Charmander BS'},deck:padDeck(12)}});g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];
  const prompt=g.store.prompt.bind(g.store);let count=0;spyOn(g.store,'prompt').and.callFake((state:any,p:any,cb:any)=>{if(p.type==='Choose attack'){count++;g.overridePrompt('Choose attack',()=>({index:0,attack:count===1?'Genome Hacking':'Scratch'}));}return prompt(state,p,cb);});
  useAbility(g.store,g.state,0,'Memory Helix');expect(count).toBe(2);expect(g.player2.active.damage).toBe(10);
 });

 it('real Restart marker remains owned by benched source until end of turn during nested copy',()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Mew ex 30C',energy:[fire,fire,fire]},bench:[{card:'Mew ex MEW'}],deck:padDeck(12)},player2:{active:{card:'Charmander BS'},deck:padDeck(12)}});g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];const source=g.player1.bench[0].getPokemonCard()!;const marker='RESTART_MARKER';useAbility(g.store,g.state,0,'Restart');expect(g.player1.marker.hasMarker(marker,source)).toBe(true);
  const prompt=g.store.prompt.bind(g.store);let count=0;spyOn(g.store,'prompt').and.callFake((state:any,p:any,cb:any)=>{if(p.type==='Choose attack'){count++;expect(g.player1.marker.hasMarker(marker,source)).toBe(true);g.overridePrompt('Choose attack',()=>({index:0,attack:count===1?'Genome Hacking':'Scratch'}));}return prompt(state,p,cb);});
  useAbility(g.store,g.state,0,'Memory Helix');expect(count).toBe(2);expect(g.player2.active.damage).toBe(10);expect(g.player1.marker.hasMarker(marker,source)).toBe(false);
 });

});
