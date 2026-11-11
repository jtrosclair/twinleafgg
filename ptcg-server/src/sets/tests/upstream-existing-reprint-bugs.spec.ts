import { CardManager } from '../../game/cards/card-manager';
import { PlayerType, SlotType, PlayCardAction } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { Azurill } from '../set-delta-reign/azurill';
import { padDeck, setupGame } from './test-helpers';
import { playTrainerCard, useAttack } from './card-test-helpers';

beforeAll(() => { const c = new Azurill(), m = CardManager.getInstance(); if (!m.isCardDefined(c.fullName)) m.defineSet([c]); });

describe('existing reprint implementation regressions', () => {
  it('Heal Energy does not heal when Azurill attaches it from the deck', () => {
    const g = setupGame({turn:3,player1:{active:{card:'Azurill M6'},bench:[{card:'Charmander BS'}],deck:['Heal Energy DX',...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const target=g.player1.bench[0], energy=g.player1.deck.cards[0]; target.damage=30;
    g.overridePrompt(AttachEnergyPromptType,()=>[{index:0,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}]);
    g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));
    useAttack(g.store,g.state,0,'Bouncy-Bounce Charge');
    expect(target.cards).toContain(energy); expect(target.damage).toBe(30);
  });
  it('Heal Energy still removes a damage counter and conditions on hand attachment', () => {
    const g = setupGame({turn:3,player1:{active:{card:'Charmander BS'},hand:['Heal Energy DX'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    g.player1.active.damage=30; g.player1.active.specialConditions=[SpecialCondition.POISONED];
    g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
    expect(g.player1.active.damage).toBe(20); expect(g.player1.active.specialConditions).not.toContain(SpecialCondition.POISONED);
  });
  it('Heal Energy does not heal a Pokémon-ex when attached from hand', () => {
    const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:['Heal Energy DX'],deck:padDeck(10)},player2:{active:{card:'Charmander BS'},deck:padDeck(10)}});
    g.player1.active.damage=30; g.player1.active.specialConditions=[SpecialCondition.POISONED];
    g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
    expect(g.player1.active.damage).toBe(30); expect(g.player1.active.specialConditions).toContain(SpecialCondition.POISONED);
  });
  it("Roseanne's Research shuffles after the player finds zero cards", () => {
    const g=setupGame({turn:3,player1:{active:{card:'Charmander BS'},hand:["Roseanne's Research SW"],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}}); let shuffled=false;
    g.overridePrompt('Choose cards',()=>[]); g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i)});
    playTrainerCard(g.store,g.state,0,"Roseanne's Research SW"); expect(shuffled).toBe(true);
  });
});
