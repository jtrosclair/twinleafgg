import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect, AddSpecialConditionsEffect, DealDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { StoreLike } from '../../game/store/store-like';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { AttackAction } from '../../game/store/actions/game-actions';
import { GamePhase } from '../../game/store/state/state';
class AttackBonusStadium extends TrainerCard {
  public name='Fixture Attack Bonus';public fullName='Fixture Attack Bonus TST';public set='TST';public trainerType=TrainerType.STADIUM;
  public reduceEffect(_store:StoreLike,state:State,e:Effect):State { if(e instanceof AttackEffect)e.damage+=20;return state; }
}

function game(name:string, energy:string[]=[], copied=false, extraBench:string[]=[], opponentBench:string[]=[]) {
  return setupGame({turn:2,
    player1:{active:{card:copied?'Mew ex 30C':name+' GE',energy},bench:[...(copied?[name+' GE']:[]),...extraBench].map(card=>({card})),deck:padDeck(10)},
    player2:{active:{card:'Mew ex MEW'},bench:opponentBench.map(card=>({card})),deck:padDeck(10)}
  });
}
function attack(g:ReturnType<typeof game>, name:string, copied=false) {
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}
  else useAttack(g.store,g.state,0,name);
}
function flips(...values:number[]) {(Math.random as jasmine.Spy).and.callFake(()=>values.length ? values.shift()! : 0.1);}

