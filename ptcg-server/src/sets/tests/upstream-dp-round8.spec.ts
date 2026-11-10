import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect, CoinFlipSequenceEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { GamePhase, State } from '../../game/store/state/state';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { cloneAttacks, openCopyAttackSession } from '../../game/store/prefabs/copy-attack-delegation';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('Diamond & Pearl Seaking, Hoothoot and Skorupi', () => {
  for (const [name, number, weakness, value, evolves] of [
    ['Seaking DP','62',CardType.LIGHTNING,20,'Goldeen'],
    ['Hoothoot DP','85',CardType.LIGHTNING,10,''], ['Skorupi DP','99',CardType.PSYCHIC,10,'']
  ] as const) {
    it(`registers ${name} with its printed identity and weakness`, () => {
      const c = getCardByName(name) as PokemonCard;
      expect(c.set).toBe('DP'); expect(c.setNumber).toBe(number);
      expect(c.weakness).toEqual([{type:weakness,value}]);
      if (evolves) expect(c.evolvesFrom).toBe(evolves);
    });
  }
  for (const damage of [0,10,30,60]) {
    it(`Seaking Flail does ${damage} damage with ${damage} damage on itself`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Seaking DP',damage,energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      g.player2.active.getPokemonCard()!.resistance=[]; useAttack(g.store,g.state,0,'Flail');
      expect(g.player2.active.damage).toBe(damage);
    });
  }
  it('copied Flail uses the copycat’s damage, not the original Seaking’s', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW',damage:30},deck:padDeck(10)},player2:{active:{card:'Seaking DP',damage:10},deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!; source.weakness=[];
    g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[0]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    expect(g.player2.active.damage).toBe(40);
  });
  for (const damage of [0,10,30]) {
    it(`copied Flail uses printed multiplier rules with ${damage} damage and an earlier Skeledirge bonus`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Mew ex 30C',damage},bench:[{card:'Seaking DP'},{card:'Skeledirge ex PAR'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const mew=g.player1.active.getPokemonCard()!,source=g.player1.bench[0].getPokemonCard()!,skeledirge=g.player1.bench[1].getPokemonCard()!;
      const energy=getCardByName('Fire Energy SVE');g.player1.hand.cards=[energy];
      g.store.reduceEffect(g.state,new PowerEffect(g.player1,skeledirge.powers[0],skeledirge));
      const prompt=g.state.prompts.find(p=>p instanceof ChooseCardsPrompt&&p.result===undefined) as ChooseCardsPrompt;
      expect(prompt).toBeDefined();(g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,[energy]));
      const attacks=cloneAttacks(source.attacks);openCopyAttackSession(g.state,g.player1,mew,source,attacks,attacks[0]);
      g.state.phase=GamePhase.ATTACK;const attack=new AttackEffect(g.player1,g.player2,attacks[0]);g.store.reduceEffect(g.state,attack);
      expect(attack.damage).toBe(damage===0?0:damage+60);
    });
  }
  it('Hoothoot Hypnosis puts the Defending Pokémon to sleep', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Hoothoot DP'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const source=g.player1.active.getPokemonCard()!; g.state.phase=GamePhase.ATTACK;
    g.store.reduceEffect(g.state,new AttackEffect(g.player1,g.player2,source.attacks[0]));
    expect(g.player2.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });
  it('Hypnosis respects protection from attack effects', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Hoothoot DP'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const source=g.player1.active.getPokemonCard()!;g.state.phase=GamePhase.ATTACK;
    g.player2.active.preventEffectsOfAttacksNextTurn=true;
    g.store.reduceEffect(g.state,new AttackEffect(g.player1,g.player2,source.attacks[0]));
    expect(g.player2.active.specialConditions).not.toContain(SpecialCondition.ASLEEP);
  });
  it('copied Hypnosis puts the original attacker to sleep', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},deck:padDeck(10)},player2:{active:{card:'Hoothoot DP'},deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!;
    g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[0]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    expect(g.player2.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });
  for (const heads of [false,true]) {
    it(`Hoothoot Kick Shot ${heads?'deals 30':'does nothing'} when heads=${heads}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Hoothoot DP',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect){e.callback!(heads);return s;}return reduce(s,e);});
      useAttack(g.store,g.state,0,'Kick Shot');expect(g.player2.active.damage).toBe(heads?30:0);
    });
    it(`Skorupi Poison Sting applies Poison only when heads=${heads}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Skorupi DP'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect){e.callback!(heads);return s;}return reduce(s,e);});
      const source=g.player1.active.getPokemonCard()!;g.state.phase=GamePhase.ATTACK;
      g.store.reduceEffect(g.state,new AttackEffect(g.player1,g.player2,source.attacks[0]));
      expect(g.player2.active.specialConditions.includes(SpecialCondition.POISONED)).toBe(heads);
    });
    it(`copied Hoothoot Kick Shot ${heads?'deals 30':'does nothing'} when heads=${heads}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},deck:padDeck(10)},player2:{active:{card:'Hoothoot DP'},deck:padDeck(10)}});
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect){e.callback!(heads);return s;}return reduce(s,e);});
      const source=g.player2.active.getPokemonCard()!;source.weakness=[];
      g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[1]};
      COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
      expect(g.player2.active.damage).toBe(heads?30:0);
    });
  }
  for (const heads of [0,1,2,4]) {
    it(`Skorupi Pin Missile deals ${heads*10} damage for ${heads} heads`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Skorupi DP',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipSequenceEffect){e.callback(Array.from({length:4},(_,i)=>i<heads));return s;}return reduce(s,e);});
      useAttack(g.store,g.state,0,'Pin Missile');expect(g.player2.active.damage).toBe(heads*10);
    });
  }
  it('copied Pin Missile performs all four flips as the copycat', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},deck:padDeck(10)},player2:{active:{card:'Skorupi DP'},deck:padDeck(10)}});
    const reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipSequenceEffect){e.callback([true,false,true,false]);return s;}return reduce(s,e);});
    const source=g.player2.active.getPokemonCard()!;source.weakness=[];
    g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[1]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    expect(g.player2.active.damage).toBe(20);
  });
  for (const heads of [0,2]) {
    it(`copied Pin Missile resolves four real asynchronous flips with ${heads} heads and an earlier bonus`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Mew ex 30C'},bench:[{card:'Skorupi DP'},{card:'Skeledirge ex PAR'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const mew=g.player1.active.getPokemonCard()!,source=g.player1.bench[0].getPokemonCard()!,skeledirge=g.player1.bench[1].getPokemonCard()!;
      const energy=getCardByName('Fire Energy SVE');g.player1.hand.cards=[energy];
      g.store.reduceEffect(g.state,new PowerEffect(g.player1,skeledirge.powers[0],skeledirge));
      const payment=g.state.prompts.find(p=>p instanceof ChooseCardsPrompt&&p.result===undefined) as ChooseCardsPrompt;
      (g.store as any).reducePrompt(g.state,new ResolvePromptAction(payment.id,[energy]));
      const rolls=heads===0?[0.9,0.9,0.9,0.9]:[0.1,0.9,0.1,0.9];
      spyOn(Math,'random').and.returnValues(...rolls);
      const attacks=cloneAttacks(source.attacks);openCopyAttackSession(g.state,g.player1,mew,source,attacks,attacks[1]);
      g.state.phase=GamePhase.ATTACK;const attack=new AttackEffect(g.player1,g.player2,attacks[1]);g.store.reduceEffect(g.state,attack);
      for(let i=0;i<4;i++) {
        const wait=g.state.prompts.find(p=>p instanceof WaitPrompt && p.result===undefined);
        expect(wait).toBeDefined();(g.store as any).reducePrompt(g.state,new ResolvePromptAction(wait!.id,true));
      }
      expect(attack.damage).toBe(heads===0?0:heads*10+60);
    });
  }
  it('Hoothoot applies its printed +10 Lightning Weakness in a real attack', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Luxio DP',energy:['Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Hoothoot DP'},deck:padDeck(10)}});
    const reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect){e.callback!(false);return s;}return reduce(s,e);});
    useAttack(g.store,g.state,0,'Fasten Claws');expect(g.player2.active.damage).toBe(20);
  });
});
