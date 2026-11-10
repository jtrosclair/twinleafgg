import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State, GamePhase } from '../../game/store/state/state';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { PlayPokemonFromDeckEffect } from '../../game/store/effects/play-card-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';

let nextId = 100000;
function fresh(name: string) { const card = getCardByName(name); card.id = nextId++; return card; }
function game(name: string, energy: string[], copied = false) {
  return setupGame({turn:2, player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name}]:[],deck:padDeck(12)}, player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
}
function attack(g: ReturnType<typeof game>, name: string, copied = false) {
  if (copied) {g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}
  else useAttack(g.store,g.state,0,name);
}
const names=['Shellos East Sea SW','Sableye SW','Girafarig MT','Kricketot MT','Nidoran ♀ MT','Chimecho MT','Clamperl GE','Togepi GE'];

describe('Secret Wonders, Mysterious Treasures and Great Encounters grouped cards',()=>{
  beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
  for (const [name,number,hp,type] of [
    ['Shellos East Sea SW','106',60,CardType.WATER],['Sableye SW','63',60,CardType.DARK],
    ['Girafarig MT','49',70,CardType.COLORLESS],['Kricketot MT','86',60,CardType.GRASS],['Nidoran ♀ MT','91',50,CardType.PSYCHIC],['Chimecho MT','22',70,CardType.PSYCHIC],
    ['Clamperl GE','64',40,CardType.WATER],['Togepi GE','88',50,CardType.COLORLESS]
  ] as const) it('registers printed identity '+name,()=>{const c:any=getCardByName(name);expect(c.setNumber).toBe(number);expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);});
  for (const copied of [false,true]) {
    const label=copied?'copied ':'direct ';
    for(const [card,move,pick] of [['Shellos East Sea SW','Shell Hunting','Shellos East Sea SW'],['Kricketot MT','Call for Family','Bulbasaur BS'],['Nidoran ♀ MT','Call for Family','Nidoran ♂ SW']] as const) it(label+card+' searches and Benches a legal Basic',()=>{
      const g=game(card,['Water Energy SVE'],copied),target=fresh(pick);g.player1.deck.cards.unshift(target);let shuffled=false;
      g.overridePrompt('Choose cards',(p:any)=>[p.cards.cards.indexOf(target)]);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_:unknown,i:number)=>i)});
      attack(g,move,copied);expect(g.player1.bench.some(b=>b.cards.includes(target))).toBe(true);expect(shuffled).toBe(true);
    });
    it(label+'private Basic search may fail and still shuffles',()=>{
      const g=game('Kricketot MT',['Grass Energy SVE'],copied);let shuffled=false;g.overridePrompt('Choose cards',()=>[]);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_:unknown,i:number)=>i)});
      attack(g,'Call for Family',copied);expect(shuffled).toBe(true);
    });
    it(label+'Sableye reveals selected Trainer before moving it, then shuffles',()=>{
      const g=game('Sableye SW',['Darkness Energy SVE'],copied),trainer=fresh("Boss's Orders PAL"), first=fresh('Squirtle BS');g.player1.deck.cards.unshift(first,trainer);let shown=false,movedBefore=false,shuffled=false;
      g.overridePrompt('Choose cards',()=>[1]);g.overridePrompt('Show cards',()=>{shown=true;movedBefore=g.player1.hand.cards.includes(trainer);return true});g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_:unknown,i:number)=>i)});
      attack(g,'Rummage',copied);expect(shown).toBe(true);expect(movedBefore).toBe(false);expect(g.player1.hand.cards).toContain(trainer);expect(shuffled).toBe(true);
    });
    for (const count of [1,3]) it(label+'Sableye selects every Trainer from a '+count+'-card deck',()=>{
      const g=game('Sableye SW',['Darkness Energy SVE'],copied),cards=Array.from({length:count},()=>fresh("Boss's Orders PAL"));g.player1.deck.cards=cards.slice();let shown=false,shuffled=false;
      g.overridePrompt('Choose cards',(p:any)=>p.cards.cards.map((_:unknown,i:number)=>i));g.overridePrompt('Show cards',()=>{shown=true;expect(cards.some(card=>g.player1.hand.cards.includes(card))).toBe(false);return true});g.overridePrompt('Shuffle deck',()=>{shuffled=true;return []});
      attack(g,'Rummage',copied);expect(shown).toBe(true);expect(shuffled).toBe(true);for(const card of cards)expect(g.player1.hand.cards).toContain(card);expect(g.player1.deck.cards.length).toBe(0);
    });
    it(label+'Sableye sees top five, can select none, and shuffles',()=>{
      const g=game('Sableye SW',['Darkness Energy SVE'],copied);let viewed=0,shuffled=false;
      g.overridePrompt('Choose cards',(p:any)=>{viewed=p.cards.cards.length;return []});g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_:unknown,i:number)=>i)});
      attack(g,'Rummage',copied);expect(viewed).toBe(5);expect(shuffled).toBe(true);
    });
    for (const unequal of [false,true]) it(label+'Sableye Shadow Sneak prize comparison '+unequal,()=>{
      const g=game('Sableye SW',['Darkness Energy SVE','Water Energy SVE'],copied);if(unequal)g.player2.prizes[0].cards=[];
      attack(g,'Shadow Sneak',copied);expect(g.player2.active.damage).toBe(copied?(unequal?40:20):(unequal?80:40));
    });
    it(label+'Girafarig reveals selected Trainer before moving it',()=>{
      const g=game('Girafarig MT',['Water Energy SVE'],copied),trainer=fresh("Boss's Orders PAL");g.player1.deck.cards.unshift(trainer);let shown=false,moved=false;
      g.overridePrompt('Choose cards',(p:any)=>[p.cards.cards.indexOf(trainer)]);g.overridePrompt('Show cards',()=>{shown=true;moved=g.player1.hand.cards.includes(trainer);return true});
      attack(g,'Crane Neck',copied);expect(shown).toBe(true);expect(moved).toBe(false);expect(g.player1.hand.cards).toContain(trainer);
    });
    for(const [card,move,condition] of [['Girafarig MT','Psybeam',SpecialCondition.CONFUSED],['Nidoran ♀ MT','Poison Sting',SpecialCondition.POISONED]] as const) {
      for(const heads of [false,true])it(label+card+' coin condition heads '+heads,()=>{
        const g=game(card,['Psychic Energy SVE','Water Energy SVE'],copied);(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);
        spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(condition))applied=true;return reduce(s,e)});attack(g,move,copied);expect(applied).toBe(heads);
      });
    }
    for(const heads of [false,true])it(label+'Clamperl Clamp heads '+heads,()=>{
      const g=game('Clamperl GE',['Water Energy SVE'],copied);(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.PARALYZED))applied=true;return reduce(s,e)});
      attack(g,'Clamp',copied);expect(g.player2.active.damage).toBe(heads?10:0);expect(applied).toBe(heads);
    });
    for(const heads of [false,true])it(label+'Clamperl miss ignores additive attack bonus '+heads,()=>{
      const g=game('Clamperl GE',['Water Energy SVE'],copied);class Bonus extends TrainerCard {public name='Bonus';public fullName='Bonus TEST';public set='TEST';public trainerType=TrainerType.STADIUM;public reduceEffect(_s:StoreLike,state:State,e:Effect):State {if(e instanceof AttackEffect)e.damage+=20;return state;}}g.player1.stadium.cards.push(new Bonus());
      (Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);attack(g,'Clamp',copied);expect(g.player2.active.damage).toBe(heads?30:0);
    });
    for(const heads of [false,true])it(label+'Togepi finds and reveals a Pokémon only on heads '+heads,()=>{
      const g=game('Togepi GE',['Water Energy SVE'],copied),target=fresh('Squirtle BS');g.player1.deck.cards.unshift(target);(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);let shown=false;
      g.overridePrompt('Choose cards',(p:any)=>[p.cards.cards.indexOf(target)]);g.overridePrompt('Show cards',()=>{shown=true;expect(g.player1.hand.cards.includes(target)).toBe(false);return true});
      attack(g,'Find a Friend',copied);expect(shown).toBe(heads);expect(g.player1.hand.cards.includes(target)).toBe(heads);
    });
    for(const evolved of [false,true])it(label+'Chimecho Strange Bell applies only to Basic defender '+evolved,()=>{
      const g=game('Chimecho MT',['Psychic Energy SVE'],copied);if(evolved)g.player2.active.cards.push(fresh('Charmeleon BS'));let confused=false;const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.CONFUSED))confused=true;return reduce(s,e)});attack(g,'Strange Bell',copied);expect(confused).toBe(!evolved);
    });
    for(const under of [false,true])it(label+'Chimecho Call In draws with Chingling under '+under,()=>{
      const g=game('Chimecho MT',['Water Energy SVE'],copied);if(under){class Chingling extends PokemonCard {public name='Chingling';public fullName='Chingling TEST';public set='TEST';};g.player1.active.cards.unshift(new Chingling());}
      const before=g.player1.hand.cards.length;attack(g,'Call In',copied);expect(g.player1.hand.cards.length-before).toBe(under?3:1);
    });
  }
  for (const after of [false,true]) it('Clamperl miss ignores bonus '+(after?'after':'before')+' its reducer',()=>{
    const g=game('Clamperl GE',['Water Energy SVE']),events:string[]=[];
    class Before extends TrainerCard {public name='Bonus';public fullName='Bonus TEST';public set='TEST';public trainerType=TrainerType.STADIUM;public reduceEffect(_s:StoreLike,state:State,e:Effect):State {if(e instanceof AttackEffect){events.push('bonus');e.damage+=20}return state;}}
    class After extends PokemonCard {public name='Bonus';public fullName='Bonus TEST';public set='TEST';public reduceEffect(_s:StoreLike,state:State,e:Effect):State {if(e instanceof AttackEffect){events.push('bonus');e.damage+=20}return state;}}
    if(after)g.player1.bench[0].cards.push(new After());else g.player1.stadium.cards.push(new Before());
    const source=g.player1.active.getPokemonCard()!,original=source.reduceEffect.bind(source);source.reduceEffect=(store:StoreLike,state:State,e:Effect)=>{if(e instanceof AttackEffect)events.push('clamperl');return original(store,state,e)};
    (Math.random as jasmine.Spy).and.returnValue(0.9);attack(g,'Clamp');expect(events).toContain('bonus');expect(events).toContain('clamperl');expect(events.indexOf('bonus') > events.indexOf('clamperl')).toBe(after);expect(g.player2.active.damage).toBe(0);
  });
  for(const redirect of [false,true])it('Basic Bench search respects '+(redirect?'redirection':'prevention')+' and still shuffles',()=>{
    const g=game('Kricketot MT',['Grass Energy SVE']),target=fresh('Bulbasaur BS');g.player1.deck.cards.unshift(target);let shuffled=false;const reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof PlayPokemonFromDeckEffect){if(redirect)e.target=g.player1.bench[4];else e.preventDefault=true;}return reduce(s,e)});
    g.overridePrompt('Choose cards',(p:any)=>[p.cards.cards.indexOf(target)]);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_:unknown,i:number)=>i)});attack(g,'Call for Family');
    expect(g.player1.bench[4].cards.includes(target)).toBe(redirect);expect(g.player1.deck.cards.includes(target)).toBe(!redirect);expect(shuffled).toBe(true);
  });
  it('round-trips all eight cards through real ClientSimulator snapshots',()=>{
    ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];
    const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;expect(card).toBeDefined();card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);};
    state.players.forEach((p,i)=>{p.id=i+1;p.name=i?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(x=>add(x,'Fire Energy SVE'));for(let j=0;j<8;j++)add(p.deck,'Fire Energy SVE');add(p.active,i?'Charmander BS':names[0]);});
    for(const name of names.slice(1))add(state.players[0].deck,name);
    const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});const decoded=new ClientSimulator().validateSnapshot(sim.getStateData());for(const name of names) expect(decoded.cardNames).toContain(name);sim.cleanup();
  });
});
