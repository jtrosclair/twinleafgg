import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, UseAttackEffect, RetreatStartEffect, MoveCardsEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AfterDamageEffect, AddSpecialConditionsEffect, DealDamageEffect, HealTargetEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CoinFlipEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { State, GamePhase } from '../../game/store/state/state';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { AttackAction } from '../../game/store/actions/game-actions';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN as LOCK } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
class Bonus extends TrainerCard {public name='Fixture Bonus';public fullName='Fixture Bonus TST';public set='TST';public trainerType=TrainerType.STADIUM;public reduceEffect(_s:StoreLike,state:State,e:Effect):State{if(e instanceof AttackEffect)e.damage+=20;return state;}}
function game(name:string,energy:string[]=[],copied=false,oppBench:string[]=[],oppCard='Mew ex MEW') {
 return setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name+' SW',energy},bench:copied?[{card:name+' SW'}]:[],deck:padDeck(12)},player2:{active:{card:oppCard},bench:oppBench.map(card=>({card})),deck:padDeck(12)}});
}
function attack(g:ReturnType<typeof game>,move:string,copied=false) {if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:move}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,move);}
describe('Secret Wonders third upstream batch',()=>{
 beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
 for(const [name,num,hp,type,weak,value] of [
  ['Roserade','17',90,CardType.GRASS,CardType.FIRE,20],['Shuppet','110',50,CardType.PSYCHIC,CardType.DARK,10],
  ['Rattata','103',30,CardType.COLORLESS,CardType.FIGHTING,10],['Psyduck','100',60,CardType.WATER,CardType.LIGHTNING,10],
  ['Stantler','113',70,CardType.COLORLESS,CardType.FIGHTING,20],['Pinsir','59',80,CardType.GRASS,CardType.FIRE,20]
 ] as const)it('registers printed identity '+name,()=>{const c:any=getCardByName(name+' SW');expect(c.setNumber).toBe(num);expect(c.set).toBe('SW');expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);expect(c.weakness).toEqual([{type:weak,value}]);});
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  it(label+'Roserade inflicts both conditions after damage',()=>{
   const g=game('Roserade',['Grass Energy SVE'],copied),target=g.player2.active,events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect&&e.target===target)events.push('damage');if(e instanceof AddSpecialConditionsEffect&&e.target===target&&e.specialConditions.includes(SpecialCondition.POISONED)&&e.specialConditions.includes(SpecialCondition.ASLEEP))events.push('both');return reduce(s,e)});attack(g,'Sleep Poison',copied);expect(events).toEqual(['damage','both']);
  });
  for(const [heads,damage,health] of [[true,70,10],[false,40,40]] as Array<[boolean,number,number]>)it(label+'Roserade Magical Leaf heads '+heads,()=>{
   const g=game('Roserade',['Grass Energy SVE','Water Energy SVE','Water Energy SVE'],copied);g.player1.active.damage=40;const source=g.player1.active,events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push('damage');if(e instanceof HealTargetEffect){events.push('heal');expect(e.target).toBe(source);}return reduce(s,e)});attack(g,'Magical Leaf',copied);expect(g.player2.active.damage).toBe(damage);expect(source.damage).toBe(health);if(heads)expect(events.indexOf('heal')).toBeGreaterThan(events.indexOf('damage'));else expect(events).not.toContain('heal');
  });
  for(const bench of [false,true])it(label+'Shuppet Gossip places one counter on chosen '+(bench?'bench':'active'),()=>{
   const g=game('Shuppet',['Psychic Energy SVE'],copied,['Squirtle BS']);const target=bench?g.player2.bench[0]:g.player2.active;
   g.overridePrompt('Put damage',()=>[{target:{player:PlayerType.TOP_PLAYER,slot:bench?SlotType.BENCH:SlotType.ACTIVE,index:0},damage:10}]);attack(g,'Gossip',copied);expect(target.damage).toBe(10);
  });
  it(label+'Shuppet Gossip respects attack-effect protection on chosen target',()=>{
   const g=game('Shuppet',['Psychic Energy SVE'],copied,['Squirtle BS']),target=g.player2.bench[0];target.preventEffectsOfAttacksNextTurn=true;
   g.overridePrompt('Put damage',()=>[{target:{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0},damage:10}]);attack(g,'Gossip',copied);expect(target.damage).toBe(0);
  });
  for(const heads of [false,true])it(label+'Rattata Tail Whip heads '+heads+' determines attack lock',()=>{
   const g=game('Rattata',['Water Energy SVE'],copied);(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);attack(g,'Tail Whip',copied);expect(g.player2.active.cannotAttackNextTurn).toBe(heads);
   if(heads){const e=new UseAttackEffect(g.player2,g.player2.active.getPokemonCard()!.attacks[0]);expect(()=>g.store.reduceEffect(g.state,e)).toThrow();g.state.phase=GamePhase.FINISHED;g.store.reduceEffect(g.state,new EndTurnEffect(g.player2));expect(g.player2.active.cannotAttackNextTurn).toBe(false);}
  });
  it(label+'Rattata lock respects attack protection',()=>{const g=game('Rattata',['Water Energy SVE'],copied);g.player2.active.preventEffectsOfAttacksNextTurn=true;attack(g,'Tail Whip',copied);expect(g.player2.active.cannotAttackNextTurn).toBe(false);});
  for(const heads of [false,true])it(label+'Psyduck Migraine chooses correct Pokémon on heads '+heads,()=>{
   const g=game('Psyduck',['Water Energy SVE'],copied),source=g.player1.active,defender=g.player2.active;let target:any;const reduce=g.store.reduceEffect.bind(g.store);(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.CONFUSED))target=e.target;return reduce(s,e)});attack(g,'Migraine',copied);expect(target).toBe(heads?defender:source);
  });
  it(label+'Psyduck Delusion draws exactly two while Confused',()=>{
   const g=game('Psyduck',['Water Energy SVE'],copied);g.player1.active.specialConditions=[SpecialCondition.CONFUSED];const before=g.player1.hand.cards.length;attack(g,'Delusion',copied);expect(g.player1.hand.cards.length).toBe(before+2);
  });
  it(label+'Stantler Lead reveals a Supporter and then shuffles',()=>{
   const g=game('Stantler',[],copied),target=getCardByName("Boss's Orders PAL");g.player1.deck.cards.unshift(target);let revealed=false,movedBeforeReveal=false;const reduce=g.store.reduceEffect.bind(g.store);
   g.overridePrompt('Choose cards',()=>[0]);g.overridePrompt('Show cards',()=>{revealed=true;movedBeforeReveal=g.player1.hand.cards.includes(target);return true;});
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof MoveCardsEffect&&e.cards?.includes(target))expect(revealed).toBe(true);return reduce(s,e)});
   attack(g,'Lead',copied);expect(revealed).toBe(true);expect(movedBeforeReveal).toBe(false);expect(g.player1.hand.cards).toContain(target);
  });
  it(label+'Stantler Frighten Horn confuses a Basic defender',()=>{
   const g=game('Stantler',['Water Energy SVE','Water Energy SVE'],copied);let confused=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.CONFUSED))confused=true;return reduce(s,e)});attack(g,'Frighten Horn',copied);expect(confused).toBe(true);
  });
  it(label+'Pinsir Grip and Squeeze locks actual defender retreat',()=>{
   const g=game('Pinsir',['Grass Energy SVE'],copied,['Squirtle BS']);attack(g,'Grip and Squeeze',copied);expect(g.player2.active.marker.hasMarker(LOCK)).toBe(true);expect(()=>g.store.reduceEffect(g.state,new RetreatStartEffect(g.player2))).toThrow();g.state.phase=GamePhase.FINISHED;g.store.reduceEffect(g.state,new EndTurnEffect(g.player2));expect(g.player2.active.marker.hasMarker(LOCK)).toBe(false);
  });
  it(label+'Pinsir retreat lock respects attack-effect protection',()=>{
   const g=game('Pinsir',['Grass Energy SVE'],copied,['Squirtle BS']);g.player2.active.preventEffectsOfAttacksNextTurn=true;attack(g,'Grip and Squeeze',copied);expect(g.player2.active.marker.hasMarker(LOCK)).toBe(false);
  });
  for(const [seq,expected] of [[[0.1,0.1],120],[[0.1,0.9],30],[[0.9,0.9],30]] as Array<[number[],number]>)it(label+'Pinsir Power Guillotine preserves modifier for '+expected,()=>{
   const g=game('Pinsir',['Grass Energy SVE','Water Energy SVE','Water Energy SVE'],copied),values=[...seq];g.player1.stadium.cards.push(new Bonus());(Math.random as jasmine.Spy).and.callFake(()=>values.length?values.shift()!:0.1);attack(g,'Power Guillotine',copied);expect(g.player2.active.damage).toBe(expected);
  });
 }
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  it(label+'Rattata lock clears on switching and remains cleared on return',()=>{
   const g=game('Rattata',['Water Energy SVE'],copied,['Squirtle BS'],'Charmander BS'),target=g.player2.active;attack(g,'Tail Whip',copied);
   expect(target.cannotAttackNextTurn).toBe(true);g.player2.switchPokemon(g.player2.bench[0]);expect(target.cannotAttackNextTurn).toBe(false);
   g.player2.switchPokemon(g.player2.bench[0]);expect(g.player2.active).toBe(target);expect(target.cannotAttackNextTurn).toBe(false);
  });
  it(label+'Rattata lock clears when the defender evolves',()=>{
   const g=game('Rattata',['Water Energy SVE'],copied,[],'Charmander BS');attack(g,'Tail Whip',copied);expect(g.player2.active.cannotAttackNextTurn).toBe(true);
   g.player2.canEvolve=true;g.player2.active.pokemonPlayedTurn=0;const evolution=getCardByName('Charmeleon BS') as PokemonCard;g.player2.hand.cards.push(evolution);
   g.store.reduceEffect(g.state,new PlayPokemonEffect(g.player2,evolution,g.player2.active));expect(g.player2.active.getPokemonCard()!.name).toBe('Charmeleon');expect(g.player2.active.cannotAttackNextTurn).toBe(false);
  });
  it(label+'Rattata lock cannot affect a replacement defender',()=>{
   const g=game('Rattata',['Water Energy SVE'],copied,[],'Charmander BS'),target=g.player2.active,original=target.getPokemonCard()!,reduce=g.store.reduceEffect.bind(g.store);let replaced=false;
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const r=reduce(s,e);if(!replaced&&e instanceof AttackEffect&&e.attack.name==='Tail Whip'){replaced=true;target.moveTo(g.player2.discard);target.clearEffects();target.cards=[getCardByName('Squirtle BS')];}return r});
   attack(g,'Tail Whip',copied);expect(replaced).toBe(true);expect(target.getPokemonCard()).not.toBe(original);expect(target.cannotAttackNextTurn).toBe(false);
  });
  it(label+'Rattata respects an Ability preventing effects of attacks',()=>{
   const g=game('Rattata',['Water Energy SVE'],copied,[],'Charmander BS');
   class Protector extends PokemonCard {public name='Protector';public fullName='Protector TEST';public set='TEST';public reduceEffect(_store:StoreLike,state:State,e:Effect):State {if(e instanceof EffectOfAttackEffect)e.preventDefault=true;return state;}}
   g.player2.bench[0].cards.push(new Protector());attack(g,'Tail Whip',copied);expect(g.player2.active.cannotAttackNextTurn).toBe(false);
  });
  it(label+'Rattata lock survives a rejected end turn',()=>{
   const g=game('Rattata',['Water Energy SVE'],copied,[],'Charmander BS');attack(g,'Tail Whip',copied);
   class Blocker extends PokemonCard {public name='Blocker';public fullName='Blocker TEST';public set='TEST';public reduceEffect(_store:StoreLike,state:State,e:Effect):State {if(e instanceof EndTurnEffect)e.preventDefault=true;return state;}}
   g.player1.bench[4].cards.push(new Blocker());g.state.phase=GamePhase.FINISHED;g.store.reduceEffect(g.state,new EndTurnEffect(g.player2));expect(g.player2.active.cannotAttackNextTurn).toBe(true);
  });
 }

 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  it(label+'Stantler Frighten Horn does not confuse an evolved defender',()=>{
   const g=game('Stantler',['Water Energy SVE','Water Energy SVE'],copied,[],'Charmander BS');g.player2.active.cards.push(getCardByName('Charmeleon BS'));let confused=false;const reduce=g.store.reduceEffect.bind(g.store);
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.CONFUSED))confused=true;return reduce(s,e)});
   attack(g,'Frighten Horn',copied);expect(confused).toBe(false);
  });
  it(label+'Stantler search can find nothing and still shuffles',()=>{
   const g=game('Stantler',[],copied);let shuffled=false;g.overridePrompt('Choose cards',()=>[]);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_:unknown,i:number)=>i)});
   attack(g,'Lead',copied);expect(shuffled).toBe(true);
  });
  it(label+'Rattata lock remains if its original attacker leaves play',()=>{
   const g=game('Rattata',['Water Energy SVE'],copied,[],'Charmander BS');attack(g,'Tail Whip',copied);const attacker=g.player1.active.getPokemonCard()!;g.player1.active.moveCardTo(attacker,g.player1.lostzone);
   expect(g.player2.active.cannotAttackNextTurn).toBe(true);expect(()=>g.store.reduceEffect(g.state,new UseAttackEffect(g.player2,g.player2.active.getPokemonCard()!.attacks[0]))).toThrow();
  });
 }
 it('preserves a Rattata attack lock across a real ClientSimulator snapshot',()=>{
  ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];
  const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;expect(card).toBeDefined();card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);};
  state.players.forEach((p,i)=>{p.id=i+1;p.name=i?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(x=>add(x,'Fire Energy SVE'));for(let j=0;j<8;j++)add(p.deck,'Fire Energy SVE');add(p.active,i?'Charmander BS':'Rattata SW');});
  add(state.players[0].active,'Fire Energy SVE');const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});sim.dispatch(new AttackAction(sim.humanPlayerId,'Tail Whip'));
  expect(sim.state.players[1].active.cannotAttackNextTurn).toBe(true);const snapshot=sim.getStateData(),restored=new ClientSimulator();const decoded=restored.validateSnapshot(snapshot);
  expect(decoded.players[1].active.cannotAttackNextTurn).toBe(true);restored.loadSnapshot({stateData:snapshot});
  // A restored opponent turn is automatically passed; its attack lock must then expire.
  expect(restored.state.players[1].active.cannotAttackNextTurn).toBe(false);sim.cleanup();restored.cleanup();
 });

});
