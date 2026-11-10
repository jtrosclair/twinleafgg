import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Store } from '../../game/store/store';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { useAbility, useAttack } from './card-test-helpers';

type Case = { source:string, reprint?:string, attack:string, energy:string[], expected:number };
const cases:Case[]=[
  {source:'Tsareena ex PAR',reprint:'TsareenaexFA PAR',attack:'Trop Kick',energy:['Grass Energy SVE','Grass Energy SVE'],expected:180},
  {source:'Garchomp ex PAR',reprint:'GarchompexFA PAR',attack:'Hydro Lander',energy:['Fighting Energy SVE'],expected:160},
  {source:'Skeledirge ex PAR',attack:'Luster Burn',energy:['Fire Energy SVE','Fire Energy SVE'],expected:160},
  {source:'Dragonite ex OBF',attack:'Wing Attack',energy:['Fire Energy SVE'],expected:70},
];
function game(c:Case, print=c.source) {
 const g=setupGame({turn:5,player1:{active:{card:'Mew ex 30C',energy:c.energy},bench:[{card:print},{card:'Snorlax PGO'}],deck:padDeck(10)},
  player2:{active:{card:'Charizard ex OBF'},deck:padDeck(10)}});
 g.player2.active.getPokemonCard()!.hp=600;
 g.overridePrompt('Choose attack',()=>({index:0,attack:c.attack}));
 g.overridePrompt('Attach energy',()=>[]);
 return g;
}
function hitBench(store:Store,state:State,target:any) {
 const attack=new AttackEffect(state.players[1],state.players[0],{name:'Bench Hit',cost:[],damage:40,text:''});
 const effect=new PutDamageEffect(attack,40);effect.target=target;store.reduceEffect(state,effect);
}
function copyAndBench(g:ReturnType<typeof game>,c:Case,keepSource=false) {
 useAbility(g.store,g.state,0,'Memory Helix');
 expect(g.player2.active.damage).toBe(c.expected);
 if(!keepSource)g.player1.bench[0].moveCardTo(g.player1.bench[0].getPokemonCard()!,g.player1.lostzone);
 g.player1.switchPokemon(g.player1.bench[1]);g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
}
describe('Paradox and Obsidian Tera copied attack ownership',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 cases.forEach(c=>{
  it(c.source+' keeps its own attack',()=>{
   const g=setupGame({turn:5,player1:{active:{card:c.source,energy:c.energy},bench:[{card:'Snorlax PGO'}],deck:padDeck(10)},
    player2:{active:{card:'Charizard ex OBF'},deck:padDeck(10)}});
   g.player2.active.getPokemonCard()!.hp=600;g.overridePrompt('Attach energy',()=>[]);
   useAttack(g.store,g.state,0,c.attack);expect(g.player2.active.damage).toBe(c.expected);
  });
  it(c.source+' does not lend Mew Bench protection',()=>{
   const g=game(c);copyAndBench(g,c);hitBench(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
  });
  it(c.source+' retains its own Bench protection',()=>{
   const g=game(c);copyAndBench(g,c,true);hitBench(g.store,g.state,g.player1.bench[0]);expect(g.player1.bench[0].damage).toBe(0);
  });
  if(c.reprint)it(c.reprint+' does not lend Mew Bench protection',()=>{
   const g=game(c,c.reprint);copyAndBench(g,c);hitBench(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
  });
 });
 it('retains Skeledirge Incendiary Song and clears its marker at end of turn',()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Mew ex 30C'},bench:[{card:'Skeledirge ex PAR'}],hand:['Fire Energy SVE'],deck:padDeck(10)},
   player2:{active:{card:'Charizard ex OBF'},deck:padDeck(10)}});
  const source=g.player1.bench[0].getPokemonCard()!;g.overridePrompt('Choose cards',()=>[0]);
  useAbility(g.store,g.state,0,'Incendiary Song');
  expect(g.player1.marker.hasMarker('INCENDIARY_SONG_MARKER',source)).toBe(true);
  const attack=()=>new AttackEffect(g.player1,g.player2,{name:'Fixture',cost:[],damage:100,text:''});
  const boosted=attack();g.store.reduceEffect(g.state,boosted);expect(boosted.damage).toBe(160);
  g.state.phase=GamePhase.FINISHED;g.store.reduceEffect(g.state,new EndTurnEffect(g.player1));
  expect(g.player1.marker.hasMarker('INCENDIARY_SONG_MARKER',source)).toBe(false);
  const unboosted=attack();g.store.reduceEffect(g.state,unboosted);expect(unboosted.damage).toBe(100);
 });
 it('copies Garchomp Hydro Lander and attaches Fighting Energy from discard',()=>{
  const c=cases[1],g=game(c),energy=getCardByName('Fighting Energy SVE');energy.id=99999;g.player1.discard.cards=[energy];
  g.overridePrompt('Attach energy',()=>[{index:0,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:1}}]);
  useAbility(g.store,g.state,0,'Memory Helix');
  expect(g.player2.active.damage).toBe(160);expect(g.player1.bench[1].cards).toContain(energy);
 });
 it('copies Tsareena Trop Kick and heals the copycat',()=>{
  const c=cases[0],g=game(c);g.player1.active.damage=50;
  useAbility(g.store,g.state,0,'Memory Helix');expect(g.player1.active.damage).toBe(20);
  expect(g.player2.active.damage).toBe(180);
 });
 it('copies Dragonite Mighty Meteor and resolves its heads bonus',()=>{
  const c:Case={...cases[3],attack:'Mighty Meteor',energy:['Water Energy SVE','Lightning Energy SVE'],expected:280};
  const g=game(c);g.overridePrompt('Coin flip',()=>true);useAbility(g.store,g.state,0,'Memory Helix');
  expect(g.player2.active.damage).toBe(280);
 });
});
