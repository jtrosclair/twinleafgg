import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { setupGame, padDeck } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
describe('Tapu Cure-GX real actions',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true])it('heals selected Bench Pokemon and consumes GX, copied='+copied,()=>{
  const g=setupGame({turn:4,player1:{active:{card:copied?'Mew ex 30C':'Tapu Lele-GX GRI',energy:['Psychic Energy SVE']},bench:copied?[{card:'Tapu Lele-GX GRI'},{card:'Charmander BS'}]:[{card:'Charmander BS'}],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  const idx=copied?1:0;g.player1.bench[idx].damage=40;
  g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:idx}]);
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Tapu Cure-GX'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Tapu Cure-GX');
  expect(g.player1.bench[idx].damage).toBe(0);expect(g.player1.usedGX).toBe(true);
 });
});
