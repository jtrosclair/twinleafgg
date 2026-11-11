import { ensureClientCards } from '../../client/cards';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State } from '../../game/store/state/state';
import { getCardByName,padDeck,setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
describe('attack-specific hard restriction precedes Sand Attack flip',()=>{
 beforeAll(()=>ensureClientCards());
 for(const heads of [false,true])it('Meteor Assault cannot be reused; Sand Attack coin='+heads,()=>{
  const g=setupGame({turn:3,player1:{active:{card:"Galarian Sirfetch'd RCL",energy:['Fighting Energy SVE','Water Energy SVE','Water Energy SVE']},deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Sandshrew BS'}],deck:padDeck(12)}});
  const sir=g.player1.active.getPokemonCard() as any,sand=g.player2.bench[0].getPokemonCard()!;
  g.player1.active.marker.addMarker(sir.METEOR_ASSAULT_MARKER,sir);g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,sand);
  const seen:string[]=[],prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])seen.push(x.type);return prompt(s,p,cb)});
  g.overridePrompt('Coin flip',()=>heads);expect(()=>useAttack(g.store,g.state,0,'Meteor Assault')).toThrow();expect(seen).not.toContain('Coin flip');expect(g.player2.active.damage).toBe(0);
 });
});
