import { padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';

describe('Tuck Tail source identity before AfterAttack',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true])it('returns the original attacker after a damage-boundary switch, copied='+copied,()=>{
  const fire='Fire Energy SVE';const g=setupGame({turn:5,player1:{active:{card:copied?'Mew ex 30C':'Meowth ex POR',energy:[fire,fire,fire]},bench:copied?[{card:'Meowth ex POR'},{card:'Charmander BS'}]:[{card:'Charmander BS'}],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  const attacker=g.player1.active,replacement=g.player1.bench[copied?1:0],attackerCard=attacker.getPokemonCard()!,replacementCard=replacement.getPokemonCard()!,defender=g.player2.active;defender.getPokemonCard()!.hp=1000;defender.getPokemonCard()!.weakness=[];defender.getPokemonCard()!.resistance=[];
  const reduce=g.store.reduceEffect.bind(g.store);let switched=false;
  spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const result=reduce(s,e);if(!switched&&e instanceof AfterDamageEffect&&e.target===defender&&g.player1.active===attacker){switched=true;g.player1.switchPokemon(replacement);}return result;});
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Tuck Tail'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Tuck Tail');
  expect(switched).toBe(true);expect(g.player1.hand.cards).toContain(attackerCard);expect(g.player1.hand.cards).not.toContain(replacementCard);expect(g.player1.active.getPokemonCard()).toBe(replacementCard);
 });
});
