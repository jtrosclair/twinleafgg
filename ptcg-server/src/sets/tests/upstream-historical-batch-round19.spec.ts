import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, MoveCardsEffect, RetreatStartEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, HealTargetEffect, AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { State, GamePhase } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';

const names = ['Cherrim DP','Magnemite DP','Kricketune MT','Spinarak MT','Arbok GE','Cacturne GE','Hariyama GE','Delibird GE'];
class Bonus extends TrainerCard { public name='Bonus';public fullName='Bonus TST';public set='TST';public trainerType=TrainerType.STADIUM;
  public reduceEffect(_store:StoreLike,state:State,e:Effect):State {if(e instanceof AttackEffect)e.damage+=20;return state;} }
function game(name: string, energy: string[], copied = false) {
  const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];return g;
}
function attack(g:ReturnType<typeof game>,name:string,copied=false) {
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}
  else useAttack(g.store,g.state,0,name);
}
describe('Grouped Diamond and Pearl, Mysterious Treasures and Great Encounters cards',()=>{
  beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
  for(const [name,number,hp,type] of [
    ['Cherrim DP','45',80,CardType.GRASS],['Magnemite DP','87',50,CardType.METAL],['Kricketune MT','27',80,CardType.GRASS],['Spinarak MT','103',50,CardType.GRASS],
    ['Arbok GE','33',80,CardType.PSYCHIC],['Cacturne GE','34',80,CardType.DARK],['Hariyama GE','41',100,CardType.FIGHTING],['Delibird GE','36',70,CardType.WATER]
  ] as const) it('registers printed identity '+name,()=>{const c:any=getCardByName(name);expect(c.setNumber).toBe(number);expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);});
  for(const copied of [false,true]) {
    const label=copied?'copied ':'direct ';
    for(const [name,move,energy,status] of [
      ['Cherrim DP','Worry Seed',['Grass Energy SVE'],SpecialCondition.CONFUSED],['Magnemite DP','Metal Sound',['Metal Energy SVE'],SpecialCondition.CONFUSED],
      ['Kricketune MT','Sore Performance',['Water Energy SVE','Water Energy SVE'],SpecialCondition.ASLEEP],['Arbok GE','Wrap',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],SpecialCondition.PARALYZED]
    ] as Array<[string,string,string[],SpecialCondition]>) {
      it(label+name+' '+move+' heads applies condition after damage',()=>{const g=game(name,energy,copied);let statusApplied=false;const events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
        spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push('damage');if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(status)){events.push('status');statusApplied=true;}return reduce(s,e)});
        attack(g,move,copied);expect(statusApplied).toBe(true);if(move!=='Metal Sound')expect(events.indexOf('status')).toBeGreaterThan(events.indexOf('damage'));});
      if(move!=='Sore Performance')it(label+name+' '+move+' tails applies no condition',()=>{(Math.random as jasmine.Spy).and.returnValue(0.9);const g=game(name,energy,copied);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(status))applied=true;return reduce(s,e)});attack(g,move,copied);expect(applied).toBe(false);});
    }
    for(const [heads,damage,remaining] of [[true,40,10],[false,20,40]] as Array<[boolean,number,number]>)it(label+'Cherrim Magical Leaf '+heads,()=>{
      (Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Cherrim DP',['Grass Energy SVE','Grass Energy SVE'],copied);g.player1.active.damage=40;let heal=false;const events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push('damage');if(e instanceof HealTargetEffect){heal=true;events.push('heal');expect(e.target).toBe(g.player1.active);}return reduce(s,e)});attack(g,'Magical Leaf',copied);expect(g.player2.active.damage).toBe(damage);expect(g.player1.active.damage).toBe(remaining);expect(heal).toBe(heads);if(heads)expect(events.indexOf('heal')).toBeGreaterThan(events.indexOf('damage'));
    });
    for(const confused of [false,true])it(label+'Magnemite Resonance '+confused,()=>{const g=game('Magnemite DP',['Metal Energy SVE','Water Energy SVE'],copied);if(confused)g.player2.active.specialConditions.push(SpecialCondition.CONFUSED);attack(g,'Resonance',copied);expect(g.player2.active.damage).toBe(confused?40:20);});
    it(label+'Kricketune Concerto counts only current Kricketot and Kricketune',()=>{const g=game('Kricketune MT',['Grass Energy SVE','Grass Energy SVE'],copied);g.player1.bench[copied?1:0].cards.push(getCardByName('Kricketot MT'));g.player1.bench[copied?2:1].cards.push(getCardByName('Charmander BS'));attack(g,'Concerto',copied);expect(g.player2.active.damage).toBe(60);});
    it(label+'Spinarak Impound blocks retreat for defender',()=>{const g=game('Spinarak MT',['Grass Energy SVE'],copied);g.player2.bench[0].cards.push(getCardByName('Charmander BS'));attack(g,'Impound',copied);expect(g.player2.active.marker.hasMarker('ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN')).toBe(true);expect(()=>g.store.reduceEffect(g.state,new RetreatStartEffect(g.player2))).toThrow();});
    it(label+'Spinarak Impound respects defender attack-effect protection',()=>{const g=game('Spinarak MT',['Grass Energy SVE'],copied);g.player2.active.preventEffectsOfAttacksNextTurn=true;attack(g,'Impound',copied);expect(g.player2.active.marker.hasMarker('ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN')).toBe(false);});
    for(const [name,move,energy,coins] of [['Spinarak MT','Double Scratch',['Grass Energy SVE','Water Energy SVE'],2],['Cacturne GE','Pin Missile',['Water Energy SVE','Water Energy SVE'],3]] as Array<[string,string,string[],number]>) for(const heads of [0,1,coins])it(label+name+' '+heads+' heads preserves bonuses',()=>{
      const g=game(name,energy,copied);g.player1.stadium.cards.push(new Bonus());let flips=0;(Math.random as jasmine.Spy).and.callFake(()=>flips++<heads?0.1:0.9);attack(g,move,copied);expect(g.player2.active.damage).toBe(heads?heads*20+20:0);
    });
    for(const poisoned of [false,true])it(label+'Arbok Deadly Poison prior condition '+poisoned,()=>{const g=game('Arbok GE',['Psychic Energy SVE'],copied);if(poisoned)g.player2.active.specialConditions.push(SpecialCondition.POISONED);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.POISONED))applied=true;return reduce(s,e)});attack(g,'Deadly Poison',copied);expect(g.player2.active.damage).toBe(poisoned?60:20);expect(applied).toBe(!poisoned);});
    for(const damaged of [false,true])it(label+'Cacturne Needle Arm prior damage '+damaged,()=>{const g=game('Cacturne GE',['Darkness Energy SVE','Water Energy SVE','Water Energy SVE'],copied);g.player2.active.damage=damaged?10:0;attack(g,'Needle Arm',copied);expect(g.player2.active.damage).toBe(damaged?80:50);});
    for(const heads of [false,true])it(label+'Hariyama Palm Strike '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Hariyama GE',['Fighting Energy SVE','Water Energy SVE'],copied);attack(g,'Palm Strike',copied);expect(g.player2.active.damage).toBe(heads?60:20);});
    for(const lower of [false,true])it(label+'Hariyama Spirited Throw uses actual remaining HP '+lower,()=>{const g=game('Hariyama GE',['Fighting Energy SVE','Fighting Energy SVE','Water Energy SVE'],copied);g.player1.active.damage=lower?30:0;g.player2.active.getPokemonCard()!.hp=lower?300:80;attack(g,'Spirited Throw',copied);expect(g.player2.active.damage).toBe(lower?80:50);});
    for(const heads of [false,true])it(label+'Delibird Present '+heads+' private mandatory search',()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Delibird GE',[],copied),selected=g.player1.deck.cards[0];let searched=false,shuffled=false;g.overridePrompt('Choose cards',()=>{searched=true;return [0]});g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_:unknown,i:number)=>i)});attack(g,'Present',copied);expect(searched).toBe(heads);expect(shuffled).toBe(heads);expect(g.player1.hand.cards.includes(selected)).toBe(heads);});
    it(label+'Delibird preserves the original search source after attacker replacement',()=>{const g=game('Delibird GE',[],copied),original=g.player1.active.getPokemonCard()!;let switched=false,source:unknown;g.overridePrompt('Choose cards',()=>[0]);g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_:unknown,i:number)=>i));const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect&&!switched){switched=true;g.player1.active.cards.push(getCardByName('Charmander BS'));}if(e instanceof MoveCardsEffect&&e.destination===g.player1.hand)source=e.sourceCard;return reduce(s,e)});attack(g,'Present',copied);expect(switched).toBe(true);expect(source).toBe(original);});
    it(label+'Cherrim respects defender attack-effect prevention',()=>{const g=game('Cherrim DP',['Grass Energy SVE'],copied);g.player2.active.preventEffectsOfAttacksNextTurn=true;let applied=false;const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const out=reduce(s,e);if(e instanceof AddSpecialConditionsEffect&&!e.preventDefault)applied=true;return out});attack(g,'Worry Seed',copied);expect(applied).toBe(false);});
  }
  it('round-trips all eight registered cards through a ClientSimulator snapshot',()=>{
    ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];
    const add=(list:CardList,name:string)=>{const c=CardManager.getInstance().getCardByName(name)!;expect(c).toBeDefined();c.id=state.cardNames.length;state.cardNames.push(c.fullName);list.cards.push(c);};
    state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(prize=>add(prize,'Fire Energy SVE'));for(let j=0;j<9;j++)add(p.deck,'Fire Energy SVE');add(p.active,index?'Mew ex MEW':names[0]);});
    names.slice(1).forEach(name=>add(state.players[0].deck,name));const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});const out=sim.getStateData();const restored=new ClientSimulator();restored.loadSnapshot({stateData:out});for(const name of names)expect(restored.state.cardNames).toContain(name);sim.cleanup();restored.cleanup();
  });
});
