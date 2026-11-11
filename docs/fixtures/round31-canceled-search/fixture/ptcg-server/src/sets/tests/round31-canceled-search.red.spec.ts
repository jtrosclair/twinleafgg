import { CardManager } from '../../game/cards/card-manager';
import { Round31ToxelMEP, Round31FennekinMEP } from '../set-mega-evolution-promos/round31-prints';
import { ensureClientCards } from '../../client/cards';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
describe('MEP Call for Family under a real Sand Attack marker',()=>{
 beforeAll(()=>{ensureClientCards();const manager=CardManager.getInstance();for(const card of [new Round31ToxelMEP(),new Round31FennekinMEP()]) {if(!manager.isCardDefined(card.fullName))manager.defineSet([card]);expect(manager.getCardByName(card.fullName)).toEqual(jasmine.any(card.constructor as any));}});
 for(const copy of [false,true])for(const heads of [false,true])for(const name of ['Toxel MEP','Fennekin MEP'])it(name+' copy='+copy+' heads='+heads,()=>{
  const g=setupGame({turn:3,player1:{active:{card:copy?'Mew ex 30C':name,energy:[name==='Toxel MEP'?'Darkness Energy SVE':'Water Energy SVE']},bench:copy?[{card:name}]:[],deck:padDeck(12)},player2:{active:{card:'Hippopotas M3'},deck:padDeck(12)}});
  const hippopotas=g.player2.active.getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,hippopotas);
  const found=getCardByName('Bulbasaur BS');found.id=922001;g.player1.deck.cards.unshift(found);let searches=0,shuffles=0;
  const coins:boolean[]=[],cancelAtCoin:boolean[]=[],attacks:AttackEffect[]=[];const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((state:State,effect:Effect)=>{if(effect instanceof AttackEffect && effect.attack.name==='Call for Family')attacks.push(effect);if(effect instanceof CoinFlipEffect){const callback=effect.callback;effect.callback=value=>{coins.push(value);if(callback)callback(value);cancelAtCoin.push(attacks.some(attack=>attack.preventDefault))}}return reduce(state,effect)});
  spyOn(Math,'random').and.returnValue(heads?0.1:0.9);g.overridePrompt('Choose cards',(p:any)=>{searches++;return[p.cards.cards.indexOf(found)]});g.overridePrompt('Shuffle deck',()=>{shuffles++;return g.player1.deck.cards.map((_,i)=>i)});
  if(copy){g.overridePrompt('Choose attack',()=>({index:0,attack:'Call for Family'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Call for Family');
  expect(coins).toContain(heads);expect(cancelAtCoin).toContain(!heads);expect(searches).toBe(heads?1:0);expect(shuffles).toBe(heads?1:0);expect(g.player1.bench.some(s=>s.cards.includes(found))).toBe(heads);
 });
});
