import { COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { cloneAttacks, openCopyAttackSession } from '../../game/store/prefabs/copy-attack-delegation';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChoosePokemonPrompt, ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { State, GamePhase } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('Diamond & Pearl fighting lines and Ponyta', () => {
  for (const [name, number, weakness, value, evolves] of [
    ['Machop DP','86',CardType.PSYCHIC,10,''], ['Machoke DP','53',CardType.PSYCHIC,20,'Machop'],
    ['Machamp DP','31',CardType.PSYCHIC,30,'Machoke'], ['Riolu DP','61',CardType.PSYCHIC,10,''],
    ['Lucario DP','6',CardType.PSYCHIC,20,'Riolu'], ['Ponyta DP','94',CardType.WATER,10,'']
  ] as const) {
    it(`registers ${name} with the printed identity and +${value} weakness`, () => {
      const card = getCardByName(name) as PokemonCard;
      expect(card.set).toBe('DP'); expect(card.setNumber).toBe(number);
      expect(card.weakness).toEqual([{type:weakness,value}]);
      if (evolves) expect(card.evolvesFrom).toBe(evolves);
    });
  }
  for (const [damage,expected] of [[0,40],[10,30],[40,0],[60,0]]) {
    it(`Machoke Karate Chop uses its own ${damage} damage and floors at zero`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Machoke DP',damage,energy:['Fighting Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      g.player2.active.getPokemonCard()!.resistance=[]; useAttack(g.store,g.state,0,'Karate Chop'); expect(g.player2.active.damage).toBe(expected);
    });
  }
  for (const [anyKnockout,attackDamage,expected] of [[false,false,20],[true,false,20],[true,true,70]] as const) {
    it(`Machamp Revenge distinguishes prior attack damage KO ${anyKnockout}/${attackDamage}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Machamp DP',energy:['Fighting Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      g.player1.pokemonKnockedOutDuringOpponentsLastTurn=anyKnockout;
      g.player1.pokemonKnockedOutByAttackDuringOpponentsLastTurn=attackDamage;
      g.player2.active.getPokemonCard()!.resistance=[]; useAttack(g.store,g.state,0,'Revenge'); expect(g.player2.active.damage).toBe(expected);
    });
  }
  for (const byDamage of [false,true]) {
    it(`Machamp Revenge responds to actual prior-turn ${byDamage?'damage':'counter'} Knock Out provenance`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},bench:[{card:'Machamp DP',energy:['Fighting Energy SVE']}],deck:padDeck(10)},player2:{active:{card:'Shinx DP'},deck:padDeck(10)}});
      g.state.activePlayer=1; g.state.phase=GamePhase.ATTACK;
      g.player1.active.getPokemonCard()!.hp=10;
      const attack=new AttackEffect(g.player2,g.player1,{name:'Test attack',cost:[],damage:10,text:''});
      g.store.reduceEffect(g.state,byDamage?new DealDamageEffect(attack,10):new PutCountersEffect(attack,10));
      g.store.reduceEffect(g.state,new KnockOutEffect(g.player1,g.player1.active));
      expect(g.player1.pokemonKnockedOutDuringOpponentsLastTurn).toBe(true);
      expect(g.player1.pokemonKnockedOutByAttackDuringOpponentsLastTurn).toBe(byDamage);
      g.player1.active=g.player1.bench[0]; g.player1.bench[0]=new (g.player1.active.constructor as any)();
      g.player2.active.getPokemonCard()!.hp=300;
      g.player2.active.getPokemonCard()!.weakness=[];
      g.state.activePlayer=0; g.state.phase=GamePhase.PLAYER_TURN;
      useAttack(g.store,g.state,0,'Revenge');
      expect(g.player2.active.damage).toBe(byDamage?70:20);
    });
  }
  for (const heads of [false,true]) {
    it(`Riolu Wild Kick does ${heads?'30':'nothing'} when heads=${heads}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Riolu DP',energy:['Fighting Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect){e.callback!(heads);return s;}return reduce(s,e);});
      g.player2.active.getPokemonCard()!.resistance=[]; useAttack(g.store,g.state,0,'Wild Kick'); expect(g.player2.active.damage).toBe(heads?30:0);
    });
    it(`Machamp Dynamic Punch applies damage and Confusion only on heads=${heads}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Machamp DP',energy:['Fighting Energy SVE','Fighting Energy SVE','Fighting Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect){e.callback!(heads);return s;}return reduce(s,e);});
      g.player2.active.getPokemonCard()!.resistance=[]; useAttack(g.store,g.state,0,'Dynamic Punch'); expect(g.player2.active.damage).toBe(heads?90:60);
      expect(g.player2.active.specialConditions.includes(SpecialCondition.CONFUSED)).toBe(heads);
    });
  }
  it('Lucario Feint ignores the Defending Pokémon’s Fighting Resistance', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Lucario DP',energy:['Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    g.player2.active.getPokemonCard()!.resistance=[{type:CardType.FIGHTING,value:-30}];
    useAttack(g.store,g.state,0,'Feint'); expect(g.player2.active.damage).toBe(30);
  });
  for (const protect of [false,true]) {
    it(`Lucario Aura Sphere chooses an opposing Bench target and respects Manaphy=${protect}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Lucario DP',energy:['Fighting Energy SVE','Fighting Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},bench:protect?[{card:'Manaphy BRS'},{card:'Piplup DP'}]:[{card:'Piplup DP'}],deck:padDeck(10)}});
      const index=protect?1:0;
      g.overridePrompt(ChoosePokemonPromptType,()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index}]);
      g.player2.active.getPokemonCard()!.resistance=[]; useAttack(g.store,g.state,0,'Aura Sphere');
      expect(g.player2.active.damage).toBe(40); expect(g.player2.bench[index].damage).toBe(protect?0:20);
    });
  }
  it('Aura Sphere has no Bench prompt when the opponent has no Benched Pokémon', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Lucario DP'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const source=g.player1.active.getPokemonCard()!;g.store.reduceEffect(g.state,new AttackEffect(g.player1,g.player2,source.attacks[1]));
    expect(g.state.prompts.some(p=>p instanceof ChoosePokemonPrompt&&p.result===undefined)).toBe(false);
  });
  it('Aura Sphere rejects canceled, wrong-side, Active, empty and stale targets while preserving retry', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Lucario DP'},bench:[{card:'Piplup DP'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Piplup DP'}],deck:padDeck(10)}});
    const source=g.player1.active.getPokemonCard()!;g.store.reduceEffect(g.state,new AttackEffect(g.player1,g.player2,source.attacks[1]));
    const p=g.state.prompts.find(p=>p instanceof ChoosePokemonPrompt&&p.result===undefined) as ChoosePokemonPrompt;
    expect(p).toBeDefined();expect(p.options.allowCancel).toBe(false);
    for (const result of [null,[],[g.player1.active],[g.player1.bench[0]],[g.player2.active],[g.player2.bench[1]]]) {
      expect(()=>(g.store as any).reducePrompt(g.state,new ResolvePromptAction(p.id,result as any))).toThrow();
      expect(p.result).toBeUndefined();
    }
    const target=g.player2.bench[0],card=target.cards[0];target.cards=[];
    expect(()=>(g.store as any).reducePrompt(g.state,new ResolvePromptAction(p.id,[target]))).toThrow();
    expect(p.result).toBeUndefined();target.cards=[card];
    (g.store as any).reducePrompt(g.state,new ResolvePromptAction(p.id,[target]));
    expect(target.damage).toBe(20);expect(g.player1.active.damage).toBe(0);expect(g.player2.active.damage).toBe(0);
  });
  it('copied Aura Sphere targets the opponent’s Bench', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},deck:padDeck(10)},player2:{active:{card:'Lucario DP'},bench:[{card:'Piplup DP'}],deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!; g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[1]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    const choice=g.state.prompts.find(p=>p instanceof ChoosePokemonPrompt && p.result===undefined) as ChoosePokemonPrompt;
    expect(choice).toBeDefined(); (g.store as any).reducePrompt(g.state,new ResolvePromptAction(choice.id,[g.player2.bench[0]]));
    expect(g.player2.bench[0].damage).toBe(20);
  });
  it('copied Karate Chop subtracts damage on the copycat, not on Machoke', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW',damage:10},deck:padDeck(10)},player2:{active:{card:'Machoke DP',damage:20},deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!; source.weakness=[]; g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[0]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    expect(g.player2.active.damage).toBe(50);
  });
  for (const damage of [0,30,40,60]) {
    it(`copied Karate Chop applies correct printed-damage rule with ${damage} damage on Mew and an earlier Skeledirge bonus`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Mew ex 30C',damage},bench:[{card:'Machoke DP'},{card:'Skeledirge ex PAR'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const mew=g.player1.active.getPokemonCard()!,source=g.player1.bench[0].getPokemonCard()!,skeledirge=g.player1.bench[1].getPokemonCard()!;
      const energy=getCardByName('Fire Energy SVE'); g.player1.hand.cards=[energy];
      g.store.reduceEffect(g.state,new PowerEffect(g.player1,skeledirge.powers[0],skeledirge));
      const prompt=g.state.prompts.find(p=>p instanceof ChooseCardsPrompt&&p.result===undefined) as ChooseCardsPrompt;
      expect(prompt).toBeDefined(); (g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,[energy]));
      const cloned=cloneAttacks(source.attacks); openCopyAttackSession(g.state,g.player1,mew,source,cloned,cloned[0]);
      g.state.phase=GamePhase.ATTACK;
      const attack=new AttackEffect(g.player1,g.player2,cloned[0]); g.store.reduceEffect(g.state,attack);
      expect(attack.damage).toBe(damage>=40?0:(40-damage)+60);
    });
  }
  it('direct Karate Chop at zero printed damage is not boosted by Skeledirge', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Machoke DP',damage:40,energy:['Fighting Energy SVE','Water Energy SVE']},bench:[{card:'Skeledirge ex PAR'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const skeledirge=g.player1.bench[0].getPokemonCard()!,energy=getCardByName('Fire Energy SVE');g.player1.hand.cards=[energy];
    g.store.reduceEffect(g.state,new PowerEffect(g.player1,skeledirge.powers[0],skeledirge));
    const prompt=g.state.prompts.find(p=>p instanceof ChooseCardsPrompt&&p.result===undefined) as ChooseCardsPrompt;
    (g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,[energy]));
    g.player2.active.getPokemonCard()!.resistance=[];
    useAttack(g.store,g.state,0,'Karate Chop');expect(g.player2.active.damage).toBe(0);
  });
  it('copied Feint ignores Resistance to the copycat’s type', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},deck:padDeck(10)},player2:{active:{card:'Lucario DP'},deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!; source.weakness=[]; source.resistance=[{type:CardType.PSYCHIC,value:-30}];
    g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[0]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    expect(g.player2.active.damage).toBe(30);
  });
  it('copied Revenge uses the copycat player’s prior-turn knockout history', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},deck:padDeck(10)},player2:{active:{card:'Machamp DP'},deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!; source.weakness=[];
    g.player1.pokemonKnockedOutByAttackDuringOpponentsLastTurn=true;
    g.player2.pokemonKnockedOutByAttackDuringOpponentsLastTurn=false;
    g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[0]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    expect(g.player2.active.damage).toBe(70);
  });
  it('copied Aura Sphere respects the opponent’s Manaphy protection', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},deck:padDeck(10)},player2:{active:{card:'Lucario DP'},bench:[{card:'Manaphy BRS'},{card:'Piplup DP'}],deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!; g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[1]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    const choice=g.state.prompts.find(p=>p instanceof ChoosePokemonPrompt && p.result===undefined) as ChoosePokemonPrompt;
    expect(choice).toBeDefined(); (g.store as any).reducePrompt(g.state,new ResolvePromptAction(choice.id,[g.player2.bench[1]]));
    expect(g.player2.bench[1].damage).toBe(0);
  });
  it('Ponyta Tackle and Machop Low Kick retain their printed costs and damage', () => {
    for(const [name,attack,cost,damage] of [['Ponyta DP','Tackle',[CardType.COLORLESS],10],['Machop DP','Low Kick',[CardType.FIGHTING],20]] as const){
      const c=getCardByName(name) as PokemonCard;
      expect(c.attacks[0].name).toBe(attack); expect(c.attacks[0].cost).toEqual(cost as any); expect(c.attacks[0].damage).toBe(damage);
    }
  });
});
