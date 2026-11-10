import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect, AddSpecialConditionsEffect, DealDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { BeforeDoingDamageEffect } from '../../game/store/effects/game-phase-effects';
import { PassTurnAction } from '../../game/store/actions/game-actions';
import { State } from '../../game/store/state/state';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';

class AttackBonusStadium extends TrainerCard {
  public name = 'Fixture Attack Bonus'; public fullName = 'Fixture Attack Bonus TST'; public set = 'TST';
  public trainerType = TrainerType.STADIUM;
  public reduceEffect(_store:StoreLike,state:State,e:Effect):State { if(e instanceof AttackEffect) e.damage += 20; return state; }
}
function game(card:string, energy:string[]=[], damage=0, bench:string[] = []) {
  return setupGame({turn:2,player1:{active:{card,energy,damage},bench:bench.map(card=>({card})),deck:padDeck(10)},
    player2:{active:{card:'Mew ex MEW'},bench:[{card:'Squirtle BS'}],deck:padDeck(10)}});
}
function flips(...values:number[]) {
  (Math.random as jasmine.Spy).and.callFake(()=>values.length ? values.shift()! : 0.1);
}

describe('Mysterious Treasures follow-up batch',()=>{
  beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
  for (const [name,number] of [['Doduo','80'],['Finneon','83'],['Magikarp','89'],['Slakoth','99'],['Snover','101'],['Teddiursa','105']]) {
    it('registers '+name+' MT with the correct print identity',()=>{const c=getCardByName(name+' MT');expect(c.fullName).toBe(name+' MT');expect(c.setNumber).toBe(number);expect(c.set).toBe('MT')});
  }
  for (const [values,expected] of [[[0.1,0.1],20],[[0.1,0.9],10],[[0.9,0.1],10],[[0.9,0.9],0]] as [number[],number][]) {
    it('Doduo Double Stab deals '+expected+' for its two flips',()=>{flips(...values);const g=game('Doduo MT',['Water Energy SVE']);useAttack(g.store,g.state,0,'Double Stab');expect(g.player2.active.damage).toBe(expected)});
    it('Magikarp Dragon Rage '+(expected===20?'deals 60 on two heads':'does nothing when a flip is tails'),()=>{flips(...values);const g=game('Magikarp MT',['Water Energy SVE','Water Energy SVE']);useAttack(g.store,g.state,0,'Dragon Rage');expect(g.player2.active.damage).toBe(expected===20?60:0)});
  }
  it('Doduo restricts only Accelerating Stab during its next turn and clears after that turn',()=>{
    const g=game('Doduo MT',['Water Energy SVE','Water Energy SVE']);useAttack(g.store,g.state,0,'Accelerating Stab');expect(g.player2.active.damage).toBe(30);
    expect(g.player1.active.cannotUseAttacksNextTurn).toContain('Accelerating Stab');g.store.dispatch(new PassTurnAction(g.player2.id));
    expect(()=>useAttack(g.store,g.state,0,'Accelerating Stab')).toThrow();useAttack(g.store,g.store.state,0,'Double Stab');
    expect(g.store.state.players[0].active.cannotUseAttacksNextTurn).not.toContain('Accelerating Stab');
  });
  it('Doduo does not apply its restriction to a different Pokémon installed in the same slot',()=>{
    const g=game('Doduo MT',['Water Energy SVE','Water Energy SVE']);const source=g.player1.active,card=source.getPokemonCard(),reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{const result=reduce(state,e);if(e instanceof AfterDamageEffect && e.target===g.player2.active && source.getPokemonCard()===card){source.moveTo(g.player1.discard);source.clearEffects();source.cards=[getCardByName('Squirtle BS')]}return result});
    useAttack(g.store,g.state,0,'Accelerating Stab');expect(source.getPokemonCard()!.fullName).toBe('Squirtle BS');expect(source.cannotUseAttacksNextTurn).not.toContain('Accelerating Stab');expect(source.cannotUseAttacksNextTurnPending).not.toContain('Accelerating Stab');
  });
  for (const [damage,expected] of [[0,0],[10,10],[20,20]]) {
    it('Magikarp Flail deals '+expected+' for '+damage+' self damage',()=>{const g=game('Magikarp MT',['Water Energy SVE'],damage);useAttack(g.store,g.state,0,'Flail');expect(g.player2.active.damage).toBe(expected)});
  }
  it('copied Flail uses damage counters on the copycat rather than Magikarp',()=>{
    const g=game('Mew ex 30C',['Water Energy SVE'],40,['Magikarp MT']);g.player1.bench[0].damage=10;g.overridePrompt('Choose attack',()=>({index:0,attack:'Flail'}));useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(40);
  });
  for (const heads of [true,false]) for(const copied of [false,true]) {
    it('Dragon Rage '+(copied?'copied':'direct')+' '+(heads?'receives a bonus on two heads':'does nothing on tails even with a bonus'),()=>{
      flips(0.1,heads?0.1:0.9);const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':'Magikarp MT',energy:['Water Energy SVE','Water Energy SVE'],tools:['Vitality Band SVI']},bench:copied?[{card:'Magikarp MT'}]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const tool=g.player1.active.tools[0];g.player1.active.cards=g.player1.active.cards.filter(card=>card!==tool);
      if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Dragon Rage'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Dragon Rage');
      expect(g.player2.active.damage).toBe(heads?70:0);
    });
  }

  for (const copied of [false,true]) for (const [heads,expected] of [[0,0],[1,20],[2,30]]) {
    it('Doduo Double Stab '+(copied?'copied':'direct')+' with Vitality Band and '+heads+' heads deals '+expected,()=>{
      flips(heads>0?0.1:0.9,heads>1?0.1:0.9);const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':'Doduo MT',energy:['Water Energy SVE'],tools:['Vitality Band SVI']},bench:copied?[{card:'Doduo MT'}]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const tool=g.player1.active.tools[0];g.player1.active.cards=g.player1.active.cards.filter(card=>card!==tool);
      if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Double Stab'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Double Stab');expect(g.player2.active.damage).toBe(expected);
    });
  }
  for (const copied of [false,true]) for (const [damage,expected] of [[0,0],[10,20]]) {
    it('Magikarp Flail '+(copied?'copied':'direct')+' with Vitality Band and '+damage+' damage deals '+expected,()=>{
      const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':'Magikarp MT',energy:['Water Energy SVE'],damage,tools:['Vitality Band SVI']},bench:copied?[{card:'Magikarp MT'}]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const tool=g.player1.active.tools[0];g.player1.active.cards=g.player1.active.cards.filter(card=>card!==tool);
      if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Flail'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Flail');expect(g.player2.active.damage).toBe(expected);
    });
  }

  for (const copied of [false,true]) for (const [heads,expected] of [[0,0],[1,30],[2,40]]) {
    it('Doduo Double Stab '+(copied?'copied':'direct')+' preserves an earlier in-play AttackEffect bonus for '+heads+' heads',()=>{
      flips(heads>0?0.1:0.9,heads>1?0.1:0.9);const g=game(copied?'Mew ex 30C':'Doduo MT',['Water Energy SVE'],0,copied?['Doduo MT']:[]);g.player1.stadium.cards.push(new AttackBonusStadium());
      if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Double Stab'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Double Stab');expect(g.player2.active.damage).toBe(expected);
    });
  }
  for (const copied of [false,true]) for (const [damage,expected] of [[0,0],[10,30]]) {
    it('Magikarp Flail '+(copied?'copied':'direct')+' preserves an earlier in-play AttackEffect bonus with '+damage+' self damage',()=>{
      const g=game(copied?'Mew ex 30C':'Magikarp MT',['Water Energy SVE'],damage,copied?['Magikarp MT']:[]);g.player1.stadium.cards.push(new AttackBonusStadium());
      if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Flail'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Flail');expect(g.player2.active.damage).toBe(expected);
    });
  }

  for (const copied of [false,true]) for (const [heads,expected] of [[0,0],[1,70],[2,80]]) {
    it('Doduo Double Stab '+(copied?'copied':'direct')+' respects real Skeledirge Incendiary Song with '+heads+' heads',()=>{
      flips(heads>0?0.1:0.9,heads>1?0.1:0.9);const g=game(copied?'Mew ex 30C':'Doduo MT',['Water Energy SVE'],0,copied?['Doduo MT','Skeledirge ex PAR']:['Skeledirge ex PAR']);
      const source=g.player1.bench[copied?1:0].getPokemonCard()!;g.player1.marker.addMarker('INCENDIARY_SONG_MARKER',source);
      if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Double Stab'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Double Stab');expect(g.player2.active.damage).toBe(expected);
    });
  }
  for (const copied of [false,true]) for (const [damage,expected] of [[0,0],[10,70]]) {
    it('Magikarp Flail '+(copied?'copied':'direct')+' respects real Skeledirge Incendiary Song with '+damage+' self damage',()=>{
      const g=game(copied?'Mew ex 30C':'Magikarp MT',['Water Energy SVE'],damage,copied?['Magikarp MT','Skeledirge ex PAR']:['Skeledirge ex PAR']);
      const source=g.player1.bench[copied?1:0].getPokemonCard()!;g.player1.marker.addMarker('INCENDIARY_SONG_MARKER',source);
      if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Flail'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Flail');expect(g.player2.active.damage).toBe(expected);
    });
  }
  it('Finneon prevents attack damage and effects during the opposing turn after heads',()=>{
    const g=game('Finneon MT',['Water Energy SVE']);useAttack(g.store,g.state,0,'Elegant Swim');
    expect(g.player1.active.preventDamageNextTurn).toBe(true);expect(g.player1.active.preventEffectsOfAttacksNextTurn).toBe(true);
    const attack=new AttackEffect(g.player2,g.player1,{name:'Probe',cost:[],damage:30,text:''});const hit=new DealDamageEffect(attack,30);g.store.reduceEffect(g.state,hit);
    const status=new AddSpecialConditionsEffect(attack,[SpecialCondition.CONFUSED]);g.store.reduceEffect(g.state,status);
    expect(g.player1.active.damage).toBe(0);expect(g.player1.active.specialConditions).not.toContain(SpecialCondition.CONFUSED);
    g.store.dispatch(new PassTurnAction(g.player2.id));expect(g.player1.active.preventDamageNextTurn).toBe(false);expect(g.player1.active.preventEffectsOfAttacksNextTurn).toBe(false);
  });
  it('Finneon gains no protection after tails',()=>{
    flips(0.9);const g=game('Finneon MT',['Water Energy SVE']);useAttack(g.store,g.state,0,'Elegant Swim');
    expect(g.player1.active.preventDamageNextTurn).toBe(false);expect(g.player1.active.preventEffectsOfAttacksNextTurn).toBe(false);
  });
  it('Finneon protection follows the original attacking slot through a damage-boundary switch',()=>{
    const g=game('Finneon MT',['Water Energy SVE'],0,['Squirtle BS']);const source=g.player1.active,replacement=g.player1.bench[0],reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{const result=reduce(state,e);if(e instanceof AttackEffect && e.attack.name==='Elegant Swim' && g.player1.active===source)g.player1.switchPokemon(replacement);return result});
    useAttack(g.store,g.state,0,'Elegant Swim');expect(g.player1.active).toBe(replacement);expect(replacement.preventDamageNextTurn).toBe(false);expect(source.preventDamageNextTurn).toBe(true);
  });
  it('Mew copies Finneon protection onto itself',()=>{
    const g=game('Mew ex 30C',['Water Energy SVE'],0,['Finneon MT']);g.overridePrompt('Choose attack',()=>({index:0,attack:'Elegant Swim'}));useAbility(g.store,g.state,0,'Memory Helix');
    expect(g.player1.active.preventDamageNextTurn).toBe(true);expect(g.player1.active.preventEffectsOfAttacksNextTurn).toBe(true);expect(g.player1.bench[0].preventDamageNextTurn).toBe(false);
  });
  for (const heads of [true,false]) {
    it('Snover Snowball Fight '+(heads?'does not recoil on heads':'recoils only after outgoing damage on tails'),()=>{
      flips(heads?0.1:0.9);const g=game('Snover MT',['Water Energy SVE','Water Energy SVE']);const events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push(e.target===g.player1.active?'self':'opponent');return reduce(state,e)});
      useAttack(g.store,g.state,0,'Snowball Fight');expect(g.player2.active.damage).toBe(30);expect(g.player1.active.damage).toBe(heads?0:10);expect(events).toEqual(heads?['opponent']:['opponent','self']);
    });
  }
  it('Snover still recoils if the opponent prevents its damage',()=>{
    flips(0.9);const g=game('Snover MT',['Water Energy SVE','Water Energy SVE']);g.player2.active.preventDamageNextTurn=true;useAttack(g.store,g.state,0,'Snowball Fight');expect(g.player2.active.damage).toBe(0);expect(g.player1.active.damage).toBe(10);
  });
  it('Mew copying Snowball Fight takes its own recoil',()=>{
    flips(0.9);const g=game('Mew ex 30C',['Water Energy SVE','Water Energy SVE'],0,['Snover MT']);g.overridePrompt('Choose attack',()=>({index:0,attack:'Snowball Fight'}));useAbility(g.store,g.state,0,'Memory Helix');
    expect(g.player2.active.damage).toBe(30);expect(g.player1.active.damage).toBe(10);expect(g.player1.bench[0].damage).toBe(0);
  });
  it('Snover looks at the opponent hand without changing it',()=>{
    const g=game('Snover MT');const card=getCardByName('Nest Ball SVI');g.player2.hand.cards.push(card);let prompt:ShowCardsPrompt|undefined;g.overridePrompt('Show cards',p=>{prompt=p as ShowCardsPrompt;return true});
    useAttack(g.store,g.state,0,'Curiosity');expect(prompt!.playerId).toBe(g.player1.id);expect(prompt!.cards).toContain(card);expect(g.player2.hand.cards).toContain(card);
  });
  it('Slakoth applies sleep independently to both actual Active Pokémon',()=>{
    const g=game('Slakoth MT',['Water Energy SVE']);const targets:any[]=[],reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect && e.specialConditions.includes(SpecialCondition.ASLEEP))targets.push(e.target);return reduce(state,e)});
    useAttack(g.store,g.state,0,'Drowsy');expect(targets).toContain(g.player1.active);expect(targets).toContain(g.player2.active);expect(targets.length).toBe(2);
  });
  it('Slakoth still sleeps itself if the defender prevents attack effects',()=>{
    const g=game('Slakoth MT',['Water Energy SVE']);g.player2.active.preventEffectsOfAttacksNextTurn=true;let selfApplied=false,opponentApplied=false;const reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{const result=reduce(state,e);if(e instanceof AddSpecialConditionsEffect && e.specialConditions.includes(SpecialCondition.ASLEEP) && !e.preventDefault){if(e.target===g.player1.active)selfApplied=true;else if(e.target===g.player2.active)opponentApplied=true}return result});
    useAttack(g.store,g.state,0,'Drowsy');expect(selfApplied).toBe(true);expect(opponentApplied).toBe(false);
  });
  it('Mew copies Drowsy as the Pokémon that becomes asleep',()=>{
    const g=game('Mew ex 30C',['Water Energy SVE'],0,['Slakoth MT']);let sourceWasTarget=false;const reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect && e.target===g.player1.active)sourceWasTarget=true;return reduce(state,e)});
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Drowsy'}));useAbility(g.store,g.state,0,'Memory Helix');expect(sourceWasTarget).toBe(true);expect(g.player1.bench[0].specialConditions.length).toBe(0);
  });
  it('Teddiursa removes existing conditions and heals before becoming asleep',()=>{
    const g=game('Teddiursa MT',['Water Energy SVE'],30);g.player1.active.addSpecialCondition(SpecialCondition.POISONED);let beforeSleep=-1,poisonAtSleep=true;const reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect && e.target===g.player1.active){beforeSleep=e.target.damage;poisonAtSleep=e.target.specialConditions.includes(SpecialCondition.POISONED)}return reduce(state,e)});
    useAttack(g.store,g.state,0,'Rest');expect(beforeSleep).toBe(10);expect(poisonAtSleep).toBe(false);
  });
  it('Mew copies Rest onto itself, not the benched Teddiursa',()=>{
    const g=game('Mew ex 30C',['Water Energy SVE'],40,['Teddiursa MT']);g.player1.bench[0].damage=30;g.overridePrompt('Choose attack',()=>({index:0,attack:'Rest'}));
    useAbility(g.store,g.state,0,'Memory Helix');expect(g.player1.active.damage).toBe(20);expect(g.player1.bench[0].damage).toBe(30);
  });
  it('Sweet Palm removes one counter before applying attack damage',()=>{
    const g=game('Teddiursa MT',['Water Energy SVE','Water Energy SVE']);g.player2.active.damage=20;const events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof HealTargetEffect)events.push('heal');if(e instanceof DealDamageEffect)events.push('damage');return reduce(state,e)});
    useAttack(g.store,g.state,0,'Sweet Palm');expect(events.indexOf('heal')).toBeLessThan(events.indexOf('damage'));expect(g.player2.active.damage).toBe(40);
  });
  it('Sweet Palm cannot heal a defender protected from attack effects, but still deals damage',()=>{
    const g=game('Teddiursa MT',['Water Energy SVE','Water Energy SVE']);g.player2.active.damage=20;g.player2.active.preventEffectsOfAttacksNextTurn=true;useAttack(g.store,g.state,0,'Sweet Palm');expect(g.player2.active.damage).toBe(50);
  });
});
