import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardTag, CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckRetreatCostEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Zoroark } from '../set-breakpoint/zoroark';
import { Meganium } from '../set-breakpoint/meganium';
import { Metagross } from '../set-vivid-voltage/metagross';
import { LatiosGx } from '../set-unified-minds/latios-gx';
import { LatiosGx2, LatiosGx3 } from '../set-unified-minds/other-prints';
import { Slakingex } from '../set-surging-sparks/slaking-ex';
import { CobalionGX } from '../set-team-up/cobalion-gx';
import { Pinsir } from '../set-evolving-skies/pinsir';
import { Seviper } from '../set-phantasmal-flames/seviper';
import { Vanilluxe } from '../set-paradox-rift/vanilluxe';
import { Jumpluff } from '../set-evolving-skies/jumpluff';
import { Machamp } from '../set-plasma-blast/machamp';
import { Turtonator } from '../set-perfect-order/turtonator';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';

class Dummy extends PokemonCard { public name='Dummy'; public fullName='Dummy TEST'; public hp=500; public set='TEST'; }
class SideEffectDummy extends Dummy {
  public reduceEffect(_store:StoreLike,state:State,effect:Effect):State {
    if(effect instanceof AttackEffect && effect.player.active.getPokemonCard()===this) (state as any).attackSideEffects=((state as any).attackSideEffects || 0)+1;
    return state;
  }
}
class NestedAttackDummy extends Dummy {
  public reduceEffect(store:StoreLike,state:State,effect:Effect):State {
    if(effect instanceof AttackEffect && effect.player.active.getPokemonCard()===this) {
      (state as any).outerCalls=((state as any).outerCalls || 0)+1;
      const other=state.players.find(player=>player!==effect.player)!;
      store.reduceEffect(state,new AttackEffect(other,effect.player,{name:'Nested',cost:[],damage:0,text:''}));
    }
    return state;
  }
}
class ModifiedMetagross extends Metagross {
  public reduceEffect(store:StoreLike,state:State,effect:Effect):State { return super.reduceEffect(store,state,effect); }
}
class BasicEnergy extends EnergyCard { public name='Basic Energy'; public fullName='Basic Energy TEST'; public set='TEST'; public provides=[CardType.FIGHTING]; }
function battle(card: PokemonCard, copied: boolean, index=0) {
  const state=new State(), player=new Player(), opponent=new Player(), mew=new Mewex();
  player.id=1; opponent.id=2; state.players=[player,opponent]; state.turn=2; state.activePlayer=0; state.phase=GamePhase.ATTACK;
  player.active.cards=[copied ? mew : card]; opponent.active.cards=[new Dummy()];
  const store=new Store({onStateChange:()=>undefined}); store.state=state;
  const attacks=copied ? cloneAttacks(card.attacks) : card.attacks;
  if(copied) openCopyAttackSession(state,player,mew,card,attacks,attacks[index]);
  return { state,player,opponent,store,mew,card,attack:new AttackEffect(player,opponent,attacks[index]) };
}
function disableAbility(b:ReturnType<typeof battle>) {
  const reduce=b.store.reduceEffect.bind(b.store);
  spyOn(b.store,'reduceEffect').and.callFake((state:State,effect:Effect)=>{
    if(effect instanceof PowerEffect) throw new Error('Ability disabled');
    return reduce(state,effect);
  });
}
function resolveWait(b:ReturnType<typeof battle>) {
  const prompt=b.state.prompts.filter(p=>p.result===undefined).pop();if(!prompt) throw new Error('Expected wait prompt');
  (b.store as any).reducePrompt(b.state,new ResolvePromptAction(prompt.id,null));
}
describe('explicit ownership migration - real cards and delayed opponent attacks',()=>{
  beforeEach(()=>clearCopyAttackSessionsForTests());
  for(const copied of [false,true]) it('Zoroark Mind Jack counts the opponent bench, copied='+copied,()=>{
    const b=battle(new Zoroark(),copied); const bench=new PokemonCardList(); bench.cards=[new Dummy()];b.opponent.bench=[bench];
    b.store.reduceEffect(b.state,b.attack); expect(b.attack.damage).toBe(40);
  });
  it('Meganium keeps Overgrow direct and excludes it from a copied attack',()=>{
    const direct=battle(new Meganium(),false); direct.player.active.damage=110;direct.store.reduceEffect(direct.state,direct.attack);
    expect(direct.attack.damage).toBe(120);
    const copy=battle(new Meganium(),true);copy.player.active.damage=110;copy.store.reduceEffect(copy.state,copy.attack);
    expect(copy.attack.damage).toBe(50);
  });
  it('Meganium attack still works with its own Ability disabled',()=>{
    const b=battle(new Meganium(),false);b.player.active.damage=110;disableAbility(b);b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(50);
  });
  it('Latios Power Bind blocks the direct attack and is absent from the copy',()=>{
    const direct=battle(new LatiosGx(),false);expect(()=>direct.store.reduceEffect(direct.state,direct.attack)).toThrow();
    const copy=battle(new LatiosGx(),true);expect(()=>copy.store.reduceEffect(copy.state,copy.attack)).not.toThrow();
    expect(copy.player.active.marker.hasMarker((copy.card as LatiosGx).TAG_PURGE_MARKER,copy.mew)).toBe(true);
    copy.state.activePlayer=1;const tag=new Dummy();tag.tags=[CardTag.TAG_TEAM];copy.opponent.active.cards=[tag];
    const hit=new AttackEffect(copy.opponent,copy.player,{name:'Hit',cost:[],damage:100,text:''});
    copy.store.reduceEffect(copy.state,new DealDamageEffect(hit,100));expect(copy.player.active.damage).toBe(0);
  });
  it('Latios attacks when Power Bind is disabled',()=>{
    const b=battle(new LatiosGx(),false);disableAbility(b);expect(()=>b.store.reduceEffect(b.state,b.attack)).not.toThrow();
  });
  for(const make of [()=>new LatiosGx2(),()=>new LatiosGx3()]) it('Latios alternate print inherits the attack-only defense and retains its identity',()=>{
    const source=make(),name=source.fullName,b=battle(source,true);b.store.reduceEffect(b.state,b.attack);b.state.activePlayer=1;
    const tag=new Dummy();tag.tags=[CardTag.TAG_TEAM];b.opponent.active.cards=[tag];
    const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:100,text:''});b.store.reduceEffect(b.state,new DealDamageEffect(hit,100));
    expect(b.player.active.damage).toBe(0);expect(source.fullName).toBe(name);
  });
  it('Slaking Born to Slack blocks its direct attack but not the copy',()=>{
    const direct=battle(new Slakingex(),false);expect(()=>direct.store.reduceEffect(direct.state,direct.attack)).toThrow();
    const copy=battle(new Slakingex(),true);copy.player.active.cards.push(new BasicEnergy());
    expect(()=>copy.store.reduceEffect(copy.state,copy.attack)).not.toThrow();expect(copy.state.prompts.length).toBeGreaterThan(0);
  });
  it('Slaking permits its own attack when Born to Slack is disabled',()=>{
    const b=battle(new Slakingex(),false);b.player.active.cards.push(new BasicEnergy());disableAbility(b);
    expect(()=>b.store.reduceEffect(b.state,b.attack)).not.toThrow();expect(b.state.prompts.length).toBeGreaterThan(0);
  });
  for(const copied of [false,true]) it('Metagross Leg Quake blocks the next opposing attack then expires, copied='+copied,()=>{
    const b=battle(new Metagross(),copied);(b.opponent.active.cards[0] as PokemonCard).stage=Stage.STAGE_1;
    b.store.reduceEffect(b.state,b.attack);b.state.activePlayer=1;
    const incoming=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});
    expect(()=>b.store.reduceEffect(b.state,incoming)).toThrow();
    b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));
    expect(()=>b.store.reduceEffect(b.state,incoming)).not.toThrow();
  });
  it('copied Leg Quake persists after its user is bounced, and ends after the opposing turn',()=>{
    const b=battle(new Metagross(),true);(b.opponent.active.cards[0] as PokemonCard).stage=Stage.STAGE_1;b.store.reduceEffect(b.state,b.attack);
    b.player.active.moveTo(b.player.hand);b.player.active.cards=[new Dummy()];b.state.activePlayer=1;b.store.reduceEffect(b.state,new CheckRetreatCostEffect(b.player));
    const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});expect(()=>b.store.reduceEffect(b.state,hit)).toThrow();
    b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));expect(()=>b.store.reduceEffect(b.state,hit)).not.toThrow();
  });
  it('Leg Quake ends when the defending Pokemon switches out, even if it switches back',()=>{
    const b=battle(new Metagross(),true);(b.opponent.active.cards[0] as PokemonCard).stage=Stage.STAGE_1;b.store.reduceEffect(b.state,b.attack);
    const replacement=new PokemonCardList();replacement.cards=[new Dummy()];b.opponent.bench=[replacement];b.opponent.switchPokemon(replacement);
    b.opponent.switchPokemon(b.opponent.bench[0]);b.state.activePlayer=1;
    const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});expect(()=>b.store.reduceEffect(b.state,hit)).not.toThrow();
  });
  it('copied Leg Quake preflights blocked attacks without running attacker side effects, and permits a switched-in attacker exactly once',()=>{
    const b=battle(new Metagross(),true), original=new SideEffectDummy();original.stage=Stage.STAGE_1;b.opponent.active.cards=[original];
    b.store.reduceEffect(b.state,b.attack);b.state.activePlayer=1;
    const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});
    const originalAttacks=b.mew.attacks;expect(()=>b.store.reduceEffect(b.state,hit)).toThrow();expect((b.state as any).attackSideEffects).toBeUndefined();
    expect(b.mew.attacks).toBe(originalAttacks);expect((b.mew as any).LEG_QUAKE_MARKER).toBeUndefined();
    const other=new SideEffectDummy(), bench=new PokemonCardList();bench.cards=[other];b.opponent.bench=[bench];b.opponent.switchPokemon(bench);
    const legal=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});
    b.store.reduceEffect(b.state,legal);expect((b.state as any).attackSideEffects).toBe(1);
  });
  it('allows a nested same-owner attack during an unblocked opponent action without reentering its preflight',()=>{
    const b=battle(new Metagross(),true),first=new SideEffectDummy();first.stage=Stage.STAGE_1;b.opponent.active.cards=[first];b.store.reduceEffect(b.state,b.attack);
    const other=new NestedAttackDummy(),bench=new PokemonCardList();bench.cards=[other];b.opponent.bench=[bench];b.opponent.switchPokemon(bench);b.state.activePlayer=1;
    const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});b.store.reduceEffect(b.state,hit);expect((b.state as any).outerCalls).toBe(1);
  });
  it('does not trust an inherited opponent reaction after a subclass changes the normal reducer',()=>{
    const b=battle(new ModifiedMetagross(),true);(b.opponent.active.cards[0] as PokemonCard).stage=Stage.STAGE_1;
    b.store.reduceEffect(b.state,b.attack);b.state.activePlayer=1;
    const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});
    expect(()=>b.store.reduceEffect(b.state,hit)).not.toThrow();
  });
  it('keeps independently copied opponent restrictions and separate game states isolated',()=>{
    const a=battle(new Metagross(),true),b=battle(new Metagross(),true);
    (a.opponent.active.cards[0] as PokemonCard).stage=Stage.STAGE_1;(b.opponent.active.cards[0] as PokemonCard).stage=Stage.STAGE_1;
    a.store.reduceEffect(a.state,a.attack);b.store.reduceEffect(b.state,b.attack);a.state.activePlayer=1;b.state.activePlayer=1;
    const hitA=new AttackEffect(a.opponent,a.player,{name:'Hit',cost:[],damage:30,text:''});
    const hitB=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});
    expect(()=>a.store.reduceEffect(a.state,hitA)).toThrow();
    a.store.reduceEffect(a.state,new EndTurnEffect(a.opponent));expect(()=>a.store.reduceEffect(a.state,hitA)).not.toThrow();
    expect(()=>b.store.reduceEffect(b.state,hitB)).toThrow();
  });
  it('restores a copied opponent-attack restriction from a serialized checkpoint',()=>{
    const b=battle(new Metagross(),true),bench=new PokemonCardList();bench.cards=[b.card];b.player.bench=[bench];
    (b.opponent.active.cards[0] as PokemonCard).stage=Stage.STAGE_1;b.store.reduceEffect(b.state,b.attack);b.state.activePlayer=1;
    const cards=[...b.player.active.cards,...b.player.bench.flatMap(slot=>slot.cards),...b.opponent.active.cards];
    cards.forEach((card,index)=>card.id=index);b.state.cardNames=cards.map(card=>card.fullName);
    StateSerializer.setKnownCards([new Mewex(),new Metagross(),new Dummy()]);
    const serializer=new StateSerializer(),restored=serializer.deserialize(serializer.serialize(b.state));clearCopyAttackSessionsForTests();
    const store=new Store({onStateChange:()=>undefined});store.restoreState(restored);
    const hit=new AttackEffect(restored.players[1],restored.players[0],{name:'Hit',cost:[],damage:30,text:''});expect(()=>store.reduceEffect(restored,hit)).toThrow();
  });
  it('enforces two independent copied restrictions in one game without duplicating a legal attack',()=>{
    const b=battle(new Metagross(),true), attacker=new SideEffectDummy();attacker.stage=Stage.STAGE_1;b.opponent.active.cards=[attacker];
    b.store.reduceEffect(b.state,b.attack);
    const second=new Mewex(), bench=new PokemonCardList();bench.cards=[second];b.player.bench=[bench];b.player.switchPokemon(bench);
    const source=new CobalionGX(), attacks=cloneAttacks(source.attacks);openCopyAttackSession(b.state,b.player,second,source,attacks,attacks[1]);
    b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,attacks[1]));b.state.activePlayer=1;
    const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});
    expect(()=>b.store.reduceEffect(b.state,hit)).toThrow();expect((b.state as any).attackSideEffects).toBeUndefined();
    b.opponent.active.marker.removeMarker((b.card as Metagross).LEG_QUAKE_MARKER,b.mew);
    expect(()=>b.store.reduceEffect(b.state,hit)).toThrow();expect((b.state as any).attackSideEffects).toBeUndefined();
    b.opponent.marker.removeMarker(source.IRON_RULE_MARKER,second);
    b.store.reduceEffect(b.state,hit);expect((b.state as any).attackSideEffects).toBe(1);
  });
  it('retains an earlier player restriction when the same Pokemon copies another attack',()=>{
    const b=battle(new CobalionGX(),true,1);b.store.reduceEffect(b.state,b.attack);
    const source=new Zoroark(),attacks=cloneAttacks(source.attacks);openCopyAttackSession(b.state,b.player,b.mew,source,attacks,attacks[0]);
    b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,attacks[0]));b.state.activePlayer=1;
    const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});expect(()=>b.store.reduceEffect(b.state,hit)).toThrow();
    b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));expect(()=>b.store.reduceEffect(b.state,hit)).not.toThrow();
  });
  it('restores two copied sessions on the same Pokemon without losing the older restriction',()=>{
    const b=battle(new CobalionGX(),true,1),first=new PokemonCardList();first.cards=[b.card];b.player.bench=[first];b.store.reduceEffect(b.state,b.attack);
    const source=new Zoroark(),second=new PokemonCardList();second.cards=[source];b.player.bench.push(second);
    const attacks=cloneAttacks(source.attacks);openCopyAttackSession(b.state,b.player,b.mew,source,attacks,attacks[0]);b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,attacks[0]));b.state.activePlayer=1;
    const cards=[...b.player.active.cards,...b.player.bench.flatMap(slot=>slot.cards),...b.opponent.active.cards];cards.forEach((card,index)=>card.id=index);b.state.cardNames=cards.map(card=>card.fullName);
    StateSerializer.setKnownCards([new Mewex(),new CobalionGX(),new Zoroark(),new Dummy()]);const serializer=new StateSerializer();
    const restored=serializer.deserialize(serializer.serialize(b.state));clearCopyAttackSessionsForTests();const store=new Store({onStateChange:()=>undefined});store.restoreState(restored);
    const hit=new AttackEffect(restored.players[1],restored.players[0],{name:'Hit',cost:[],damage:30,text:''});expect(()=>store.reduceEffect(restored,hit)).toThrow();
  });
  it('Metagross Levitation Field remains direct and can be disabled',()=>{
    const b=battle(new Metagross(),false), cost=new CheckRetreatCostEffect(b.player);b.store.reduceEffect(b.state,cost);expect(cost.cost).toEqual([]);
    disableAbility(b);const blocked=new CheckRetreatCostEffect(b.player);b.store.reduceEffect(b.state,blocked);expect(blocked.cost.length).toBe(3);
  });
  for(const copied of [false,true]) it('Cobalion Iron Rule blocks opponent then expires, copied='+copied,()=>{
    const b=battle(new CobalionGX(),copied,1);b.store.reduceEffect(b.state,b.attack);b.state.activePlayer=1;
    const incoming=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});
    expect(()=>b.store.reduceEffect(b.state,incoming)).toThrow();
    b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));
    expect(()=>b.store.reduceEffect(b.state,incoming)).not.toThrow();
  });
  for(const zone of ['hand','discard'] as const) it('copied Iron Rule persists when its user leaves play for '+zone,()=>{
    const b=battle(new CobalionGX(),true,1);b.store.reduceEffect(b.state,b.attack);b.store.reduceEffect(b.state,new EndTurnEffect(b.player));
    b.player.active.moveTo(b.player[zone]);b.player.active.cards=[new Dummy()];
    b.state.activePlayer=1;b.store.reduceEffect(b.state,new CheckRetreatCostEffect(b.player));
    const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});expect(()=>b.store.reduceEffect(b.state,hit)).toThrow();
    b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));expect(()=>b.store.reduceEffect(b.state,hit)).not.toThrow();
  });
  it('restores detached Iron Rule from a serialized checkpoint',()=>{
    const b=battle(new CobalionGX(),true,1),bench=new PokemonCardList();bench.cards=[b.card];b.player.bench=[bench];b.store.reduceEffect(b.state,b.attack);
    b.player.active.moveTo(b.player.discard);b.player.active.cards=[new Dummy()];b.state.activePlayer=1;
    const cards=[...b.player.active.cards,...b.player.bench.flatMap(slot=>slot.cards),...b.player.discard.cards,...b.opponent.active.cards];
    cards.forEach((card,index)=>card.id=index);b.state.cardNames=cards.map(card=>card.fullName);
    StateSerializer.setKnownCards([new Mewex(),new CobalionGX(),new Dummy()]);const serializer=new StateSerializer();
    const restored=serializer.deserialize(serializer.serialize(b.state));clearCopyAttackSessionsForTests();const store=new Store({onStateChange:()=>undefined});store.restoreState(restored);
    const hit=new AttackEffect(restored.players[1],restored.players[0],{name:'Hit',cost:[],damage:30,text:''});expect(()=>store.reduceEffect(restored,hit)).toThrow();
    store.reduceEffect(restored,new EndTurnEffect(restored.players[1]));expect(()=>store.reduceEffect(restored,hit)).not.toThrow();
  });
  it('copied Iron Rule survives the real knockout reducer and expires normally',()=>{
    const b=battle(new CobalionGX(),true,1);b.store.reduceEffect(b.state,b.attack);b.state.activePlayer=1;
    b.store.reduceEffect(b.state,new KnockOutEffect(b.player,b.player.active));expect(b.player.discard.cards).toContain(b.mew);
    b.player.active.cards=[new Dummy()];const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:30,text:''});
    expect(()=>b.store.reduceEffect(b.state,hit)).toThrow();b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));expect(()=>b.store.reduceEffect(b.state,hit)).not.toThrow();
  });
  it('Cobalion Metal Symbol removes a condition directly and respects Ability suppression',()=>{
    const b=battle(new CobalionGX(),false),energy=new BasicEnergy();energy.provides=[CardType.METAL];b.player.active.cards.push(energy);
    b.player.active.specialConditions=[SpecialCondition.POISONED];b.store.reduceEffect(b.state,new CheckTableStateEffect([5,5]));expect(b.player.active.specialConditions).toEqual([]);
    b.player.active.specialConditions=[SpecialCondition.POISONED];disableAbility(b);b.store.reduceEffect(b.state,new CheckTableStateEffect([5,5]));
    expect(b.player.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });
  it('Pinsir Single Strike resistance Ability remains direct and can be disabled',()=>{
    const b=battle(new Pinsir(),false);b.store.reduceEffect(b.state,b.attack);expect(b.attack.ignoreResistance).toBe(true);
    disableAbility(b);const hit=new AttackEffect(b.player,b.opponent,b.card.attacks[0]);b.store.reduceEffect(b.state,hit);expect(hit.ignoreResistance).toBe(false);
  });
  it('copied Pinsir attack does not grant its Ability to a Single Strike copycat',()=>{
    const b=battle(new Pinsir(),true);b.mew.tags.push(CardTag.SINGLE_STRIKE);b.store.reduceEffect(b.state,b.attack);expect(b.attack.ignoreResistance).toBe(false);
  });
  it('copied Seviper attack does not grant its Ability even with a Darkness ex in play',()=>{
    const b=battle(new Seviper(),true),ex=new Dummy();ex.cardType=CardType.DARK;ex.tags=[CardTag.POKEMON_ex];
    const bench=new PokemonCardList();bench.cards=[ex];b.player.bench=[bench];b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(120);
  });
  it('Seviper Excite Power remains direct and can be disabled',()=>{
    const b=battle(new Seviper(),false),ex=new Dummy();ex.cardType=CardType.DARK;ex.tags=[CardTag.POKEMON_ex];
    const bench=new PokemonCardList();bench.cards=[ex];b.player.bench=[bench];b.store.reduceEffect(b.state,b.attack);expect(b.attack.damage).toBe(240);
    disableAbility(b);const attack=new AttackEffect(b.player,b.opponent,b.card.attacks[0]);b.store.reduceEffect(b.state,attack);expect(attack.damage).toBe(120);
  });
  it('Jumpluff Fluffy Barrage tracks its direct Ability but is not copied',()=>{
    const direct=battle(new Jumpluff(),false);disableAbility(direct);direct.store.reduceEffect(direct.state,direct.attack);expect((direct.card.powers[0] as any).barrage).toBe(false);
    const copy=battle(new Jumpluff(),true);copy.store.reduceEffect(copy.state,copy.attack);expect((copy.mew.powers[0] as any).barrage).toBeUndefined();
  });
  it('Vanilluxe Frigid Room blocks the opposing attack and respects Ability suppression',()=>{
    const b=battle(new Vanilluxe(),false);b.opponent.active.cards=[b.card];const attacker=new Dummy();b.player.active.cards=[attacker];b.player.active.damage=460;
    const attack=new AttackEffect(b.player,b.opponent,{name:'Hit',cost:[],damage:30,text:''});expect(()=>b.store.reduceEffect(b.state,attack)).toThrow();
    disableAbility(b);expect(()=>b.store.reduceEffect(b.state,attack)).not.toThrow();
  });
  for(const copied of [false,true]) it('Machamp Close Combat retains its tails penalty through the later damage event, copied='+copied,()=>{
    spyOn(Math,'random').and.returnValue(0.9);const b=battle(new Machamp(),copied);b.store.reduceEffect(b.state,b.attack);resolveWait(b);b.state.activePlayer=1;
    const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:100,text:''});const damage=new PutDamageEffect(hit,100);
    b.store.reduceEffect(b.state,damage);expect(damage.damage).toBe(130);
    b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));expect(b.player.active.marker.hasMarker((b.card as Machamp).CLOSE_COMBAT_MARKER,copied?b.mew:b.card)).toBe(false);
  });
  it('Machamp Badge of Discipline remains direct and can be disabled',()=>{
    spyOn(Math,'random').and.returnValue(0);const b=battle(new Machamp(),false);b.store.reduceEffect(b.state,b.attack);expect(b.attack.ignoreResistance).toBe(true);
    resolveWait(b);disableAbility(b);const attack=new AttackEffect(b.player,b.opponent,b.card.attacks[0]);b.store.reduceEffect(b.state,attack);expect(attack.ignoreResistance).toBe(false);
  });
  for(const copied of [false,true]) it('Turtonator Heat Breath retains its delayed heads bonus, copied='+copied,()=>{
    spyOn(Math,'random').and.returnValue(0);const b=battle(new Turtonator(),copied);b.store.reduceEffect(b.state,b.attack);resolveWait(b);expect(b.attack.damage).toBe(160);
  });
  it('Turtonator Thorny Shell prompts for energy on direct damage and respects Ability suppression',()=>{
    const b=battle(new Turtonator(),false), energy=new BasicEnergy();b.opponent.active.cards.push(energy);b.opponent.active.energies.cards=[energy];b.player.marker.addMarkerToState(b.player.DAMAGE_DEALT_MARKER);
    const attack=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:10,text:''});b.store.reduceEffect(b.state,new PutDamageEffect(attack,10));
    expect(b.state.prompts.length).toBeGreaterThan(0);
    const blocked=battle(new Turtonator(),false), blockedEnergy=new BasicEnergy();blocked.opponent.active.cards.push(blockedEnergy);blocked.opponent.active.energies.cards=[blockedEnergy];blocked.player.marker.addMarkerToState(blocked.player.DAMAGE_DEALT_MARKER);disableAbility(blocked);
    const hit=new AttackEffect(blocked.opponent,blocked.player,{name:'Hit',cost:[],damage:10,text:''});blocked.store.reduceEffect(blocked.state,new PutDamageEffect(hit,10));expect(blocked.state.prompts.length).toBe(0);
  });
  it('copied Turtonator does not gain Thorny Shell on incoming damage',()=>{
    const b=battle(new Turtonator(),true),energy=new BasicEnergy();b.opponent.active.cards.push(energy);b.opponent.active.energies.cards=[energy];
    b.player.marker.addMarkerToState(b.player.DAMAGE_DEALT_MARKER);const hit=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:10,text:''});
    b.store.reduceEffect(b.state,new PutDamageEffect(hit,10));expect(b.state.prompts.length).toBe(0);
  });
});
