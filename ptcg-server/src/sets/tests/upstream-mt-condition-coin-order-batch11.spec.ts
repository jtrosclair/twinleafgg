import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { AfterDamageEffect, AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { State } from '../../game/store/state/state';

const cases = [
  {name:'Bronzor',attack:'Dull Light',energy:['Metal Energy SVE','Metal Energy SVE'],status:SpecialCondition.CONFUSED,damage:20},
  {name:'Chikorita',attack:'Sleep Scent',energy:[] as string[],status:SpecialCondition.ASLEEP,damage:0},
  {name:'Paras',attack:'Mushroom Tackle',energy:['Grass Energy SVE','Grass Energy SVE'],status:SpecialCondition.PARALYZED,damage:20},
  {name:'Seel',attack:'Freezing Headbutt',energy:['Water Energy SVE','Water Energy SVE'],status:SpecialCondition.PARALYZED,damage:10},
  {name:'Zubat',attack:'Supersonic',energy:['Psychic Energy SVE'],status:SpecialCondition.CONFUSED,damage:0},
];
function game(c:typeof cases[number], copied=false) {
  return setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':c.name+' MT',energy:c.energy},bench:copied?[{card:c.name+' MT'}]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Squirtle BS'}],deck:padDeck(10)}});
}
function attack(g:ReturnType<typeof game>,c:typeof cases[number],copied=false) {
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:c.attack}));useAbility(g.store,g.state,0,'Memory Helix');}
  else useAttack(g.store,g.state,0,c.attack);
}
describe('MT coin-gated Special Conditions resolve after attack damage',()=>{
  beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
  for(const c of cases) {
    for(const copied of [false,true]) {
      it(c.name+' '+(copied?'copied':'direct')+' flips exactly once and applies its heads condition to the original defender',()=>{
        const g=game(c,copied),target=g.player2.active,events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
        spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof DealDamageEffect && e.target===target)events.push('damage');if(e instanceof CoinFlipEffect)events.push('coin');if(e instanceof AddSpecialConditionsEffect && e.target===target && e.specialConditions.includes(c.status))events.push('status');return reduce(state,e)});
        attack(g,c,copied);expect(events.filter(x=>x==='coin').length).toBe(1);expect(events).toContain('status');expect(events.indexOf('status')).toBeGreaterThan(events.indexOf('coin'));
        if(c.damage){expect(events).toContain('damage');expect(events.indexOf('coin')).toBeGreaterThan(events.indexOf('damage'));expect(target.damage).toBe(c.damage);}
      });
      it(c.name+' '+(copied?'copied':'direct')+' still flips after the defender is replaced but does not affect the replacement',()=>{
        const g=game(c,copied),target=g.player2.active,original=target.getPokemonCard()!,events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);let replaced=false;
        spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof CoinFlipEffect)events.push('coin');if(e instanceof AddSpecialConditionsEffect && e.specialConditions.includes(c.status))events.push('status');const result=reduce(state,e);
          if(!replaced && ((c.damage && e instanceof AfterDamageEffect && e.target===target) || (!c.damage && e instanceof AttackEffect && e.attack.name===c.attack))){replaced=true;target.moveTo(g.player2.discard);target.clearEffects();target.damage=0;target.cards=[getCardByName('Charmander BS')];}
          return result;});
        attack(g,c,copied);expect(replaced).toBe(true);expect(target.getPokemonCard()).not.toBe(original);expect(target.getPokemonCard()!.fullName).toBe('Charmander BS');expect(events.filter(x=>x==='coin').length).toBe(1);expect(events).not.toContain('status');expect(target.specialConditions).not.toContain(c.status);
      });
    }
    it(c.name+' tails still emits one coin event but no condition',()=>{
      (Math.random as jasmine.Spy).and.returnValue(0.9);const g=game(c),events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof CoinFlipEffect)events.push('coin');if(e instanceof AddSpecialConditionsEffect && e.specialConditions.includes(c.status))events.push('status');return reduce(state,e)});
      attack(g,c);expect(events.filter(x=>x==='coin').length).toBe(1);expect(events).not.toContain('status');
    });
  }
});
