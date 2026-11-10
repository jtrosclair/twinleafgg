import { ClientSimulator } from '../../client/simulator';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

function hit(store:Store,state:State) {
 const attack=new AttackEffect(state.players[1],state.players[0],{name:'Hit',cost:[],damage:150,text:''});
 store.reduceEffect(state,new DealDamageEffect(attack,150));
}
function fixture(copycat:'active'|'bench'|'discard'|'lostzone', source:'bench'|'lostzone', print='Sylveon ex SSP') {
 const g=setupGame({turn:5,player1:{active:{card:'Mew ex 30C',energy:['Psychic Energy SVE','Fire Energy SVE','Fire Energy SVE']},bench:[{card:print},{card:'Snorlax PGO'}],deck:padDeck(10)},player2:{active:{card:'Charizard ex OBF'},deck:padDeck(10)}});
 g.player2.active.getPokemonCard()!.hp=600;
 g.overridePrompt('Choose attack',()=>({index:0,attack:'Magical Charm'}));
 useAbility(g.store,g.state,0,'Memory Helix');
 if(source==='lostzone') g.player1.bench[0].moveTo(g.player1.lostzone);
 if(copycat!=='active') {
   g.player1.switchPokemon(g.player1.bench[1]);
   if(copycat!=='bench') g.player1.bench[1].moveTo(g.player1[copycat]);
 }
 g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
 return g;
}
function restore(g:ReturnType<typeof fixture>) {
 const sim=new ClientSimulator();
 const lists=g.state.players.flatMap(p=>[p.active,...p.bench,p.deck,p.hand,p.discard,p.lostzone,p.stadium,p.supporter,...p.prizes]);
 const cards=Array.from(new Set(lists.flatMap(list=>list.cards)));cards.forEach((card,index)=>card.id=index);g.state.cardNames=cards.map(card=>card.fullName);
 StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());
 sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(g.state))});
 return {state:sim.state,store:(sim as any).store as Store};
}
describe('copied Magical Charm survives changes to its source and copycat',()=>{
 for(const print of ['Sylveon ex SSP','Sylveon exSAR PRE'])for(const source of ['bench','lostzone'] as const)for(const copycat of ['active','bench','discard','lostzone'] as const)for(const snapshot of [false,true]) {
  it(`retains one reduction and expires: ${print}, source ${source}, Mew ${copycat}, snapshot ${snapshot}`,()=>{
   const g=fixture(copycat,source,print),v=snapshot?restore(g):{state:g.state,store:g.store};
   hit(v.store,v.state);expect(v.state.players[0].active.damage).toBe(copycat==='active'?100:50);
   v.state.phase=GamePhase.FINISHED;v.store.reduceEffect(v.state,new EndTurnEffect(v.state.players[1]));
   expect(v.state.players[1].active.marker.markers.some(m=>m.name==='DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER')).toBe(false);
   v.state.players[0].active.damage=0;v.state.phase=GamePhase.ATTACK;hit(v.store,v.state);
   expect(v.state.players[0].active.damage).toBe(copycat==='active'?300:150);
  });
 }
 for(const snapshot of [false,true]) it(`retains Genome Hacking with the source on the opposing Active, snapshot ${snapshot}`,()=>{
   const g=setupGame({turn:5,player1:{active:{card:'Mew ex MEW',energy:['Psychic Energy SVE','Fire Energy SVE','Fire Energy SVE']},bench:[{card:'Snorlax PGO'}],deck:padDeck(10)},player2:{active:{card:'Sylveon ex SSP'},deck:padDeck(10)}});
   g.overridePrompt('Choose attack',()=>({index:0,attack:'Magical Charm'}));useAttack(g.store,g.state,0,'Genome Hacking');
   expect(g.player2.active.damage).toBe(160);
   g.player1.switchPokemon(g.player1.bench[0]);g.player1.bench[0].moveTo(g.player1.discard);
   g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
   const v=snapshot?restore(g):{state:g.state,store:g.store};hit(v.store,v.state);expect(v.state.players[0].active.damage).toBe(50);
 });
 for(const snapshot of [false,true]) it(`retains a Lost Link copy after Mew leaves play, snapshot ${snapshot}`,()=>{
   const g=setupGame({turn:5,player1:{active:{card:'Mew TM',energy:['Psychic Energy SVE','Fire Energy SVE','Fire Energy SVE']},bench:[{card:'Snorlax PGO'}],deck:padDeck(10)},player2:{active:{card:'Charizard ex OBF'},deck:padDeck(10)}});
   g.player2.active.getPokemonCard()!.hp=600;g.player1.lostzone.cards.push(getCardByName('Sylveon ex SSP'));
   g.overridePrompt('Choose attack',()=>({index:0,attack:'Magical Charm'}));useAbility(g.store,g.state,0,'Lost Link');
   g.player1.switchPokemon(g.player1.bench[0]);g.player1.bench[0].moveTo(g.player1.discard);
   g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
   const v=snapshot?restore(g):{state:g.state,store:g.store};hit(v.store,v.state);expect(v.state.players[0].active.damage).toBe(50);
 });
});
