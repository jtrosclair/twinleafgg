import { CardManager } from '../../game/cards/card-manager';
import { Round32TeamAquasSphealDCR } from '../set-double-crisis/team-aquas-spheal';
import { ensureClientCards } from '../../client/cards';
import { getCardByName,padDeck,setupGame } from './test-helpers';
import { playTrainerCard } from './card-test-helpers';
describe('existing Team Aqua Great Ball two-category selection',()=>{
 beforeAll(()=>{ensureClientCards();const manager=CardManager.getInstance(),spheal=new Round32TeamAquasSphealDCR();if(!manager.isCardDefined(spheal.fullName))manager.defineSet([spheal]);expect(manager.getCardByName(spheal.fullName)).toEqual(jasmine.any(Round32TeamAquasSphealDCR));});
 function make(){const g=setupGame({turn:3,player1:{active:{card:'Turtwig DP'},hand:["Team Aqua's Great Ball DCR"],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});const spheal=getCardByName("Team Aqua's Spheal DCR");spheal.id=997001;g.player1.deck.cards.unshift(spheal);const water=g.player1.deck.cards.find(c=>c.name==='Water Energy')!;g.overridePrompt('Show cards',()=>true);return{g,spheal,water}}
 it('control: one Team Aqua Basic can be selected',()=>{const {g,spheal}=make();g.overridePrompt('Choose cards',(p:any)=>[p.cards.cards.indexOf(spheal)]);g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));playTrainerCard(g.store,g.state,0,"Team Aqua's Great Ball DCR");expect(g.player1.hand.cards).toContain(spheal)});
 it('should permit one Team Aqua Basic and one basic Water Energy together',()=>{const {g,spheal,water}=make();let max=-1;g.overridePrompt('Choose cards',(p:any)=>{max=p.options.max;return[p.cards.cards.indexOf(spheal),p.cards.cards.indexOf(water)]});g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));expect(()=>playTrainerCard(g.store,g.state,0,"Team Aqua's Great Ball DCR")).not.toThrow();expect(max).toBeGreaterThanOrEqual(2);expect(g.player1.hand.cards).toContain(spheal);expect(g.player1.hand.cards).toContain(water)});
 it('should shuffle after choosing no cards in a nonempty deck',()=>{const {g}=make();let shuffled=false;g.overridePrompt('Choose cards',()=>[]);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i)});playTrainerCard(g.store,g.state,0,"Team Aqua's Great Ball DCR");expect(shuffled).toBe(true)});
});
