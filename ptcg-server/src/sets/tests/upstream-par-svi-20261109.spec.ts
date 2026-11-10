import { CardType, SuperType, SpecialCondition } from '../../game/store/card/card-types';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPromptType, ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

describe('Upstream PAR and SVI additions', () => {
  it('registers distinct print identities with the printed weakness', () => {
    for (const [name, set, number] of [['Pansage PAR','PAR','4'], ['Blissey SVI','SVI','145']]) {
      const card = getCardByName(name); expect(card.fullName).toBe(name); expect(card.set).toBe(set); expect(card.setNumber).toBe(number);
    }
    const pansage = getCardByName('Pansage PAR') as any;
    expect(pansage.weakness[0].type).toBe(CardType.FIRE);
  });
  it('Pansage searches privately and can fail the search', () => {
    for (const take of [false, true]) {
      const game=setupGame({turn:2, player1:{active:{card:'Pansage PAR',energy:['Grass Energy SVE']}, deck:['Ralts SIT',...padDeck(8)]}, player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      if (!take) game.overridePrompt(ChooseCardsPromptType, prompt => { const c=prompt as ChooseCardsPrompt; expect(c.options.min).toBe(0); expect(c.validate([])).toBe(true); return []; });
      useAttack(game.store,game.state,0,'Call for Family');
      expect(game.player1.bench.some(slot=>slot.getPokemonCard()?.fullName==='Ralts SIT')).toBe(take);
    }
  });
  it('Pansage can attack with an empty deck or a full Bench', () => {
    for (const full of [false,true]) {
      const game=setupGame({turn:2,player1:{active:{card:'Pansage PAR'},bench:full?Array.from({length:5},()=>({card:'Ralts SIT'})):[],deck:full?padDeck(8):[]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      expect(()=>game.store.reduceEffect(game.state,new AttackEffect(game.player1,game.player2,game.player1.active.getPokemonCard()!.attacks[0]))).not.toThrow();
    }
  });
  it('Pansage Leech Seed deals damage and heals ten', () => {
    const game=setupGame({turn:2,player1:{active:{card:'Pansage PAR',damage:30,energy:['Grass Energy SVE','Water Energy SVE','Fire Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    useAttack(game.store,game.state,0,'Leech Seed');
    expect(game.player1.active.damage).toBe(20);
    expect(game.player2.active.damage).toBe(30);
  });
  it('Blissey clears active special conditions only once per turn', () => {
    const game=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},bench:[{card:'Blissey SVI'}],deck:padDeck(10)},player2:{active:{card:'Ralts SIT'},deck:padDeck(10)}});
    game.player1.active.specialConditions=[SpecialCondition.POISONED,SpecialCondition.BURNED];
    useAbility(game.store,game.state,0,'Busybody Nurse');
    expect(game.player1.active.specialConditions.length).toBe(0);
    expect(()=>useAbility(game.store,game.state,0,'Busybody Nurse')).toThrow();
  });
  it('Blissey moves every attached Energy to the selected Benched Pokémon', () => {
    const game=setupGame({turn:2,player1:{active:{card:'Blissey SVI',energy:['Fire Energy SVE','Water Energy SVE','Grass Energy SVE']},bench:[{card:'Ralts SIT'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    game.overridePrompt(AttachEnergyPromptType, prompt => (prompt as any).cardList.cards.map((c:any,i:number)=>c.superType===SuperType.ENERGY?{index:i,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}:null).filter(Boolean));
    useAttack(game.store,game.state,0,'Happy Cyclone');
    expect(game.player1.active.cards.filter(c=>c.superType===SuperType.ENERGY).length).toBe(0);
    expect(game.player1.bench[0].cards.filter(c=>c.superType===SuperType.ENERGY).length).toBe(3);
  });
});
