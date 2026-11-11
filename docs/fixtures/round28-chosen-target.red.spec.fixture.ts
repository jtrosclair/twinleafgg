import { Round28ElectrikeMD64 } from '../set-majestic-dawn/electrike';
import { ensureClientCards } from '../../client/cards';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
class Bonus extends TrainerCard {
 public name='Bonus';public fullName='Bonus TEST';public set='TEST';public trainerType=TrainerType.STADIUM;
 public reduceEffect(_s:StoreLike,state:State,e:Effect):State {if(e instanceof AttackEffect)e.damage+=20;return state;}
}
function game(withBonus:boolean,manaphy=false){
 const g=setupGame({turn:2,player1:{active:{card:'Pikachu BS',energy:['Lightning Energy SVE']},deck:padDeck(15)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Charmander BS'},...(manaphy?[{card:'Manaphy BRS'}]:[])],deck:padDeck(15)}});
 g.player1.active.cards[0]=new Round28ElectrikeMD64();
 for(const s of [g.player2.active,...g.player2.bench]){const p=s.getPokemonCard();if(p){p.hp=1000;p.weakness=[];p.resistance=[];}}
 if(withBonus)g.player1.stadium.cards.push(new Bonus());return g;
}
describe('independent round28 chosen target audit',()=>{
 beforeAll(()=>ensureClientCards());
 it('target bench only with an attack damage bonus must not damage Active',()=>{
  const g=game(true);g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);useAttack(g.store,g.state,0,'Random Spark');
  expect(g.player2.active.damage).toBe(0);expect(g.player2.bench[0].damage).toBe(10);
 });
 it('target bench with a Manaphy has no bench damage',()=>{
  const g=game(false,true);g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);useAttack(g.store,g.state,0,'Random Spark');expect(g.player2.bench[0].damage).toBe(0);
 });
 it('target protected bench has no damage',()=>{
  const g=game(false);g.player2.bench[0].preventDamageNextTurn=true;g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);useAttack(g.store,g.state,0,'Random Spark');expect(g.player2.bench[0].damage).toBe(0);
 });
});
