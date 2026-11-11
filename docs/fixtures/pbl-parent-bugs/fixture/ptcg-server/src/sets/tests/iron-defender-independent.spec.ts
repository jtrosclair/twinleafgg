import { ensureClientCards } from '../../client/cards';
import { padDeck,setupGame } from './test-helpers';
import { playTrainerCard,useAttack,endTurn } from './card-test-helpers';
describe('Iron Defender target and turn scope',()=>{
 beforeAll(()=>ensureClientCards());
 it('does not reduce the playing player current-turn attack against opposing Metal',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Turtwig DP',energy:['Grass Energy SVE']},hand:['Iron Defender M1L'],deck:padDeck(12)},player2:{active:{card:'Meltan UNB'},deck:padDeck(12)}});const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];playTrainerCard(g.store,g.state,0,'Iron Defender M1L');useAttack(g.store,g.state,0,'Razor Leaf');expect(g.player2.active.damage).toBe(20);
 });
 it('reduces opponent attack against playing player Metal on next turn',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Meltan UNB'},hand:['Iron Defender M1L'],deck:padDeck(12)},player2:{active:{card:'Turtwig DP',energy:['Grass Energy SVE']},deck:padDeck(12)}});const target=g.player1.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];playTrainerCard(g.store,g.state,0,'Iron Defender M1L');endTurn(g.store,g.store.state);expect(g.store.state.activePlayer).toBe(1);useAttack(g.store,g.store.state,1,'Razor Leaf');expect(g.player1.active.damage).toBe(0);
 });
});
