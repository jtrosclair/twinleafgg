import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Store } from '../../game/store/store';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

type Case = { source:string; reprint?:string; attack:string; energy:string[]; expected:number };
const cases:Case[]=[
 {source:'Palossand ex SSP',attack:'Sand Tomb',energy:['Fire Energy SVE','Fire Energy SVE','Fire Energy SVE'],expected:160},
 {source:'Tatsugiri ex SSP',attack:'Surprise Pump',energy:['Fire Energy SVE','Water Energy SVE'],expected:100},
 {source:'Ceruledge ex SSP',reprint:'Ceruledge exSAR PRE',attack:'Abyssal Flame',energy:['Fire Energy SVE'],expected:30},
 {source:'Tyranitar ex OBF',attack:'Mountain Hurl',energy:['Fighting Energy SVE'],expected:120},
 {source:'Gyarados ex SVI',attack:'Waterfall',energy:['Water Energy SVE','Water Energy SVE','Water Energy SVE'],expected:100},
 {source:'Sylveon ex SSP',reprint:'Sylveon exSAR PRE',attack:'Magical Charm',energy:['Psychic Energy SVE','Fire Energy SVE','Fire Energy SVE'],expected:160},
];
function game(c:Case,print=c.source) {
 const g=setupGame({turn:5,player1:{active:{card:'Mew ex 30C',energy:c.energy},bench:[{card:print},{card:'Snorlax PGO'}],deck:padDeck(10)},player2:{active:{card:'Charizard ex OBF'},deck:padDeck(10)}});
 g.player2.active.getPokemonCard()!.hp=600;g.overridePrompt('Choose attack',()=>({index:0,attack:c.attack}));return g;
}
function hitBench(store:Store,state:State,target:any) {
 const attack=new AttackEffect(state.players[1],state.players[0],{name:'Bench Hit',cost:[],damage:40,text:''});
 const effect=new PutDamageEffect(attack,40);effect.target=target;store.reduceEffect(state,effect);
}
function copyAndBench(g:ReturnType<typeof game>,c:Case,keepSource=false) {
 useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(c.expected);
 if(!keepSource)g.player1.bench[0].moveCardTo(g.player1.bench[0].getPokemonCard()!,g.player1.lostzone);
 g.player1.switchPokemon(g.player1.bench[1]);g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
}
describe('Six Tera attack-only ownership boundaries',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 cases.forEach(c=>{
  it(c.source+' retains its own attack',()=>{
   const g=setupGame({turn:5,player1:{active:{card:c.source,energy:c.energy},bench:[{card:'Snorlax PGO'}],deck:padDeck(10)},player2:{active:{card:'Charizard ex OBF'},deck:padDeck(10)}});
   g.player2.active.getPokemonCard()!.hp=600;useAttack(g.store,g.state,0,c.attack);expect(g.player2.active.damage).toBe(c.expected);
  });
  it(c.source+' does not transfer Bench protection to Mew',()=>{
   const g=game(c);copyAndBench(g,c);hitBench(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
  });
  it(c.source+' still protects itself while Benched',()=>{
   const g=game(c);copyAndBench(g,c,true);hitBench(g.store,g.state,g.player1.bench[0]);expect(g.player1.bench[0].damage).toBe(0);
  });
  if(c.reprint)it(c.reprint+' does not transfer Bench protection',()=>{
   const g=game(c,c.reprint);copyAndBench(g,c);hitBench(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
  });
 });
 it('copies Ceruledge damage calculation for each discard Energy',()=>{
  const c=cases[2],g=game(c);const energy=getCardByName('Fire Energy SVE');energy.id=99999;g.player1.discard.cards=[energy];
  useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(50);
 });
 it('copies Gyarados damage bonus against a damaged defender',()=>{
  const c=cases[4],g=game({...c,attack:'Tyrannical Tail',energy:['Water Energy SVE','Water Energy SVE','Water Energy SVE','Fire Energy SVE','Fire Energy SVE']});
  g.player2.active.damage=10;g.overridePrompt('Choose attack',()=>({index:0,attack:'Tyrannical Tail'}));
  useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(370);
 });
 it('preserves copied Sylveon Magical Charm damage reduction and cleanup',()=>{
  const c=cases[5],g=game(c);useAbility(g.store,g.state,0,'Memory Helix');
  g.player1.bench[0].moveCardTo(g.player1.bench[0].getPokemonCard()!,g.player1.lostzone);
  const mew=g.player1.active.getPokemonCard()!;const attack=new AttackEffect(g.player2,g.player1,{name:'Hit',cost:[],damage:150,text:''});
  const damage=new DealDamageEffect(attack,150);g.store.reduceEffect(g.state,damage);expect(g.player1.active.damage).toBe(100);
  g.state.phase=GamePhase.FINISHED;g.store.reduceEffect(g.state,new EndTurnEffect(g.player2));
  expect(g.player2.active.marker.markers.some(m=>m.source===mew&&m.name==='DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER')).toBe(false);
  g.player1.active.damage=0;g.state.phase=GamePhase.ATTACK;
  g.store.reduceEffect(g.state,new DealDamageEffect(new AttackEffect(g.player2,g.player1,{name:'Hit',cost:[],damage:150,text:''}),150));
  expect(g.player1.active.damage).toBe(300);
 });
 it('expires actual Sylveon Magical Charm after the defending player turn',()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Sylveon ex SSP',energy:['Psychic Energy SVE','Fire Energy SVE','Fire Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Charizard ex OBF'},deck:padDeck(10)}});
  g.player2.active.getPokemonCard()!.hp=600;const source=g.player1.active.getPokemonCard()!;
  useAttack(g.store,g.state,0,'Magical Charm');
  expect(g.player2.active.marker.hasMarker('DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER',source)).toBe(true);
  g.state.phase=GamePhase.FINISHED;g.store.reduceEffect(g.state,new EndTurnEffect(g.player2));
  expect(g.player2.active.marker.hasMarker('DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER',source)).toBe(false);
 });
});
