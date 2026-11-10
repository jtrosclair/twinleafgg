import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect, AddSpecialConditionsEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { CardList } from '../../game/store/state/card-list';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { AttackAction } from '../../game/store/actions/game-actions';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';

function game(card: string, energy: string[] = [], bench: string[] = []) {
  return setupGame({turn: 2,
    player1: {active: {card, energy}, deck: padDeck(10)},
    player2: {active: {card: 'Mew ex MEW'}, bench: bench.map(card => ({card})), deck: padDeck(10)}
  });
}
function copied(g: ReturnType<typeof game>, sourceName: string, attackName: string) {
  const source = getCardByName(sourceName) as any;
  const attack = source.attacks.find((a: any) => a.name === attackName);
  g.player2.lostzone.cards.push(source);
  g.state.playerLastAttack[g.player2.id] = {sourceCard: source, attack};
  COPY_OPPONENTS_LAST_ATTACK(g.store, g.state, new AttackEffect(g.player1, g.player2, {name:'Mimic', cost:[], damage:0, text:''}));
}

describe('Mysterious Treasures upstream batch', () => {
  beforeEach(() => spyOn(Math, 'random').and.returnValue(0.1));
  for (const [name, number] of [['Aron', '71'], ['Bronzor', '74'], ['Cyndaquil', '79'], ['Gible', '85'], ['Golbat', '50'], ['Chikorita', '77'], ['Paras', '92'], ['Seel', '97'], ['Snorunt', '100'], ['Zubat', '108']]) {
    it('registers the printed '+name+' MT identity', () => {
      const c = getCardByName(name+' MT');
      expect(c.fullName).toBe(name+' MT'); expect(c.set).toBe('MT'); expect(c.setNumber).toBe(number);
    });
  }
  it('Cyndaquil can use its energy-free printed attack', () => {
    const g=game('Cyndaquil MT'); useAttack(g.store,g.state,0,'Tackle');
    expect(g.player2.active.damage).toBe(10);
  });
  it('Cyndaquil uses Live Coal at its printed damage', () => {
    const g=game('Cyndaquil MT',['Fire Energy SVE','Fire Energy SVE']); useAttack(g.store,g.state,0,'Live Coal');
    expect(g.player2.active.damage).toBe(20);
  });
  it('Aron deals Steel Tackle damage before its recoil', () => {
    const g=game('Aron MT',['Metal Energy SVE','Metal Energy SVE']);
    useAttack(g.store,g.state,0,'Steel Tackle'); expect(g.player2.active.damage).toBe(30); expect(g.player1.active.damage).toBe(10);
  });
  it('Aron recoil still occurs when attack damage is prevented', () => {
    const g=game('Aron MT',['Metal Energy SVE','Metal Energy SVE']);g.player2.active.preventDamageNextTurn=true;
    useAttack(g.store,g.state,0,'Steel Tackle');expect(g.player2.active.damage).toBe(0);expect(g.player1.active.damage).toBe(10);
  });
  it('copied Steel Tackle recoils on its actual attacker', () => {
    const g=game('Mew ex MEW'); copied(g,'Aron MT','Steel Tackle');
    expect(g.player1.active.damage).toBe(10);expect(g.player2.active.damage).toBe(30);
  });
  it('Bronzor confuses after heads', () => {
    const g=game('Bronzor MT',['Metal Energy SVE','Metal Energy SVE']);useAttack(g.store,g.state,0,'Dull Light');
    expect(g.player2.active.damage).toBe(20);expect(g.player2.active.specialConditions).toContain(SpecialCondition.CONFUSED);
  });
  it('Bronzor does not confuse after tails', () => {
    const g=game('Bronzor MT',['Metal Energy SVE','Metal Energy SVE']);(Math.random as jasmine.Spy).and.returnValue(0.9);useAttack(g.store,g.state,0,'Dull Light');
    expect(g.player2.active.damage).toBe(20);expect(g.player2.active.specialConditions).not.toContain(SpecialCondition.CONFUSED);
  });
  it('Bronzor respects attack-effect protection', () => {
    const g=game('Bronzor MT',['Metal Energy SVE','Metal Energy SVE']);g.player2.active.preventEffectsOfAttacksNextTurn=true;
    useAttack(g.store,g.state,0,'Dull Light');expect(g.player2.active.specialConditions).not.toContain(SpecialCondition.CONFUSED);
  });
  it('Gible damages the original defender before the opponent chooses a replacement', () => {
    const g=game('Gible MT',['Water Energy SVE'],['Squirtle BS']);const original=g.player2.active;let before=-1,chooser=0;
    g.overridePrompt('Choose pokemon',(p)=>{before=original.damage;chooser=p.playerId;return [{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}]});
    useAttack(g.store,g.state,0,'Push Down');expect(before).toBe(10);expect(chooser).toBe(g.player2.id);
    expect(g.player2.active.getPokemonCard()!.fullName).toBe('Squirtle BS');expect(original.damage).toBe(10);
  });
  it('Gible leaves the defending Pokémon in place when its effects are blocked', () => {
    const g=game('Gible MT',['Water Energy SVE'],['Squirtle BS']);g.player2.active.preventEffectsOfAttacksNextTurn=true;const original=g.player2.active;
    useAttack(g.store,g.state,0,'Push Down');expect(g.player2.active).toBe(original);expect(original.damage).toBe(10);
  });
  it('Gible does not switch a replacement placed into the damaged original slot', () => {
    const g=game('Gible MT',['Water Energy SVE'],['Squirtle BS']);const originalSlot=g.player2.active;const originalCard=originalSlot.getPokemonCard()!;const reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{const result=reduce(state,e);if(e instanceof AfterDamageEffect && e.target===originalSlot && originalSlot.getPokemonCard()===originalCard){originalSlot.moveTo(g.player2.discard);originalSlot.clearEffects();originalSlot.damage=0;originalSlot.cards=[getCardByName('Charmander BS')]}return result});
    useAttack(g.store,g.state,0,'Push Down');expect(g.player2.active).toBe(originalSlot);expect(originalSlot.getPokemonCard()!.fullName).toBe('Charmander BS');expect(g.player2.bench[0].getPokemonCard()!.fullName).toBe('Squirtle BS');
  });
  it('Gible does not switch an empty opposing Bench', () => {
    const g=game('Gible MT',['Water Energy SVE']);const original=g.player2.active;useAttack(g.store,g.state,0,'Push Down');expect(g.player2.active).toBe(original);expect(original.damage).toBe(10);
  });
  it('copied Push Down damages then switches the opposing defender', () => {
    const g=game('Mew ex MEW',[],['Squirtle BS']);const original=g.player2.active;
    copied(g,'Gible MT','Push Down');expect(original.damage).toBe(10);
    const prompt=g.state.prompts.find(p=>p instanceof ChoosePokemonPrompt && p.result===undefined)!;
    expect(prompt.playerId).toBe(g.player2.id);g.store.dispatch(new ResolvePromptAction(prompt.id,[g.player2.bench[0]]));
    expect(g.player2.active.getPokemonCard()!.fullName).toBe('Squirtle BS');
  });

  it('Chikorita Jump On adds 10 damage on heads', () => {
    const g=game('Chikorita MT',['Grass Energy SVE']);useAttack(g.store,g.state,0,'Jump On');expect(g.player2.active.damage).toBe(20);
  });
  it('Chikorita Jump On retains base damage on tails', () => {
    (Math.random as jasmine.Spy).and.returnValue(0.9);const g=game('Chikorita MT',['Grass Energy SVE']);useAttack(g.store,g.state,0,'Jump On');expect(g.player2.active.damage).toBe(10);
  });
  it('Chikorita uses Sleep Scent without Energy and applies sleep on heads', () => {
    const g=game('Chikorita MT');let observed=false;const reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof AddSpecialConditionsEffect && e.specialConditions.includes(SpecialCondition.ASLEEP))observed=true;return reduce(state,e)});
    useAttack(g.store,g.state,0,'Sleep Scent');expect(observed).toBe(true);
  });
  for (const name of ['Paras','Seel']) {
    it(name+' inflicts paralysis on heads', () => {
      const g=game(name+' MT',name==='Paras'?['Grass Energy SVE','Grass Energy SVE']:['Water Energy SVE','Water Energy SVE']);
      useAttack(g.store,g.state,0,name==='Paras'?'Mushroom Tackle':'Freezing Headbutt');
      expect(g.player2.active.specialConditions).toContain(SpecialCondition.PARALYZED);
    });
    it(name+' does not inflict paralysis on tails', () => {
      (Math.random as jasmine.Spy).and.returnValue(0.9);const g=game(name+' MT',name==='Paras'?['Grass Energy SVE','Grass Energy SVE']:['Water Energy SVE','Water Energy SVE']);
      useAttack(g.store,g.state,0,name==='Paras'?'Mushroom Tackle':'Freezing Headbutt');
      expect(g.player2.active.specialConditions).not.toContain(SpecialCondition.PARALYZED);
    });
  }

  for (const [name, attack, energy] of [
    ['Bronzor','Dull Light','Metal Energy SVE'],['Paras','Mushroom Tackle','Grass Energy SVE'],['Seel','Freezing Headbutt','Water Energy SVE']
  ]) {
    it(name+' applies its condition after outgoing damage', () => {
      const g=game(name+' MT',[energy,energy]);const events:string[]=[];const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push('damage');if(e instanceof AddSpecialConditionsEffect)events.push('status');return reduce(state,e)});
      useAttack(g.store,g.state,0,attack);expect(events.indexOf('damage')).toBeGreaterThan(-1);expect(events.indexOf('status')).toBeGreaterThan(events.indexOf('damage'));
    });
    it(name+' does not apply the condition to a replacement switched in by a damage reaction', () => {
      const g=game(name+' MT',[energy,energy],['Squirtle BS']);const defender=g.player2.active;const replacement=g.player2.bench[0];const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{const result=reduce(state,e);if(e instanceof AfterDamageEffect && e.target===defender && g.player2.active===defender)g.player2.switchPokemon(replacement);return result});
      useAttack(g.store,g.state,0,attack);expect(g.player2.active).toBe(replacement);expect(replacement.specialConditions.length).toBe(0);expect(defender.specialConditions.length).toBe(0);
    });
  }
  it('a knocked-out defender does not transfer its condition to the promoted Pokémon', () => {
    const g=game('Bronzor MT',['Metal Energy SVE','Metal Energy SVE'],['Squirtle BS']);g.player2.active.damage=170;
    useAttack(g.store,g.state,0,'Dull Light');expect(g.player2.active.getPokemonCard()!.fullName).toBe('Squirtle BS');expect(g.player2.active.specialConditions.length).toBe(0);
  });
  it('Golbat reveals the hand after outgoing damage even if the defender changes', () => {
    const g=game('Golbat MT',['Psychic Energy SVE'],['Squirtle BS']);g.player2.hand.cards.push(getCardByName('Nest Ball SVI'));
    const defender=g.player2.active,replacement=g.player2.bench[0],events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{const result=reduce(state,e);if(e instanceof AfterDamageEffect && e.target===defender && g.player2.active===defender){events.push('damage');g.player2.switchPokemon(replacement)}return result});
    g.overridePrompt('Show cards',()=>{events.push('show');return true});useAttack(g.store,g.state,0,'Pulse Search');
    expect(events).toEqual(['damage','show']);expect(g.player2.active).toBe(replacement);
  });

  it('Mew Memory Helix copies Bronzor damage and condition after damage', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex 30C',energy:['Metal Energy SVE','Metal Energy SVE']},bench:[{card:'Bronzor MT'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const events:string[]=[],reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof DealDamageEffect)events.push('damage');if(e instanceof AddSpecialConditionsEffect)events.push('status');return reduce(state,e)});
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Dull Light'}));useAbility(g.store,g.state,0,'Memory Helix');
    expect(g.player2.active.damage).toBe(20);expect(g.player2.active.specialConditions).toContain(SpecialCondition.CONFUSED);expect(events.indexOf('status')).toBeGreaterThan(events.indexOf('damage'));
  });

  it('Snorunt Collect draws the top card', () => {
    const g=game('Snorunt MT',['Water Energy SVE']);const top=g.player1.deck.cards[0];const before=g.player1.deck.cards.length;
    useAttack(g.store,g.state,0,'Collect');expect(g.player1.hand.cards).toContain(top);expect(g.player1.deck.cards.length).toBe(before-1);
  });
  for (const heads of [true,false]) {
    it('Snorunt Snowball '+(heads?'deals 20 on heads':'does nothing on tails'), () => {
      (Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Snorunt MT',['Water Energy SVE']);
      useAttack(g.store,g.state,0,'Snowball');expect(g.player2.active.damage).toBe(heads?20:0);
    });
    it('Zubat Supersonic '+(heads?'confuses on heads':'does not confuse on tails'), () => {
      (Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Zubat MT',['Psychic Energy SVE']);
      useAttack(g.store,g.state,0,'Supersonic');expect(g.player2.active.specialConditions.includes(SpecialCondition.CONFUSED)).toBe(heads);
    });
  }

  for (const copied of [false,true]) for (const heads of [false,true]) {
    it('Snorunt Snowball '+(copied?'copied':'direct')+' '+(heads?'receives a real damage bonus on heads':'ignores a real damage bonus on tails'), () => {
      (Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);
      const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':'Snorunt MT',energy:['Water Energy SVE'],tools:['Vitality Band SVI']},bench:copied?[{card:'Snorunt MT'}]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const tool=g.player1.active.tools[0];g.player1.active.cards=g.player1.active.cards.filter(card=>card!==tool);
      if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Snowball'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Snowball');
      expect(g.player2.active.damage).toBe(heads?30:0);
    });
  }
  it('Zubat Bite deals its printed 20 damage', () => {
    const g=game('Zubat MT',['Psychic Energy SVE','Psychic Energy SVE']);useAttack(g.store,g.state,0,'Bite');expect(g.player2.active.damage).toBe(20);
  });
  it('Golbat shows the opposing hand only to the attack owner without moving cards', () => {
    const g=game('Golbat MT',['Psychic Energy SVE']);const card=getCardByName('Nest Ball SVI');g.player2.hand.cards.push(card);let shown: ShowCardsPrompt | undefined;
    g.overridePrompt('Show cards',(p)=>{shown=p as ShowCardsPrompt;return true});useAttack(g.store,g.state,0,'Pulse Search');
    expect(g.player2.active.damage).toBe(30);expect(shown!.playerId).toBe(g.player1.id);expect(shown!.cards).toContain(card);expect(g.player2.hand.cards).toContain(card);
  });
  it('Golbat still damages when the opposing hand is empty', () => {
    const g=game('Golbat MT',['Psychic Energy SVE']);useAttack(g.store,g.state,0,'Pulse Search');expect(g.player2.active.damage).toBe(30);
  });
});
