import { ensureClientCards } from '../../client/cards';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
describe('non-targeted attack cancellation compatibility',()=>{
 beforeAll(()=>ensureClientCards());
 it('records ordinary Scratch under an explicitly loaded Sand Attack tails marker',()=>{
  const g=setupGame({turn:2,player1:{active:{card:'Charmander BS',energy:['Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew V FST'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});const p=g.player2.active.getPokemonCard()!;p.hp=1000;p.weakness=[];p.resistance=[];const s=g.player2.bench[0].getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,s);g.overridePrompt('Coin flip',()=>false);useAttack(g.store,g.state,0,'Scratch');expect(g.player2.active.damage).toBe(0);
 });
 it('records Clefable Metronome copying Scratch under an explicitly loaded tails marker',()=>{
  const g=setupGame({turn:2,player1:{active:{card:'Clefable JU',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Charmander BS'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});const p=g.player2.active.getPokemonCard()!;p.hp=1000;p.weakness=[];p.resistance=[];const s=g.player2.bench[0].getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,s);g.overridePrompt('Coin flip',()=>false);g.overridePrompt('Choose attack',()=>({index:0,attack:'Scratch'}));useAttack(g.store,g.state,0,'Metronome');expect(g.player2.active.damage).toBe(0);
 });
});
