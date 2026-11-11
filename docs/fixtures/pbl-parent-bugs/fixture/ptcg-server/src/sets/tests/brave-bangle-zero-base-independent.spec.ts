import { ensureClientCards } from '../../client/cards';
import { getCardByName,padDeck,setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
describe('Brave Bangle on a 0+ printed attack',()=>{
 beforeAll(()=>ensureClientCards());
 for(const withTool of [false,true])it('Groudon Brutal Lands with Legendary Stadium, tool='+withTool,()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Groudon M6',energy:['Fighting Energy SVE','Fighting Energy SVE','Fighting Energy SVE']},deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  const defender=g.player2.active.getPokemonCard()!;defender.hp=1000;defender.weakness=[];defender.resistance=[];
  g.player1.stadium.cards.push(getCardByName('Legendary Lava Lake (Left) M6'));g.player1.stadium.cards.push(getCardByName('Legendary Lava Lake (Right) M6'));
  if(withTool)g.player1.active.tools.push(getCardByName('Brave Bangle SV11W'));
  useAttack(g.store,g.state,0,'Brutal Lands');expect(g.player2.active.damage).toBe(withTool?200:170);
 });
});
