import { ensureClientCards } from '../../client/cards';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { CheckRetreatCostEffect,CheckHpEffect } from '../../game/store/effects/check-effects';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { padDeck,setupGame,getCardByName } from './test-helpers';
import { playTrainerCard } from './card-test-helpers';

function setup(name:string){return setupGame({turn:3,player1:{active:{card:'Squirtle BS'},bench:[{card:'Pikachu BS'},{card:'Bulbasaur BS'}],hand:[name],deck:padDeck(12)},player2:{active:{card:'Charmander BS'},bench:[{card:'Pikachu BS'},{card:'Mew ex MEW'}],deck:padDeck(12)}})}
function retreat(g:ReturnType<typeof setup>,player:number){const e=new CheckRetreatCostEffect(g.state.players[player]);g.store.reduceEffect(g.state,e);return e.cost;}
function hp(g:ReturnType<typeof setup>,player:number,bench:number){const p=g.state.players[player],target=p.bench[bench];target.hpBonus=0;const e=new CheckHpEffect(p,target);g.store.reduceEffect(g.state,e);return e.hp;}
describe('POP3 Stadium reprints',()=>{
 beforeAll(()=>ensureClientCards());
 for(const [name,num] of [['High Pressure System P3','10'],['Low Pressure System P3','11']])it('metadata '+name,()=>{const card=getCardByName(name);expect([card.fullName,card.set,card.setNumber,(card as any).trainerType]).toEqual([name,'P3',num,TrainerType.STADIUM]);expect(StateSerializer.normalizeCardName(name+' '+num)).toBe(name)});
 it('High Pressure is played and reduces retreat of Fire and Water on both sides only',()=>{const g=setup('High Pressure System P3');const before1=retreat(g,0).length,before2=retreat(g,1).length;playTrainerCard(g.store,g.state,0,'High Pressure System P3');expect(retreat(g,0).length).toBe(Math.max(0,before1-1));expect(retreat(g,1).length).toBe(Math.max(0,before2-1));g.player1.active.cards=[g.player1.bench[0].getPokemonCard()!];expect(retreat(g,0).length).toBe(1)});
 it('Low Pressure is played and boosts Grass and Lightning on both sides, not Psychic',()=>{const g=setup('Low Pressure System P3');const before=[hp(g,0,0),hp(g,0,1),hp(g,1,0),hp(g,1,1)];playTrainerCard(g.store,g.state,0,'Low Pressure System P3');expect([hp(g,0,0),hp(g,0,1),hp(g,1,0),hp(g,1,1)]).toEqual([before[0]+10,before[1]+10,before[2]+10,before[3]])});
 it('same-name Dragon print cannot replace the POP3 Stadium',()=>{const g=setup('High Pressure System P3');g.state.rules.oneStadiumPerTurn=false;const duplicate=getCardByName('High Pressure System DR');duplicate.id=89910;g.player1.hand.cards.push(duplicate);playTrainerCard(g.store,g.state,0,'High Pressure System P3');expect(()=>playTrainerCard(g.store,g.state,0,'High Pressure System DR')).toThrow();expect(g.player1.hand.cards).toContain(duplicate)});
 it('replacing POP3 High Pressure removes its retreat effect',()=>{const g=setup('High Pressure System P3');g.state.rules.oneStadiumPerTurn=false;const replacement=getCardByName('Low Pressure System P3');replacement.id=89911;g.player1.hand.cards.push(replacement);const before=retreat(g,0).length;playTrainerCard(g.store,g.state,0,'High Pressure System P3');expect(retreat(g,0).length).toBe(before-1);playTrainerCard(g.store,g.state,0,'Low Pressure System P3');expect(retreat(g,0).length).toBe(before)});

});
