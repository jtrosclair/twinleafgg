import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

function setup(sourceName='Sylveon ex SSP') {
 const g=setupGame({turn:5,player1:{active:{card:sourceName,energy:['Psychic Energy SVE','Fire Energy SVE','Fire Energy SVE']},bench:[{card:'Snorlax PGO'}],deck:padDeck(10)},player2:{active:{card:'Charizard ex OBF'},deck:padDeck(10)}});
 const source=g.player1.active.getPokemonCard()!;g.player2.active.getPokemonCard()!.hp=600;
 useAttack(g.store,g.state,0,'Magical Charm');g.player1.switchPokemon(g.player1.bench[0]);
 g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;return {...g,source};
}
function hit(store:Store,state:State) {
 const effect=new AttackEffect(state.players[1],state.players[0],{name:'Hit',cost:[],damage:150,text:''});
 store.reduceEffect(state,new DealDamageEffect(effect,150));
}
function move(g:ReturnType<typeof setup>,zone:'bench'|'discard'|'lostzone') {
 if(zone!=='bench')g.player1.bench[0].moveCardTo(g.source,g.player1[zone]);
}
function expire(store:Store,state:State) {state.phase=GamePhase.FINISHED;store.reduceEffect(state,new EndTurnEffect(state.players[1]));}

describe('Sylveon ex Magical Charm source-independent lifecycle',()=>{
 for(const sourceName of ['Sylveon ex SSP','Sylveon exSAR PRE'])for(const zone of ['bench','discard','lostzone'] as const) {
  it(sourceName+' applies the reduction once and expires after its source enters '+zone,()=>{
   const g=setup(sourceName);move(g,zone);hit(g.store,g.state);expect(g.player1.active.damage).toBe(50);
   expire(g.store,g.state);expect(g.player2.active.marker.hasMarker('DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER',g.source)).toBe(false);
   g.player1.active.damage=0;g.state.phase=GamePhase.ATTACK;hit(g.store,g.state);expect(g.player1.active.damage).toBe(150);
  });
 }
 it('retains the Lost Zone source and delayed effect across a stable serialized checkpoint',()=>{
  const g=setup();move(g,'lostzone');const lists=g.state.players.flatMap(p=>[p.active,...p.bench,p.deck,p.hand,p.discard,p.lostzone,p.stadium,p.supporter,...p.prizes]);
  const cards=Array.from(new Set(lists.flatMap(list=>list.cards)));cards.forEach((card,index)=>card.id=index);g.state.cardNames=cards.map(card=>card.fullName);
  StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());const serializer=new StateSerializer(),restored=serializer.deserialize(serializer.serialize(g.state));
  const store=new Store({onStateChange:()=>undefined});store.restoreState(restored);hit(store,restored);expect(restored.players[0].active.damage).toBe(50);
  const source=restored.players[0].lostzone.cards.find(c=>c.fullName==='Sylveon ex SSP')!;expire(store,restored);
  expect(restored.players[1].active.marker.hasMarker('DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER',source)).toBe(false);store.cleanup();
 });
});
