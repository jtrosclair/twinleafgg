import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN as RETREAT_LOCK } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { AttackEffect, RetreatEffect, RetreatStartEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

type Entry = { source:string; attack:string; energy:string[]; damage:number; ownDamage?:number };
const F='Fire Energy SVE',W='Water Energy SVE',P='Psychic Energy SVE',D='Darkness Energy SVE',L='Lightning Energy SVE',G='Grass Energy SVE',M='Metal Energy SVE';
const entries:Entry[]=[
 {source:'Hoopa ex PAR',attack:'Energy Crush',energy:[D,D],damage:100},
 {source:'Mewtwo ex PAR',attack:'Photon Kinesis',energy:[P,P],damage:70},
 {source:'Toxtricity ex PAR',attack:'Knocking Hammer',energy:[L,L],damage:70},
 {source:'Espeon ex PRE',attack:'Psych Out',energy:[P,P,P],damage:160},
 {source:'Flareon ex PRE',attack:'Carnelian',energy:[F,W,L],damage:280},
 {source:'Glaceon ex PRE',attack:'Frost Bullet',energy:[W,W],damage:110},
 {source:'Jolteon ex PRE',attack:'Dravite',energy:[F,W,L],damage:280},
 {source:'Leafeon ex PRE',attack:'Verdant Storm',energy:[G,G],damage:120},
 {source:'Umbreon ex PRE',attack:'Moon Mirage',energy:[D,D,D],damage:160},
 {source:'Vaporeon ex PRE',attack:'Aquamarine',energy:[F,W,L],damage:280},
 {source:'Arcanine ex SVI',attack:'Raging Claws',energy:[F,F],damage:30},
 {source:'Revavroom ex SFA',attack:'Accelerator Flash',energy:[M],damage:20},
 {source:'Cinderace ex SCR',attack:'Flare Strike',energy:[F,F,F],damage:280},
 {source:'Lapras ex SCR',attack:'Power Splash',energy:[W,F],damage:80},
 {source:'Alolan Exeggutor ex SSP',attack:'Tropical Fever',energy:[G,W],damage:150},
 {source:'Cyclizar ex SSP',attack:'Break Through',energy:[F,F,F],damage:130},
 {source:'Hearthflame Mask Ogerpon ex TWM',attack:'Wrathful Hearth',energy:[F,F,F],damage:20,ownDamage:10},
 // Burn adds 20 damage during checkup after Hot Magma's 70.
 {source:'Magcargo ex TWM',attack:'Hot Magma',energy:[F,F],damage:90},
 {source:'Wellspring Mask Ogerpon ex TWM',attack:'Sob',energy:[W],damage:20}
];
function config(c:Entry, active:string, bench:string[]) {
 return {turn:5,player1:{active:{card:active,energy:c.energy,damage:c.ownDamage||0},bench:bench.map(card=>({card})),deck:padDeck(10)},player2:{active:{card:'Charizard ex OBF',energy:[W,W]},deck:padDeck(10)}};
}
function game(c:Entry,print=c.source) {
 const g=setupGame(config(c,'Mew ex 30C',[print,'Snorlax PGO']));
 const target=g.player2.active.getPokemonCard()!; target.hp=900; target.weakness=[]; target.resistance=[];
 g.overridePrompt('Choose attack',()=>({index:0,attack:c.attack})); return g;
}
function hitBench(store:Store,state:State,target:any) {
 const attack=new AttackEffect(state.players[1],state.players[0],{name:'Bench Hit',cost:[],damage:40,text:''});
 const effect=new PutDamageEffect(attack,40); effect.target=target; store.reduceEffect(state,effect);
}
function copyAndBench(g:ReturnType<typeof game>,c:Entry,keepSource=false) {
 useAbility(g.store,g.state,0,'Memory Helix');
 expect(g.player2.active.damage).toBe(c.damage);
 if(!keepSource)g.player1.bench[0].moveCardTo(g.player1.bench[0].getPokemonCard()!,g.player1.lostzone);
 g.player1.switchPokemon(g.player1.bench[1]);g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
}
describe('Tera card attack-only ownership round 23',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const c of entries) {
  it(c.source+' keeps its real attack',()=>{
   const g=setupGame(config(c,c.source,['Snorlax PGO']));const target=g.player2.active.getPokemonCard()!;target.hp=900;target.weakness=[];target.resistance=[];
   useAttack(g.store,g.state,0,c.attack);expect(g.player2.active.damage).toBe(c.damage);
  });
  it(c.source+' does not give copied Mew Bench protection',()=>{
   const g=game(c);copyAndBench(g,c);hitBench(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe((c.ownDamage||0)+40);
  });
  it(c.source+' retains its own Bench protection after copying',()=>{
   const g=game(c);copyAndBench(g,c,true);hitBench(g.store,g.state,g.player1.bench[0]);expect(g.player1.bench[0].damage).toBe(0);
  });
 }
 for (const copied of [false, true]) {
  function sobGame(defender='Charmander BS') {
   const c=entries.find(x=>x.source==='Wellspring Mask Ogerpon ex TWM')!;
   const g=setupGame({turn:5,
    player1:{active:{card:copied?'Mew ex 30C':c.source,energy:c.energy},bench:copied?[{card:c.source},{card:'Snorlax PGO'}]:[{card:'Snorlax PGO'}],deck:padDeck(10)},
    player2:{active:{card:defender,energy:[W]},bench:[{card:'Squirtle BS'}],deck:padDeck(10)}
   });
   const target=g.player2.active.getPokemonCard()!;target.hp=900;target.weakness=[];target.resistance=[];
   if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:c.attack}));useAbility(g.store,g.state,0,'Memory Helix');}
   else useAttack(g.store,g.state,0,c.attack);
   g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;return g;
  }
  it(`Sob prevents both retreat entry points after damage, copied ${copied}`,()=>{
   const start=sobGame();expect(start.player2.active.damage).toBe(20);
   expect(()=>start.store.reduceEffect(start.state,new RetreatStartEffect(start.player2))).toThrow();
   const direct=sobGame();
   expect(()=>direct.store.reduceEffect(direct.state,new RetreatEffect(direct.player2,0))).toThrow();
  });
  it(`Sob survives source removal and expires after defender turn, copied ${copied}`,()=>{
   const g=sobGame(); const source=g.player1.active.getPokemonCard()!;
   g.player1.active.moveCardTo(source,g.player1.lostzone);
   expect(()=>g.store.reduceEffect(g.state,new RetreatStartEffect(g.player2))).toThrow();
   g.state.phase=GamePhase.FINISHED;
   g.store.reduceEffect(g.state,new EndTurnEffect(g.player1));
   expect(g.player2.active.marker.hasMarker(RETREAT_LOCK)).toBe(true);
   g.store.reduceEffect(g.state,new EndTurnEffect(g.player2));
   expect(g.player2.active.marker.hasMarker(RETREAT_LOCK)).toBe(false);
  });
  it(`Sob is prevented by Skeledirge's Unaware without preventing damage, copied ${copied}`,()=>{
   const g=sobGame('Skeledirge SSP');
   expect(g.player2.active.damage).toBe(20);
   expect(g.player2.active.marker.hasMarker(RETREAT_LOCK)).toBe(false);
  });
  it(`Sob is cleared when the defending Pokémon switches out, copied ${copied}`,()=>{
   const g=sobGame(); const affected=g.player2.active;
   expect(affected.marker.hasMarker(RETREAT_LOCK)).toBe(true);
   g.player2.switchPokemon(g.player2.bench[0]);
   expect(affected.marker.hasMarker(RETREAT_LOCK)).toBe(false);
  });
 }
 for (const copied of [false, true]) it(`restores the new Sob lock after the attacker leaves play, copied ${copied}`,()=>{
  ensureClientCards();
  const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=5;state.activePlayer=0;state.players=[new Player(),new Player()];
  const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);return card;};
  state.players.forEach((player,index)=>{
   player.id=index+1;player.bench=Array.from({length:5},()=>new PokemonCardList());player.prizes=Array.from({length:6},()=>new CardList());
   player.prizes.forEach(prize=>add(prize,F));for(let i=0;i<8;i++)add(player.deck,F);
   add(player.active,index===0?(copied?'Mew ex 30C':'Wellspring Mask Ogerpon ex TWM'):'Charmander BS');
   add(player.active,W);
   if(index===0&&copied){add(player.bench[0],'Wellspring Mask Ogerpon ex TWM');add(player.bench[1],'Snorlax PGO');}
   else add(player.bench[0],'Squirtle BS');
  });
  const simulator=new ClientSimulator();simulator.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});
  if(copied){
   simulator.dispatch(new UseAbilityAction(simulator.humanPlayerId,'Memory Helix',{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
   const prompt=simulator.state.prompts.find(item=>item instanceof ChooseAttackPrompt&&item.result===undefined) as ChooseAttackPrompt;
   expect(prompt).toBeDefined();const index=prompt.cards.findIndex(card=>card.name==='Wellspring Mask Ogerpon ex');
   expect(index).toBeGreaterThanOrEqual(0);simulator.resolvePrompt(prompt.id,{index,attack:'Sob'});
  } else simulator.dispatch(new AttackAction(simulator.humanPlayerId,'Sob'));
  const own=simulator.state.players[0],opponent=simulator.state.players[1],attacker=own.active.getPokemonCard()!;
  expect(opponent.active.marker.hasMarker(RETREAT_LOCK)).toBe(true);
  const benchIndex=copied?1:0;own.switchPokemon(own.bench[benchIndex]);own.bench[benchIndex].moveCardTo(attacker,own.lostzone);
  if(copied){const source=own.bench[0].getPokemonCard()!;own.bench[0].moveCardTo(source,own.lostzone);}
  // Freeze the settled attack state before the simulator auto-passes the dummy turn.
  simulator.state.phase=GamePhase.ATTACK;simulator.state.activePlayer=1;
  const snapshot=simulator.getStateData();
  const restored=new ClientSimulator();restored.loadSnapshot({stateData:snapshot});
  const attackerPlayer=restored.state.players[0],defender=restored.state.players[1],store=(restored as any).store;
  expect(attackerPlayer.lostzone.cards.some(card=>card.name===attacker.name)).toBe(true);
  expect(defender.active.marker.hasMarker(RETREAT_LOCK)).toBe(true);
  expect(()=>store.reduceEffect(restored.state,new RetreatStartEffect(defender))).toThrow();
  expect(()=>store.reduceEffect(restored.state,new RetreatEffect(defender,0))).toThrow();
  restored.state.phase=GamePhase.FINISHED;store.reduceEffect(restored.state,new EndTurnEffect(attackerPlayer));
  expect(defender.active.marker.hasMarker(RETREAT_LOCK)).toBe(true);
  store.reduceEffect(restored.state,new EndTurnEffect(defender));
  expect(defender.active.marker.hasMarker(RETREAT_LOCK)).toBe(false);
  simulator.cleanup();restored.cleanup();
 });
 it('restores a legacy Sob marker with its source in play and clears it at the defending turn end',()=>{
  ensureClientCards();
  const state=new State(); state.phase=GamePhase.PLAYER_TURN;state.turn=5;state.activePlayer=0;
  state.players=[new Player(),new Player()];
  const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);return card;};
  state.players.forEach((player,index)=>{
   player.id=index+1;player.bench=Array.from({length:5},()=>new PokemonCardList());player.prizes=Array.from({length:6},()=>new CardList());
   player.prizes.forEach(prize=>add(prize,F));for(let i=0;i<5;i++)add(player.deck,F);
   add(player.active,index===0?'Wellspring Mask Ogerpon ex TWM':'Charmander BS');
   add(player.bench[0],'Squirtle BS');if(index===1)add(player.active,W);
  });
  const original=state.players[0].active.getPokemonCard()!;
  state.players[1].active.marker.addMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER,original,'attack','pokemon');
  const simulator=new ClientSimulator();simulator.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});
  const attacker=simulator.state.players[0],defender=simulator.state.players[1],store=(simulator as any).store;
  const restoredSource=attacker.active.getPokemonCard()!;simulator.state.activePlayer=1;
  expect(defender.active.marker.hasMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER,restoredSource)).toBe(true);
  expect(()=>store.reduceEffect(simulator.state,new RetreatEffect(defender,0))).toThrow();
  simulator.state.phase=GamePhase.FINISHED;store.reduceEffect(simulator.state,new EndTurnEffect(defender));
  expect(defender.active.marker.hasMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER,restoredSource)).toBe(false);
  simulator.cleanup();
 });
 it('the inherited Cinderace promo does not transfer its Bench rule',()=>{
  getCardByName('Cinderace ex SVP');const c=entries.find(x=>x.source==='Cinderace ex SCR')!;
  const g=game(c,'Cinderace ex SVP');copyAndBench(g,c);hitBench(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
 });
 it('the copied Cinderace attack keeps its next-turn attack lock',()=>{
  const c=entries.find(x=>x.source==='Cinderace ex SCR')!,g=game(c);
  useAbility(g.store,g.state,0,'Memory Helix');
  expect(g.player1.active.cannotUseAttacksNextTurnPending.concat(g.player1.active.cannotUseAttacksNextTurn)).toContain('Flare Strike');
 });
 it('copied Toxtricity still discards the opponent’s top deck card',()=>{
  const c=entries.find(x=>x.source==='Toxtricity ex PAR')!,g=game(c);useAbility(g.store,g.state,0,'Memory Helix');
  expect(g.player2.discard.cards.length).toBe(1);
 });
});
