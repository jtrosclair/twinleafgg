import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttachEnergyPrompt, AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('Diamond & Pearl evolutions', () => {
  for (const [name, number, weakness, value, evolves] of [
    ['Grotle DP','49',CardType.FIRE,20,'Turtwig'],
    ['Torterra DP','17',CardType.FIRE,30,'Grotle'],
    ['Luxio DP','52',CardType.FIGHTING,20,'Shinx']
  ] as const) {
    it(`registers ${name} with its printed evolution and additive weakness`, () => {
      const card = getCardByName(name) as PokemonCard;
      expect(card.setNumber).toBe(number);
      expect(card.evolvesFrom).toBe(evolves);
      expect(card.weakness).toEqual([{type:weakness,value}]);
    });
  }
  for (const heads of [false, true]) {
    it(`Luxio Fasten Claws deals the printed damage when heads=${heads}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Luxio DP',energy:['Grass Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect){e.callback!(heads);return s;}return reduce(s,e);});
      useAttack(g.store,g.state,0,'Fasten Claws');
      expect(g.player2.active.damage).toBe(heads?40:10);
    });
    it(`Luxio Thunder Fang applies paralysis only when heads=${heads}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Luxio DP',energy:['Lightning Energy SVE','Lightning Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect){e.callback!(heads);return s;}return reduce(s,e);});
      useAttack(g.store,g.state,0,'Thunder Fang');
      expect(g.player2.active.damage).toBe(30);
      expect(g.player2.active.specialConditions.includes(SpecialCondition.PARALYZED)).toBe(heads);
    });
    it(`Torterra Body Slam applies paralysis only when heads=${heads}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Torterra DP',energy:['Grass Energy SVE','Grass Energy SVE','Grass Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect){e.callback!(heads);return s;}return reduce(s,e);});
      useAttack(g.store,g.state,0,'Body Slam');
      expect(g.player2.active.damage).toBe(30);
      expect(g.player2.active.specialConditions.includes(SpecialCondition.PARALYZED)).toBe(heads);
    });
  }
  for (const take of [false,true]) {
    it(`Grotle Synthesis can ${take?'attach a Grass Energy to the Bench':'fail to find an Energy'} and shuffles`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Grotle DP',energy:['Grass Energy SVE']},bench:[{card:'Mew ex MEW'}],deck:['Grass Energy SVE','Water Energy SVE',...padDeck(8)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      let shuffled=false;
      g.overridePrompt(AttachEnergyPromptType,prompt=>{
        const p=prompt as AttachEnergyPrompt;
        expect(p.filter.name).toBe('Grass Energy'); expect(p.options.max).toBe(1);
        const water=p.cardList.cards.find(c=>c.name==='Water Energy')!;
        expect(p.validate([{card:water,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}])).toBe(false);
        return take?[{index:p.cardList.cards.findIndex(c=>c.name==='Grass Energy'),to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}]:[];
      });
      g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i);});
      useAttack(g.store,g.state,0,'Synthesis');
      expect(shuffled).toBe(true);
      expect(g.player1.bench[0].cards.some(c=>c.fullName==='Grass Energy SVE')).toBe(take);
      expect(g.player1.bench[0].energies.cards.some(c=>c.fullName==='Grass Energy SVE')).toBe(take);
      expect(g.player1.deck.cards.some(c=>c.fullName==='Grass Energy SVE')).toBe(!take);
    });
  }
  it('Grotle Synthesis still shuffles when no matching Energy exists', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Grotle DP',energy:['Grass Energy SVE']},deck:['Water Energy SVE',...padDeck(8)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    let shuffled=false;
    g.overridePrompt(AttachEnergyPromptType,()=>[]);
    g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i);});
    useAttack(g.store,g.state,0,'Synthesis'); expect(shuffled).toBe(true);
  });
  it('Torterra Leaf Storm heals each friendly Grass Pokémon up to 20 and leaves others and opponent alone', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Torterra DP',damage:30,energy:['Grass Energy SVE','Grass Energy SVE','Water Energy SVE','Water Energy SVE']},bench:[{card:'Turtwig DP',damage:10},{card:'Mew ex MEW',damage:30}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Turtwig DP',damage:30}],deck:padDeck(10)}});
    useAttack(g.store,g.state,0,'Leaf Storm');
    expect(g.player1.active.damage).toBe(10); expect(g.player1.bench[0].damage).toBe(0); expect(g.player1.bench[1].damage).toBe(30);
    expect(g.player2.active.damage).toBe(60); expect(g.player2.bench[0].damage).toBe(30);
  });
  it('copied Leaf Storm heals the copycat player’s Grass Pokémon', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW',damage:30},bench:[{card:'Turtwig DP',damage:30}],deck:padDeck(10)},player2:{active:{card:'Torterra DP',damage:30},deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!; g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[1]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    expect(g.player1.active.damage).toBe(30); expect(g.player1.bench[0].damage).toBe(10); expect(g.player2.active.damage).toBe(90);
  });
  it('copied Synthesis attaches the copycat player’s Energy and shuffles their deck', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},bench:[{card:'Turtwig DP'}],deck:['Grass Energy SVE',...padDeck(8)]},player2:{active:{card:'Grotle DP'},deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!; g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[0]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    const prompt=g.state.prompts.find(p=>p instanceof AttachEnergyPrompt && p.result===undefined) as AttachEnergyPrompt;
    expect(prompt).toBeDefined();
    const energy=prompt.cardList.cards.find(c=>c.name==='Grass Energy')!;
    (g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,[{card:energy,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}]));
    expect(g.player1.bench[0].energies.cards).toContain(energy);
    expect(g.player1.deck.cards).not.toContain(energy);
    expect(g.state.prompts.some(p=>p.type==='Shuffle deck'&&p.playerId===g.player1.id)).toBe(true);
  });

  it('rejects an opponent Active as Synthesis target without moving Energy', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Grotle DP'},deck:['Grass Energy SVE',...padDeck(8)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const grotle=g.player1.active.getPokemonCard()!;
    g.store.reduceEffect(g.state,new AttackEffect(g.player1,g.player2,grotle.attacks[0]));
    const prompt=g.state.prompts.find(p=>p instanceof AttachEnergyPrompt && p.result===undefined) as AttachEnergyPrompt;
    const energy=prompt.cardList.cards.find(c=>c.name==='Grass Energy')!;
    const result=[{card:energy,to:{player:PlayerType.TOP_PLAYER,slot:SlotType.ACTIVE,index:0}}];
    expect(prompt.validate(result)).toBe(true);
    expect(()=>(g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,result))).toThrow();
    expect(g.player2.active.energies.cards).not.toContain(energy);expect(g.player1.deck.cards).toContain(energy);
    expect(prompt.result).toBeUndefined();
  });
  it('rejects an empty own Bench slot without moving Energy', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Grotle DP'},deck:['Grass Energy SVE',...padDeck(8)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const empty=g.player1.bench[0];
    const grotle=g.player1.active.getPokemonCard()!;
    g.store.reduceEffect(g.state,new AttackEffect(g.player1,g.player2,grotle.attacks[0]));
    const prompt=g.state.prompts.find(p=>p instanceof AttachEnergyPrompt && p.result===undefined) as AttachEnergyPrompt;
    const energy=prompt.cardList.cards.find(c=>c.name==='Grass Energy')!;
    const result=[{card:energy,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}];
    expect(prompt.validate(result)).toBe(true);
    expect(()=>(g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,result))).toThrow();
    expect(empty.energies.cards).not.toContain(energy);expect(g.player1.deck.cards).toContain(energy);
    expect(prompt.result).toBeUndefined();
  });
  it('review: prevented movement leaves Energy in deck and still starts the required shuffle', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Grotle DP'},deck:['Grass Energy SVE',...padDeck(8)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const grotle=g.player1.active.getPokemonCard()!, reduce=g.store.reduceEffect.bind(g.store);
    let observed=false;
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof MoveCardsEffect && e.source===g.player1.deck){observed=true;expect(e.sourceCard).toBe(grotle);expect(e.sourceEffect).toBe(grotle.attacks[0]);e.preventDefault=true;}return reduce(s,e);});
    g.store.reduceEffect(g.state,new AttackEffect(g.player1,g.player2,grotle.attacks[0]));
    const prompt=g.state.prompts.find(p=>p instanceof AttachEnergyPrompt && p.result===undefined) as AttachEnergyPrompt;
    const energy=prompt.cardList.cards.find(c=>c.name==='Grass Energy')!;
    (g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,[{card:energy,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}}]));
    expect(observed).toBe(true);expect(g.player1.deck.cards).toContain(energy);expect(g.player1.active.energies.cards).not.toContain(energy);
    expect(g.state.prompts.some(p=>p.type==='Shuffle deck' && p.result===undefined)).toBe(true);
  });

  it('rejects a stale Energy no longer in the deck and preserves the unresolved prompt', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Grotle DP'},deck:['Grass Energy SVE',...padDeck(8)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const grotle=g.player1.active.getPokemonCard()!;
    g.store.reduceEffect(g.state,new AttackEffect(g.player1,g.player2,grotle.attacks[0]));
    const prompt=g.state.prompts.find(p=>p instanceof AttachEnergyPrompt && p.result===undefined) as AttachEnergyPrompt;
    const energy=prompt.cardList.cards.find(c=>c.name==='Grass Energy')!;g.player1.deck.moveCardTo(energy,g.player1.discard);
    const result=[{card:energy,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}}];
    expect(()=>(g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,result))).toThrow();
    expect(g.player1.discard.cards).toContain(energy);expect(g.player1.active.energies.cards).not.toContain(energy);
    expect(prompt.result).toBeUndefined();
  });
  it('rejects non-Grass Energy, multiple transfers and malformed target indexes', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Grotle DP'},deck:['Grass Energy SVE','Water Energy SVE',...padDeck(8)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const grotle=g.player1.active.getPokemonCard()!;
    g.store.reduceEffect(g.state,new AttackEffect(g.player1,g.player2,grotle.attacks[0]));
    const prompt=g.state.prompts.find(p=>p instanceof AttachEnergyPrompt && p.result===undefined) as AttachEnergyPrompt;
    const grass=prompt.cardList.cards.find(c=>c.name==='Grass Energy')!,water=prompt.cardList.cards.find(c=>c.name==='Water Energy')!;
    const target={player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0};
    for (const result of [[{card:water,to:target}],[{card:grass,to:target},{card:water,to:target}],[{card:grass,to:{...target,index:1}}]]) {
      expect(()=>(g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,result))).toThrow();
      expect(prompt.result).toBeUndefined();
    }
    expect(g.player1.deck.cards).toContain(grass);expect(g.player1.deck.cards).toContain(water);
    (g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,[{card:grass,to:target}]));
    expect(g.player1.active.energies.cards).toContain(grass);
  });

});
