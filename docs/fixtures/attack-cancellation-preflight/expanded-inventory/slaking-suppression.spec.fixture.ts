import { ensureClientCards } from '../../client/cards';
import { setupGame,padDeck,getCardByName } from './test-helpers';
import { AttackAction } from '../../game/store/actions/game-actions';

describe('attack legality depends on actual Ability suppression',()=>{
 beforeAll(()=>ensureClientCards());
 for(const suppressed of [false,true])it('Slaking ex with no opposing ex or V, Garbotoxin active='+suppressed,()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Slaking ex SSP',energy:['Fire Energy SVE','Fire Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Charmander BS'},bench:[{card:'Garbodor DRX'}],deck:padDeck(10)}});
  g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];
  if(suppressed)g.player2.bench[0].tools.push(getCardByName('Air Balloon SSH'));
  const attack=g.player1.active.getPokemonCard()!.attacks[0];let result='success';
  try{g.store.dispatch(new AttackAction(g.player1.id,attack.name))}catch(error:any){result=error.message||String(error)}
  expect(result).toBe(suppressed?'success':'BLOCKED_BY_ABILITY');
  expect(g.store.state.players[1].active.damage).toBe(suppressed?280:0);
 });
});
