import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect, AddSpecialConditionsEffect, DealDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
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
function game(name:string, energy:string[]=[], copied=false, opponentBench:string[]=[]) {
  return setupGame({turn:2,
    player1:{active:{card:copied?'Mew ex 30C':name+' SW',energy},bench:copied?[{card:name+' SW'}]:[],deck:padDeck(10)},
    player2:{active:{card:'Mew ex MEW'},bench:opponentBench.map(card=>({card})),deck:padDeck(10)}
  });
}
function attack(g:ReturnType<typeof game>, move:string, copied=false) {
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:move}));useAbility(g.store,g.state,0,'Memory Helix');}
  else useAttack(g.store,g.state,0,move);
}
describe('Secret Wonders upstream cards',()=>{
  beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
  for(const [name,number,hp,type,weakness,weakValue] of [
    ['Bagon','76',50,CardType.COLORLESS,CardType.COLORLESS,10],['Growlithe','89',70,CardType.FIRE,CardType.WATER,20],
    ['Ivysaur','51',80,CardType.GRASS,CardType.FIRE,20],['Magmar','93',70,CardType.FIRE,CardType.WATER,20],
    ['Shellder','105',50,CardType.WATER,CardType.LIGHTNING,10],['Roselia','62',70,CardType.GRASS,CardType.FIRE,10],
    ['Wartortle','75',80,CardType.WATER,CardType.LIGHTNING,20],['Shroomish','108',50,CardType.GRASS,CardType.FIRE,10],
  ] as const) it('registers printed metadata for '+name,()=>{
    const c:any=getCardByName(name+' SW');expect(c.set).toBe('SW');expect(c.setNumber).toBe(number);expect(c.hp).toBe(hp);
    expect(c.cardType).toBe(type);expect(c.weakness).toEqual([{type:weakness,value:weakValue}]);
  });
  for(const copied of [false,true]) {
    const label=copied?'copied ':'direct ';
    it(label+'Bagon Rage counts the actual attacker damage',()=>{
      const g=game('Bagon',['Water Energy SVE','Water Energy SVE'],copied);g.player1.active.damage=30;
      attack(g,'Rage',copied);expect(g.player2.active.damage).toBe(40);
    });
    for(const [name,move,amount,energy] of [
      ['Ivysaur','Leech Seed',10,['Grass Energy SVE','Water Energy SVE']],
      ['Shellder','Shell Rest',20,['Water Energy SVE']]
    ] as Array<[string,string,number,string[]]>) it(label+name+' heals the original attacker',()=>{
      const g=game(name,energy,copied);g.player1.active.damage=40;const source=g.player1.active,events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push('damage');if(e instanceof HealTargetEffect){events.push('heal');expect(e.target).toBe(source);}return reduce(s,e)});
      attack(g,move,copied);expect(source.damage).toBe(40-amount);expect(events).toContain('heal');if(name==='Ivysaur')expect(events.indexOf('damage')).toBeLessThan(events.indexOf('heal'));
    });
    for(const [name,move,energy,status] of [
      ['Roselia','Sleep Powder',['Water Energy SVE'],SpecialCondition.ASLEEP],
      ['Magmar','Smog',['Fire Energy SVE','Water Energy SVE'],SpecialCondition.POISONED],
      ['Shroomish','Toxic Spore',['Grass Energy SVE','Water Energy SVE'],SpecialCondition.POISONED]
    ] as Array<[string,string,string[],SpecialCondition]>) {
      it(label+name+' applies its condition to the original defender after damage',()=>{
        const g=game(name,energy,copied),target=g.player2.active,events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
        spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect&&e.target===target)events.push('damage');if(e instanceof CoinFlipEffect)events.push('coin');if(e instanceof AddSpecialConditionsEffect&&e.target===target&&e.specialConditions.includes(status))events.push('status');return reduce(s,e)});
        attack(g,move,copied);expect(events).toContain('status');if(name!=='Roselia')expect(events.indexOf('damage')).toBeLessThan(events.indexOf('status'));if(name==='Shroomish')expect(events.indexOf('damage')).toBeLessThan(events.indexOf('coin'));
      });
      it(label+name+' respects attack-effect protection',()=>{
        const g=game(name,energy,copied);g.player2.active.preventEffectsOfAttacksNextTurn=true;let applied=false;const reduce=g.store.reduceEffect.bind(g.store);
        spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const result=reduce(s,e);if(e instanceof AddSpecialConditionsEffect && e.specialConditions.includes(status)&&!e.preventDefault)applied=true;return result});
        attack(g,move,copied);expect(applied).toBe(false);
      });
    }
    it(label+'Shroomish tails does not Poison',()=>{
      const g=game('Shroomish',['Grass Energy SVE','Water Energy SVE'],copied);(Math.random as jasmine.Spy).and.returnValue(0.9);let poisoned=false;const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.POISONED))poisoned=true;return reduce(s,e)});
      attack(g,'Toxic Spore',copied);expect(poisoned).toBe(false);
    });
    it(label+'Growlithe makes the opponent choose the switch',()=>{
      const g=game('Growlithe',['Water Energy SVE'],copied,['Squirtle BS']);let chooser=-1;
      g.overridePrompt('Choose pokemon',p=>{chooser=p.playerId;return [{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}]});
      attack(g,'Roar',copied);expect(chooser).toBe(g.player2.id);expect(g.player2.active.getPokemonCard()!.fullName).toBe('Squirtle BS');
    });
    it(label+'Growlithe respects attack-effect protection',()=>{
      const g=game('Growlithe',['Water Energy SVE'],copied,['Squirtle BS']),target=g.player2.active;target.preventEffectsOfAttacksNextTurn=true;
      attack(g,'Roar',copied);expect(g.player2.active).toBe(target);
    });
    it(label+'Wartortle Giant Wave restricts the actual attacker',()=>{
      const g=game('Wartortle',['Water Energy SVE','Water Energy SVE'],copied),source=g.player1.active;
      attack(g,'Giant Wave',copied);expect(source.cannotUseAttacksNextTurn.concat(source.cannotUseAttacksNextTurnPending)).toContain('Giant Wave');expect(g.player2.active.damage).toBe(40);
    });
  }

  for(const copied of [false,true]) {
    it((copied?'copied ':'direct ')+'Leech Seed does not heal a replacement attacker',()=>{
      const g=game('Ivysaur',['Grass Energy SVE','Water Energy SVE'],copied),source=g.player1.active,original=source.getPokemonCard()!,reduce=g.store.reduceEffect.bind(g.store);let replaced=false;
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const r=reduce(s,e);if(!replaced&&e instanceof AfterDamageEffect){replaced=true;source.moveTo(g.player1.discard);source.clearEffects();source.cards=[getCardByName('Charmander BS')];source.damage=30;}return r});
      attack(g,'Leech Seed',copied);expect(replaced).toBe(true);expect(source.getPokemonCard()).not.toBe(original);expect(source.damage).toBe(30);
    });
    it((copied?'copied ':'direct ')+'Smog does not poison a replacement defender',()=>{
      const g=game('Magmar',['Fire Energy SVE','Water Energy SVE'],copied),target=g.player2.active,original=target.getPokemonCard()!,reduce=g.store.reduceEffect.bind(g.store);let replaced=false,poisoned=false;
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(SpecialCondition.POISONED))poisoned=true;const r=reduce(s,e);if(!replaced&&e instanceof AfterDamageEffect&&e.target===target){replaced=true;target.moveTo(g.player2.discard);target.clearEffects();target.damage=0;target.cards=[getCardByName('Charmander BS')];}return r});
      attack(g,'Smog',copied);expect(replaced).toBe(true);expect(target.getPokemonCard()).not.toBe(original);expect(poisoned).toBe(false);
    });
  }
  it('loads and resumes an added card through the actual ClientSimulator',()=>{
    ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];
    const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;expect(card).toBeDefined();card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);};
    state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(prize=>add(prize,'Fire Energy SVE'));for(let i=0;i<10;i++)add(p.deck,'Fire Energy SVE');add(p.active,index?'Mew ex MEW':'Magmar SW');});
    add(state.players[0].active,'Fire Energy SVE');add(state.players[0].active,'Fire Energy SVE');
    const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});sim.dispatch(new AttackAction(sim.humanPlayerId,'Smog'));
    expect(sim.state.players[1].active.damage).toBe(30);expect(sim.state.players[1].active.specialConditions).toContain(SpecialCondition.POISONED);
    const encoded=sim.getStateData();const restored=new ClientSimulator();const validated=restored.validateSnapshot(encoded);
    expect(validated.players[1].active.specialConditions).toContain(SpecialCondition.POISONED);restored.loadSnapshot({stateData:encoded});
    expect(restored.state.players[0].active.getPokemonCard()!.fullName).toBe('Magmar SW');sim.cleanup();restored.cleanup();
  });

});
