import { PokemonCard } from '../../game/store/card/pokemon-card';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { Store } from '../../game/store/store';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Bouffalant } from '../set-stellar-crown/bouffalant';
import { Mewex } from '../set-30th-celebration/mew-ex';

class Dummy extends PokemonCard { public name='Dummy';public fullName='Dummy TEST';public hp=500;public set='TEST'; }

describe('Bouffalant SCR Boundless Power next-turn restriction',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true])it('marks the attacker unable to attack on its next turn, copied='+copied,()=>{
  const state=new State(),player=new Player(),opponent=new Player(),card=new Bouffalant(),mew=new Mewex();
  player.id=1;opponent.id=2;state.players=[player,opponent];state.turn=2;state.activePlayer=0;state.phase=GamePhase.ATTACK;
  player.active.cards=[copied?mew:card];opponent.active.cards=[new Dummy()];
  const store=new Store({onStateChange:()=>undefined});store.state=state;const attacks=copied?cloneAttacks(card.attacks):card.attacks;
  if(copied)openCopyAttackSession(state,player,mew,card,attacks,attacks[0]);
  store.reduceEffect(state,new AttackEffect(player,opponent,attacks[0]));
  expect(player.active.cannotAttackNextTurnPending).toBe(true);
 });
});
