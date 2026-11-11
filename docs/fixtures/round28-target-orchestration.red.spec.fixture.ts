import { ensureClientCards } from '../../client/cards';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
it('a copy handler can set preventDefault to orchestrate its prompt without canceling the copy',()=>{
 ensureClientCards();const g=setupGame({turn:2,player1:{active:{card:'M Gengar-EX PHF',energy:['Psychic Energy SVE','Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Electrike MD'},bench:[{card:'Charmander BS'}],deck:padDeck(10)}});
 for(const slot of [g.player2.active,g.player2.bench[0]]){const c=slot.getPokemonCard()!;c.hp=1000;c.weakness=[];c.resistance=[];}
 const mega=g.player1.active.getPokemonCard()!,original=mega.reduceEffect.bind(mega);spyOn(mega,'reduceEffect').and.callFake((s:StoreLike,state:State,effect:Effect)=>{if(effect instanceof AttackEffect&&effect.attack.name==='Phantom Gate')effect.preventDefault=true;return original(s,state,effect)});
 g.overridePrompt('Choose attack',()=>({index:1,attack:'Random Spark'}));g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);useAttack(g.store,g.state,0,'Phantom Gate');expect(g.player2.active.damage).toBe(0);expect(g.player2.bench[0].damage).toBe(10);
});
