import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect, AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
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
class Bonus extends TrainerCard { public name='Fixture Bonus';public fullName='Fixture Bonus TST';public set='TST';public trainerType=TrainerType.STADIUM;
  public reduceEffect(_s:StoreLike,state:State,e:Effect):State {if(e instanceof AttackEffect)e.damage+=20;return state;} }
function game(name:string, energy:string[]=[], copied=false, opposing:string[]=[]) {
 return setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name+' SW',energy},bench:[...(copied?[{card:name+' SW'}]:[]),{card:'Charmander BS'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW',energy:opposing},deck:padDeck(10)}});
}
function attack(g:ReturnType<typeof game>,move:string,copied=false) {
 if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:move}));useAbility(g.store,g.state,0,'Memory Helix');} else useAttack(g.store,g.state,0,move);
}
describe('Secret Wonders second upstream batch',()=>{
 beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
 for(const [name,number,hp,type,weak,weakValue] of [
  ['Mareep','94',50,CardType.LIGHTNING,CardType.FIGHTING,10],['Venonat','116',50,CardType.GRASS,CardType.FIRE,10],
  ['Lickitung','91',80,CardType.COLORLESS,CardType.FIGHTING,20],['Electabuzz','87',70,CardType.LIGHTNING,CardType.FIGHTING,20],
  ['Voltorb','117',50,CardType.LIGHTNING,CardType.FIGHTING,10],['Phanpy','98',60,CardType.FIGHTING,CardType.WATER,10],
['Diglett','85',50,CardType.FIGHTING,CardType.WATER,10],
  ['Nidoran ♂','97',60,CardType.PSYCHIC,CardType.PSYCHIC,10]
 ] as const) it('registers printed identity of '+name,()=>{const c:any=getCardByName(name+' SW');expect(c.set).toBe('SW');expect(c.setNumber).toBe(number);expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);expect(c.weakness).toEqual([{type:weak,value:weakValue}]);});
 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  for(const [name,move,energy,status] of [
   ['Mareep','Thundershock',['Lightning Energy SVE'],SpecialCondition.PARALYZED],['Electabuzz','Thundershock',['Lightning Energy SVE'],SpecialCondition.PARALYZED],
   ['Lickitung','Lick',['Water Energy SVE'],SpecialCondition.PARALYZED],['Venonat','Stun Spore',['Water Energy SVE'],SpecialCondition.PARALYZED],
   ['Venonat','Signal Beam',['Grass Energy SVE'],SpecialCondition.CONFUSED]
  ] as Array<[string,string,string[],SpecialCondition]>) {
   it(label+name+' '+move+' applies heads condition after damage',()=>{
    const g=game(name,energy,copied),target=g.player2.active,events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect&&e.target===target)events.push('damage');if(e instanceof CoinFlipEffect)events.push('coin');if(e instanceof AddSpecialConditionsEffect&&e.target===target&&e.specialConditions.includes(status))events.push('status');return reduce(s,e)});
    attack(g,move,copied);expect(events).toContain('status');expect(events.indexOf('coin')).toBeLessThan(events.indexOf('status'));if(move!=='Stun Spore')expect(events.indexOf('damage')).toBeLessThan(events.indexOf('coin'));
   });
   it(label+name+' '+move+' tails applies no condition',()=>{
    const g=game(name,energy,copied);(Math.random as jasmine.Spy).and.returnValue(0.9);let statusApplied=false;const reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(status))statusApplied=true;return reduce(s,e)});
    attack(g,move,copied);expect(statusApplied).toBe(false);
   });
  }
  for(const [heads,expected] of [[true,40],[false,10]] as Array<[boolean,number]>) it(label+'Lickitung Stomp damage for heads '+heads,()=>{
    const g=game('Lickitung',['Water Energy SVE','Water Energy SVE'],copied);(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);attack(g,'Stomp',copied);expect(g.player2.active.damage).toBe(expected);
  });
  for(const [name,move,energy,damage] of [
   ['Voltorb','Big Explosion',['Lightning Energy SVE','Water Energy SVE'],50],
   ['Phanpy','Take Down',['Fighting Energy SVE','Water Energy SVE'],10],
   ['Electabuzz','Thunder',['Lightning Energy SVE','Lightning Energy SVE','Water Energy SVE'],30]
  ] as Array<[string,string,string[],number]>) it(label+name+' recoil follows outgoing damage and hits original attacker',()=>{
   const g=game(name,energy,copied);if(name==='Electabuzz')(Math.random as jasmine.Spy).and.returnValue(0.9);
   const source=g.player1.active,defender=g.player2.active,events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect&&e.target===defender)events.push('outgoing');if(e instanceof DealDamageEffect&&e.target===source){events.push('recoil');expect(e.damage).toBe(damage);}return reduce(s,e)});
   attack(g,move,copied);expect(events.indexOf('outgoing')).toBeGreaterThanOrEqual(0);expect(events.indexOf('recoil')).toBeGreaterThan(events.indexOf('outgoing'));
  });
  it(label+'Electabuzz Thunder heads has no recoil',()=>{
   const g=game('Electabuzz',['Lightning Energy SVE','Lightning Energy SVE','Water Energy SVE'],copied),source=g.player1.active;attack(g,'Thunder',copied);expect(source.damage).toBe(0);expect(g.player2.active.damage).toBe(60);
  });
  it(label+'Phanpy Flail counts actual attacking Pokémon damage and preserves modifier',()=>{
   const g=game('Phanpy',['Water Energy SVE'],copied);g.player1.active.damage=30;g.player2.active.getPokemonCard()!.resistance=[];g.player1.stadium.cards.push(new Bonus());attack(g,'Flail',copied);expect(g.player2.active.damage).toBe(50);
  });
  it(label+'Phanpy Flail does zero damage from an undamaged attacker',()=>{
   const g=game('Phanpy',['Water Energy SVE'],copied);attack(g,'Flail',copied);expect(g.player2.active.damage).toBe(0);
  });
  it(label+'Diglett draws the bottom card without changing other deck order',()=>{
   const g=game('Diglett',['Water Energy SVE'],copied),before=[...g.player1.deck.cards],bottom=before[before.length-1];attack(g,'Down Draw',copied);
   expect(g.player1.hand.cards).toContain(bottom);expect(g.player1.deck.cards).toEqual(before.slice(0,-1));
  });
  it(label+'Nidoran Collect draws its own top card',()=>{
   const g=game('Nidoran ♂',['Water Energy SVE'],copied),top=g.player1.deck.cards[0];attack(g,'Collect',copied);expect(g.player1.hand.cards).toContain(top);
  });
  for(const [first,second,poisoned] of [[0.1,0.1,true],[0.1,0.9,true],[0.9,0.9,false]] as Array<[number,number,boolean]>) it(label+'Nidoran Poison Skin honors both flips '+first+','+second,()=>{
   const g=game('Nidoran ♂',['Psychic Energy SVE'],copied);const values=[first,second];(Math.random as jasmine.Spy).and.callFake(()=>values.length?values.shift()!:0.1);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.POISONED))applied=true;return reduce(s,e)});
   attack(g,'Poison Skin',copied);expect(applied).toBe(poisoned);
  });
 }

 for(const copied of [false,true]) {
  const label=copied?'copied ':'direct ';
  it(label+'Mareep respects the defending Pokémon attack-effect protection',()=>{
   const g=game('Mareep',['Lightning Energy SVE'],copied);g.player2.active.preventEffectsOfAttacksNextTurn=true;let applied=false;const reduce=g.store.reduceEffect.bind(g.store);
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const result=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.PARALYZED)&&!e.preventDefault)applied=true;return result});
   attack(g,'Thundershock',copied);expect(applied).toBe(false);
  });
  it(label+'Signal Beam flips even if defender is replaced and never confuses the replacement',()=>{
   const g=game('Venonat',['Grass Energy SVE'],copied),target=g.player2.active,original=target.getPokemonCard()!,reduce=g.store.reduceEffect.bind(g.store);let replaced=false,flip=false,applied=false;
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect)flip=true;if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.CONFUSED))applied=true;const r=reduce(s,e);if(!replaced&&e instanceof AfterDamageEffect&&e.target===target){replaced=true;target.moveTo(g.player2.discard);target.clearEffects();target.damage=0;target.cards=[getCardByName('Charmander BS')];}return r});
   attack(g,'Signal Beam',copied);expect(replaced).toBe(true);expect(flip).toBe(true);expect(target.getPokemonCard()).not.toBe(original);expect(applied).toBe(false);
  });
  it(label+'Take Down recoil follows the original attacker if damage triggers a switch',()=>{
   const g=game('Phanpy',['Fighting Energy SVE','Water Energy SVE'],copied);g.player2.active.getPokemonCard()!.resistance=[];const source=g.player1.active,bench=g.player1.bench[copied?1:0],defender=g.player2.active,reduce=g.store.reduceEffect.bind(g.store);let switched=false,recoil=false;
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect&&e.target===source)recoil=true;const r=reduce(s,e);if(!switched&&e instanceof AfterDamageEffect&&e.target===defender){switched=true;g.player1.switchPokemon(bench);}return r});
   attack(g,'Take Down',copied);expect(switched).toBe(true);expect(recoil).toBe(true);expect(g.player1.active).toBe(bench);expect(source.damage).toBe(10);expect(bench.damage).toBe(0);
  });
  it(label+'Take Down never damages a replacement in the old attacker slot',()=>{
   const g=game('Phanpy',['Fighting Energy SVE','Water Energy SVE'],copied);g.player2.active.getPokemonCard()!.resistance=[];const source=g.player1.active,defender=g.player2.active,original=source.getPokemonCard()!,reduce=g.store.reduceEffect.bind(g.store);let replaced=false;
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const r=reduce(s,e);if(!replaced&&e instanceof AfterDamageEffect&&e.target===defender){replaced=true;source.moveTo(g.player1.discard);source.clearEffects();source.damage=0;source.cards=[getCardByName('Charmander BS')];}return r});
   attack(g,'Take Down',copied);expect(replaced).toBe(true);expect(source.getPokemonCard()).not.toBe(original);expect(source.damage).toBe(0);
  });
  it(label+'Nidoran Poison Skin respects defending attack-effect protection',()=>{
   const g=game('Nidoran ♂',['Psychic Energy SVE'],copied);g.player2.active.preventEffectsOfAttacksNextTurn=true;let applied=false;const reduce=g.store.reduceEffect.bind(g.store);
   spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const r=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.POISONED)&&!e.preventDefault)applied=true;return r});
   attack(g,'Poison Skin',copied);expect(applied).toBe(false);
  });
 }

 it('loads, draws the correct bottom card, and restores a Diglett puzzle through ClientSimulator',()=>{
  ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];
  const add=(list:CardList,name:string)=>{const c=CardManager.getInstance().getCardByName(name)!;expect(c).toBeDefined();c.id=state.cardNames.length;state.cardNames.push(c.fullName);list.cards.push(c);};
  state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(prize=>add(prize,'Fire Energy SVE'));for(let j=0;j<9;j++)add(p.deck,'Fire Energy SVE');add(p.active,index?'Mew ex MEW':'Diglett SW');});
  add(state.players[0].deck,'Water Energy SVE');add(state.players[0].active,'Fire Energy SVE');
  const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});sim.dispatch(new AttackAction(sim.humanPlayerId,'Down Draw'));
  expect(sim.state.players[0].hand.cards.some(c=>c.fullName==='Water Energy SVE')).toBe(true);
  const encoded=sim.getStateData(),restored=new ClientSimulator();restored.loadSnapshot({stateData:encoded});
  expect(restored.state.players[0].active.getPokemonCard()!.fullName).toBe('Diglett SW');expect(restored.state.players[0].hand.cards.some(c=>c.fullName==='Water Energy SVE')).toBe(true);sim.cleanup();restored.cleanup();
 });

});