describe('Great Encounters grouped upstream cards',()=>{
  beforeEach(()=>spyOn(Math,'random').and.returnValue(0.1));
  for(const [name,number,hp,type,weakness,weakValue] of [
    ['Drowzee','65',60,CardType.PSYCHIC,CardType.PSYCHIC,10],['Ekans','66',60,CardType.PSYCHIC,CardType.PSYCHIC,10],
    ['Slugma','83',60,CardType.FIRE,CardType.WATER,10],['Snubbull','84',60,CardType.COLORLESS,CardType.FIGHTING,10],
    ['Torchic','89',50,CardType.FIRE,CardType.WATER,10],['Wingull','95',50,CardType.WATER,CardType.LIGHTNING,10],
    ['Krabby','75',60,CardType.WATER,CardType.LIGHTNING,10],['Mudkip','80',60,CardType.WATER,CardType.GRASS,10],
    ['Mankey','79',50,CardType.FIGHTING,CardType.PSYCHIC,10],['Zangoose','59',70,CardType.COLORLESS,CardType.FIGHTING,20],
    ['Togetic','55',70,CardType.COLORLESS,CardType.LIGHTNING,20],
  ] as const) {
    it('registers exact identity and printed weakness of '+name+' GE',()=>{
      const c:any=getCardByName(name+' GE');expect(c.fullName).toBe(name+' GE');expect(c.set).toBe('GE');expect(c.setNumber).toBe(number);
      expect(c.hp).toBe(hp);expect(c.cardType).toBe(type);expect(c.weakness).toEqual([{type:weakness,value:weakValue}]);
    });
  }
  for(const [name,move,energy,damage] of [
    ['Wingull','Water Drip',['Water Energy SVE'],10],['Wingull','Wing Attack',['Water Energy SVE','Water Energy SVE'],20],
    ['Krabby','Irongrip',['Water Energy SVE'],10],['Krabby','Guillotine',['Water Energy SVE','Water Energy SVE'],30],
    ['Torchic','Peck',[],10],['Drowzee','Headbutt',['Psychic Energy SVE','Psychic Energy SVE'],20],
  ] as Array<[string,string,string[],number]>) {
    it(name+' uses '+move+' at its printed damage',()=>{const g=game(name,energy);attack(g,move);expect(g.player2.active.damage).toBe(damage);});
  }
  for(const c of [
    {name:'Drowzee',move:'Hypnosis',energy:['Psychic Energy SVE'],status:SpecialCondition.ASLEEP},
    {name:'Torchic',move:'Singe',energy:['Fire Energy SVE'],status:SpecialCondition.BURNED},
  ]) for(const copied of [false,true]) {
    it((copied?'copied ':'direct ')+c.name+' applies '+c.move+' to the defender',()=>{
      const g=game(c.name,c.energy,copied);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect && e.target===g.player2.active && e.specialConditions.includes(c.status))applied=true;return reduce(s,e)});
      attack(g,c.move,copied);expect(applied).toBe(true);
    });
    it((copied?'copied ':'direct ')+c.name+' respects defending attack-effect protection',()=>{
      const g=game(c.name,c.energy,copied);g.player2.active.preventEffectsOfAttacksNextTurn=true;let applied=false;const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const result=reduce(s,e);if(e instanceof AddSpecialConditionsEffect && e.target===g.player2.active && e.specialConditions.includes(c.status)&&!e.preventDefault)applied=true;return result});
      attack(g,c.move,copied);expect(applied).toBe(false);
    });
  }
  for(const c of [
    {name:'Ekans',move:'Poison Fang',energy:['Psychic Energy SVE'],status:SpecialCondition.POISONED,damage:10},
    {name:'Slugma',move:'Body Slam',energy:['Water Energy SVE','Water Energy SVE'],status:SpecialCondition.PARALYZED,damage:20},
  ]) for(const copied of [false,true]) {
    it((copied?'copied ':'direct ')+c.name+' flips after damage and applies heads status',()=>{
      const g=game(c.name,c.energy,copied),target=g.player2.active,events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof DealDamageEffect && e.target===target)events.push('damage');if(e instanceof CoinFlipEffect)events.push('coin');if(e instanceof AddSpecialConditionsEffect && e.target===target && e.specialConditions.includes(c.status))events.push('status');return reduce(s,e)});
      attack(g,c.move,copied);expect(events).toEqual(['damage','coin','status']);expect(target.damage).toBe(c.damage+(c.status===SpecialCondition.POISONED?10:0));
    });
    it((copied?'copied ':'direct ')+c.name+' still flips if the damaged defender is replaced and does not affect replacement',()=>{
      const g=game(c.name,c.energy,copied),target=g.player2.active,original=target.getPokemonCard()!,events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);let replaced=false;
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect)events.push('coin');if(e instanceof AddSpecialConditionsEffect && e.specialConditions.includes(c.status))events.push('status');const result=reduce(s,e);
        if(!replaced&&e instanceof AfterDamageEffect&&e.target===target){replaced=true;target.moveTo(g.player2.discard);target.clearEffects();target.damage=0;target.cards=[getCardByName('Charmander BS')];}return result;});
      attack(g,c.move,copied);expect(replaced).toBe(true);expect(target.getPokemonCard()).not.toBe(original);expect(events.filter(x=>x==='coin').length).toBe(1);expect(events).not.toContain('status');
    });
    it((copied?'copied ':'direct ')+c.name+' tails applies no status',()=>{
      const g=game(c.name,c.energy,copied);(Math.random as jasmine.Spy).and.returnValue(0.9);let applied=false;const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect&&e.specialConditions.includes(c.status))applied=true;return reduce(s,e)});
      attack(g,c.move,copied);expect(applied).toBe(false);
    });
  }
  for(const copied of [false,true]) {
    it((copied?'copied ':'direct ')+'Ekans heals only its attacker after damage',()=>{
      const g=game('Ekans',['Psychic Energy SVE'],copied);g.player1.active.damage=40;const before=g.player1.active;let healed:any;const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof HealTargetEffect)healed=e.target;return reduce(s,e)});
      attack(g,'Shed Skin',copied);expect(healed).toBe(before);expect(before.damage).toBe(20);expect(g.player2.active.damage).toBe(0);
    });
    it((copied?'copied ':'direct ')+'Snubbull lets its opponent choose the replacement',()=>{
      const g=game('Snubbull',['Water Energy SVE'],copied,[],['Squirtle BS']);const original=g.player2.active;let chooser=-1;
      g.overridePrompt('Choose pokemon',p=>{chooser=p.playerId;return [{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}]});
      attack(g,'Roar',copied);expect(chooser).toBe(g.player2.id);expect(g.player2.active.getPokemonCard()!.fullName).toBe('Squirtle BS');expect(g.player2.active).not.toBe(original);
    });
    it((copied?'copied ':'direct ')+'Snubbull respects attack-effect protection',()=>{
      const g=game('Snubbull',['Water Energy SVE'],copied,[],['Squirtle BS']),original=g.player2.active;original.preventEffectsOfAttacksNextTurn=true;
      attack(g,'Roar',copied);expect(g.player2.active).toBe(original);
    });
    it((copied?'copied ':'direct ')+'Mankey Rage counts the actual attacking Pokémon damage',()=>{
      const g=game('Mankey',['Fighting Energy SVE','Fighting Energy SVE'],copied);g.player1.active.damage=30;g.player2.active.getPokemonCard()!.resistance=[];attack(g,'Rage',copied);expect(g.player2.active.damage).toBe(40);
    });
    it((copied?'copied ':'direct ')+'Zangoose gains damage for an opposing Benched Seviper',()=>{
      const g=game('Zangoose',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],copied,[],['Seviper SVI']);attack(g,'Cutting Claw',copied);expect(g.player2.active.damage).toBe(90);
    });
    it((copied?'copied ':'direct ')+'Zangoose ignores its own Seviper',()=>{
      const g=game('Zangoose',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],copied,['Seviper SVI']);attack(g,'Cutting Claw',copied);expect(g.player2.active.damage).toBe(40);
    });
    for(const agree of [false,true]) it((copied?'copied ':'direct ')+'Togetic offers the opponent a draw after damage: '+agree,()=>{
      const g=game('Togetic',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],copied);const before=g.player2.hand.cards.length;let chooser=-1,damageAtChoice=-1;
      g.overridePrompt('Confirm',p=>{chooser=p.playerId;damageAtChoice=g.player2.active.damage;return agree;});attack(g,'Sweet Kiss',copied);
      expect(chooser).toBe(g.player2.id);expect(damageAtChoice).toBe(50);expect(g.player2.hand.cards.length).toBe(before+(agree?2:1));
    });
  }
  for(const copied of [false,true]) {
    it((copied?'copied ':'direct ')+'Ekans does not heal a replacement placed into its old slot',()=>{
      const g=game('Ekans',['Psychic Energy SVE'],copied),source=g.player1.active,original=source.getPokemonCard()!,reduce=g.store.reduceEffect.bind(g.store);let replaced=false;
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const r=reduce(s,e);if(!replaced&&e instanceof AttackEffect&&e.attack.name==='Shed Skin'){replaced=true;source.moveTo(g.player1.discard);source.clearEffects();source.cards=[getCardByName('Charmander BS')];source.damage=30;}return r;});
      attack(g,'Shed Skin',copied);expect(replaced).toBe(true);expect(source.getPokemonCard()).not.toBe(original);expect(source.damage).toBe(30);
    });
    it((copied?'copied ':'direct ')+'Snubbull does not switch a replacement in the defender slot',()=>{
      const g=game('Snubbull',['Water Energy SVE'],copied,[],['Squirtle BS']),target=g.player2.active,original=target.getPokemonCard()!,reduce=g.store.reduceEffect.bind(g.store);let replaced=false;
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{const r=reduce(s,e);if(!replaced&&e instanceof AttackEffect&&e.attack.name==='Roar'){replaced=true;target.moveTo(g.player2.discard);target.clearEffects();target.cards=[getCardByName('Charmander BS')];}return r;});
      attack(g,'Roar',copied);expect(replaced).toBe(true);expect(target.getPokemonCard()).not.toBe(original);expect(g.player2.active).toBe(target);expect(g.player2.bench[0].getPokemonCard()!.fullName).toBe('Squirtle BS');
    });
    it((copied?'copied ':'direct ')+'Snubbull leaves an opponent with no Bench in place',()=>{
      const g=game('Snubbull',['Water Energy SVE'],copied),target=g.player2.active;attack(g,'Roar',copied);expect(g.player2.active).toBe(target);
    });
    it((copied?'copied ':'direct ')+'Mudkip Endeavor preserves another AttackEffect damage bonus',()=>{
      const g=game('Mudkip',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],copied);g.player1.stadium.cards.push(new AttackBonusStadium());(Math.random as jasmine.Spy).and.returnValue(0.1);
      attack(g,'Endeavor',copied);expect(g.player2.active.damage).toBe(90);
    });
    it((copied?'copied ':'direct ')+'Togetic skips the optional draw when the opponent deck is empty',()=>{
      const g=game('Togetic',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],copied);g.player2.deck.cards=[];let confirmed=false;
      g.overridePrompt('Confirm',()=>{confirmed=true;return true});attack(g,'Sweet Kiss',copied);expect(confirmed).toBe(false);
    });
  }
  it('loads, plays, validates and resumes a newly registered card in the actual ClientSimulator',()=>{
    ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];
    const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;expect(card).toBeDefined();card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);};
    state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Opponent':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(prize=>add(prize,'Fire Energy SVE'));for(let i=0;i<10;i++)add(p.deck,'Fire Energy SVE');add(p.active,index?'Mew ex MEW':'Slugma GE');});
    add(state.players[0].active,'Fire Energy SVE');add(state.players[0].active,'Fire Energy SVE');
    const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});
    (Math.random as jasmine.Spy).and.returnValue(0.1);sim.dispatch(new AttackAction(sim.humanPlayerId,'Body Slam'));
    expect(sim.state.players[1].active.damage).toBe(20);expect(sim.state.players[1].active.specialConditions).toContain(SpecialCondition.PARALYZED);
    const encoded=sim.getStateData();const restored=new ClientSimulator();const validated=restored.validateSnapshot(encoded);
    expect(validated.players[1].active.specialConditions).toContain(SpecialCondition.PARALYZED);restored.loadSnapshot({stateData:encoded});
    expect(restored.state.players[0].active.getPokemonCard()!.fullName).toBe('Slugma GE');expect(restored.state.players[1].active.damage).toBe(20);expect(restored.state.activePlayer).toBe(0);
    restored.cleanup();sim.cleanup();
  });
  for(const [values,expected] of [[[0.9,0.9],30],[[0.1,0.9],50],[[0.1,0.1],70]] as Array<[number[],number]>) for(const copied of [false,true]) {
    it((copied?'copied ':'direct ')+'Mudkip Endeavor deals '+expected+' for its flips',()=>{
      const g=game('Mudkip',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],copied);flips(...values);attack(g,'Endeavor',copied);expect(g.player2.active.damage).toBe(expected);
    });
  }
});
