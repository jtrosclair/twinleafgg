import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { Aggron } from '../set-unbroken-bonds/aggron';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';
import { PowerType } from '../../game/store/card/pokemon-types';

class Energy extends EnergyCard { public name='Energy'; public fullName='Energy TST'; public set='TST'; public provides=[CardType.METAL,CardType.METAL,CardType.METAL,CardType.METAL]; }
class Opponent extends PokemonCard { public name='Opponent'; public fullName='Opponent TST'; public set='TST'; public hp=500; }
class AggronWithAbility extends Aggron {
  public powers=[{name:'Unrelated passive',powerType:PowerType.ABILITY,text:'Fixture only'}];
  public reduceEffect(store:StoreLike,state:State,effect:Effect):State {
    state=super.reduceEffect(store,state,effect);
    if(effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) effect.source.damage+=1000;
    return state;
  }
}
class AggronReprint extends Aggron { public set='REPRINT'; public fullName='Aggron REPRINT'; }
function battle() {
  const state=new State(),player=new Player(),opponent=new Player(),mew=new Mewex(),aggron=new Aggron();
  player.id=1;opponent.id=2;state.players=[player,opponent];state.turn=3;state.activePlayer=0;state.phase=GamePhase.PLAYER_TURN;
  player.active.cards=[mew,new Energy()];opponent.active.cards=[new Opponent()];
  const bench=new PokemonCardList();bench.cards=[aggron];player.bench=[bench];
  const store=new Store({onStateChange:()=>undefined});store.state=state;
  return {state,player,opponent,mew,aggron,store};
}
function resolve(b:ReturnType<typeof battle>, value:any) {
  const p=b.state.prompts.filter(p=>p.result===undefined).pop();
  if(!p) throw new Error('Expected pending prompt');
  (b.store as any).reducePrompt(b.state,new ResolvePromptAction(p.id,value));
}
function copy(b:ReturnType<typeof battle>,index=0) {
  b.store.reduceEffect(b.state,new PowerEffect(b.player,b.mew.powers[0],b.mew));
  resolve(b,b.aggron.attacks[index]);
  b.state.phase=GamePhase.FINISHED;resolve(b,null);
  b.state.activePlayer=1;b.state.phase=GamePhase.ATTACK;
}
function hit(b:ReturnType<typeof battle>,damage=30) {
  const attack=new AttackEffect(b.opponent,b.player,{name:'Test Hit',cost:[],damage,text:''});
  b.store.reduceEffect(b.state,new DealDamageEffect(attack,damage));
}
describe('Copied Aggron Extra-Tight Press retaliation',()=>{
  beforeEach(()=>clearCopyAttackSessionsForTests());
  it('places eight counters on the attacker when copied Pokémon is damaged',()=>{
    const b=battle();copy(b);expect(b.opponent.active.damage).toBe(80);
    hit(b);expect(b.player.active.damage).toBe(30);expect(b.opponent.active.damage).toBe(160);
  });
  it('still retaliates when the damage is lethal',()=>{
    const b=battle();copy(b);b.player.active.damage=b.mew.hp-10;
    hit(b,30);expect(b.opponent.active.damage).toBe(160);
    const ko=new KnockOutEffect(b.player,b.player.active);b.store.reduceEffect(b.state,ko);
    expect(b.player.discard.cards).toContain(b.mew);expect(ko.prizeCount).toBe(2);
  });
  it('does not retaliate after the opponent turn has ended',()=>{
    const b=battle();copy(b);b.state.phase=GamePhase.FINISHED;
    b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));
    b.state.phase=GamePhase.ATTACK;hit(b);expect(b.opponent.active.damage).toBe(80);
  });
  it('does not retaliate when Aggron copied its other attack',()=>{
    const b=battle();copy(b,1);const before=b.opponent.active.damage;hit(b);
    expect(b.opponent.active.damage).toBe(before);
  });
  it('does not invoke unrelated unguarded source Ability code on incoming damage',()=>{
    const b=battle(),source=new AggronWithAbility();b.aggron=source;b.player.bench[0].cards=[source];
    copy(b);hit(b);expect(b.opponent.active.damage).toBe(160);
  });
  it('retains the reaction when a metadata-only reprint is copied',()=>{
    const b=battle(),source=new AggronReprint();b.aggron=source;b.player.bench[0].cards=[source];
    copy(b);hit(b);expect(b.opponent.active.damage).toBe(160);
  });
  it('keeps the original Pokémon’s attack retaliation exactly once',()=>{
    const b=battle();b.player.active.cards=[b.aggron,new Energy()];b.player.bench=[];
    b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,b.aggron.attacks[0]));
    b.state.activePlayer=1;b.state.phase=GamePhase.ATTACK;hit(b);
    expect(b.opponent.active.damage).toBe(80);
  });
  it('restores the attack-owned reaction after save and the source moves to the Lost Zone',()=>{
    const b=battle();copy(b);b.player.bench[0].moveCardTo(b.aggron,b.player.lostzone);
    const cards=[...b.player.active.cards,...b.player.lostzone.cards,...b.opponent.active.cards];
    cards.forEach((card,index)=>{card.id=index;});b.state.cardNames=cards.map(card=>card.fullName);
    StateSerializer.setKnownCards([new Mewex(),new Energy(),new Aggron(),new Opponent()]);
    const serializer=new StateSerializer(),state=serializer.deserialize(serializer.serialize(b.state));
    const store=new Store({onStateChange:()=>undefined});store.restoreState(state);
    const player=state.players[0],opponent=state.players[1];
    const attack=new AttackEffect(opponent,player,{name:'Test Hit',cost:[],damage:30,text:''});
    store.reduceEffect(state,new DealDamageEffect(attack,30));
    expect(player.active.damage).toBe(30);expect(opponent.active.damage).toBe(160);
  });
});
