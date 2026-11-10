import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType } from '../../game/store/card/card-types';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PutDamagePrompt } from '../../game/store/prompts/put-damage-prompt';
import { Arbolivaex } from '../set-destined-rivals/arboliva-ex';

class TestMon extends PokemonCard { public name='Test'; public fullName='Test TST'; public set='TST'; public hp=500; }
function battle(kind:'weak'|'resist') {
  const state=new State(),player=new Player(),opponent=new Player(),card=new Arbolivaex();
  player.id=1;opponent.id=2;state.players=[player,opponent];state.activePlayer=0;state.phase=GamePhase.ATTACK;state.turn=3;
  player.active.cards=[card];const target=new TestMon();
  if(kind==='weak')target.weakness=[{type:CardType.GRASS}];else target.resistance=[{type:CardType.GRASS,value:-30}];
  opponent.active.cards=[target];const b=new PokemonCardList();b.cards=[new TestMon()];opponent.bench=[b];
  const store=new Store({onStateChange:()=>undefined});store.state=state;
  card.reduceEffect(store,state,new AttackEffect(player,opponent,card.attacks[0]));
  const prompt=state.prompts.find(p=>p instanceof PutDamagePrompt && p.result===undefined) as PutDamagePrompt;
  return {state,opponent,store,prompt};
}
function resolve(b:ReturnType<typeof battle>,active:number,bench:number){
  const target=(slot:SlotType)=>({player:PlayerType.TOP_PLAYER,slot,index:0});
  const result=[...(active?[{target:target(SlotType.ACTIVE),damage:active}]:[]),...(bench?[{target:target(SlotType.BENCH),damage:bench}]:[])];
  expect(b.prompt.validate(result,b.state)).toBe(true);(b.store as any).reducePrompt(b.state,new ResolvePromptAction(b.prompt.id,result));
}
describe('Upstream Arboliva ex Oil Machine Gun weakness and resistance',()=>{
  it('ignores Grass weakness when targeting the opposing Active',()=>{const b=battle('weak');resolve(b,120,0);expect(b.opponent.active.damage).toBe(120);});
  it('ignores Grass resistance when targeting the opposing Active',()=>{const b=battle('resist');resolve(b,120,0);expect(b.opponent.active.damage).toBe(120);});
  it('distributes damage to Active and Bench without Weakness or Resistance',()=>{const b=battle('weak');resolve(b,60,60);expect(b.opponent.active.damage).toBe(60);expect(b.opponent.bench[0].damage).toBe(60);});
});
