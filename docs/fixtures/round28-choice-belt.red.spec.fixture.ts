import { Round28ElectrikeMD64 } from '../set-majestic-dawn/electrike';
import { ensureClientCards } from '../../client/cards';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
describe('targeted damage must receive attack modifiers against an Active Pokémon',()=>{
 beforeAll(()=>ensureClientCards());
 for(const copied of [false,true])it('Choice Belt adds 30 to '+(copied?'copied':'direct')+' targeted attack against an Active V',()=>{
  const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':'Pikachu BS',energy:['Lightning Energy SVE'],tools:['Choice Belt PAL']},bench:copied?[{card:'Pikachu BS'}]:[],deck:padDeck(10)},player2:{active:{card:'Mew V FST'},bench:[{card:'Charmander BS'}],deck:padDeck(10)}});
  if(copied)g.player1.bench[0].cards[0]=new Round28ElectrikeMD64();else g.player1.active.cards[0]=new Round28ElectrikeMD64();
  // setupGame duplicates the Tool in cards and tools; live attachment keeps it only in tools.
  const tool=g.player1.active.tools[0];g.player1.active.cards=g.player1.active.cards.filter(card=>card!==tool);
  const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
  g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.ACTIVE,index:0}]);
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Random Spark'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Random Spark');
  expect(g.player2.active.damage).toBe(40);
 });
});

import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
class AttackBoostFixture extends TrainerCard {
 public name='Boost Fixture';public fullName='Boost Fixture TST';public set='TST';public setNumber='1';public trainerType=TrainerType.STADIUM;
 public reduceEffect(_store:StoreLike,state:State,effect:Effect):State {if(effect instanceof AttackEffect && effect.attack.name==='Random Spark')effect.damage+=20;return state;}
}
describe('targeted attack base modifiers',()=>{
 beforeAll(()=>ensureClientCards());
 for(const copied of [false,true])it((copied?'copied':'direct')+' targeting Bench must not also damage the Active',()=>{
  const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':'Pikachu BS',energy:['Lightning Energy SVE']},bench:copied?[{card:'Pikachu BS'}]:[],deck:padDeck(10)},player2:{active:{card:'Mew V FST'},bench:[{card:'Charmander BS'}],deck:padDeck(10)}});
  if(copied)g.player1.bench[0].cards[0]=new Round28ElectrikeMD64();else g.player1.active.cards[0]=new Round28ElectrikeMD64();
  g.player1.stadium.cards=[new AttackBoostFixture()];const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
  g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Random Spark'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Random Spark');
  expect(g.player2.active.damage).toBe(0);expect(g.player2.bench[0].damage).toBe(10);
 });
});
