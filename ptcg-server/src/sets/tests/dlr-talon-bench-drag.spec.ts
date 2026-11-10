import { getCardByName, padDeck, setupGame } from './test-helpers';
import { CardManager } from '../../game/cards/card-manager';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { Talonflameex, TalonflameexUR } from '../set-delta-reign/talonflame-ex';
import { MegaKangaskhanex } from '../set-mega-evolution/mega-kangaskhan-ex';

function register() {
 const cm=CardManager.getInstance();
 if(!cm.isCardDefined('Talonflame ex M6')) cm.defineSet([new Talonflameex(),new TalonflameexUR()]);
 if(!cm.isCardDefined('Mega Kangaskhan ex M1S')) cm.defineSet([new MegaKangaskhanex()]);
}
function game(eligible=true) {
 register();
 return setupGame({turn:5,player1:{active:{card:'Mew ex MEW'},bench:eligible?[{card:'Mega Kangaskhan ex M1S'}]:[],hand:['Talonflame ex M6'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
}
function play(g:ReturnType<typeof game>,index:number,player=PlayerType.BOTTOM_PLAYER) {
 return g.store.dispatch(new PlayCardAction(g.player1.id,0,{player,slot:SlotType.BENCH,index}));
}
describe('Talonflame hand-to-Bench drag',()=>{
 it('places the hand Pokémon in the selected empty Bench slot',()=>{const g=game();const card=g.player1.hand.cards[0];play(g,3);expect(g.player1.bench[3].cards).toContain(card);expect(g.player1.bench[3].pokemonPlayedTurn).toBe(g.state.turn);expect(g.player1.hand.cards).not.toContain(card);});
 it('rejects an unavailable hand Ability without moving anything',()=>{const g=game(false),card=g.player1.hand.cards[0];expect(()=>play(g,3)).toThrow();expect(g.player1.hand.cards).toContain(card);expect(g.player1.bench.every(slot=>slot.cards.length===0)).toBe(true);});
 it('does not route an opponent Bench target to the hand Ability',()=>{const g=game(),card=g.player1.hand.cards[0];expect(()=>play(g,3,PlayerType.TOP_PLAYER)).toThrow();expect(g.player1.hand.cards).toContain(card);expect(g.player2.bench[3].cards.length).toBe(0);});
 it('still evolves normally when dropped on Fletchinder',()=>{const g=game(false);class Base extends PokemonCard {public stage=Stage.STAGE_1;public name='Fletchinder';public fullName='Fletchinder TEST';public set='TST';}const base=new Base();base.id=9991;g.player1.bench[2].cards.push(base);g.player1.bench[2].pokemonPlayedTurn=0;const card=g.player1.hand.cards[0];play(g,2);expect(g.player1.bench[2].cards).toContain(card);});
 it('retains tap Ability behavior with the first open Bench slot',()=>{const g=game();const card=g.player1.hand.cards[0];g.store.dispatch(new UseAbilityAction(g.player1.id,'Excited Dive',{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.HAND,index:0}));expect(g.player1.bench[1].cards).toContain(card);});
 it('shows playability only with an eligible Mega and a free Bench, without moving the card during the probe',()=>{const g=game();const card=g.player1.hand.cards[0];g.store.restoreState(g.state);expect(g.player1.playableCardIds).toContain(card.id);expect(g.player1.hand.cards).toContain(card);expect(g.player1.bench.some(slot=>slot.cards.includes(card))).toBe(false);const noMega=game(false);const unavailable=noMega.player1.hand.cards[0];noMega.store.restoreState(noMega.state);expect(noMega.player1.playableCardIds).not.toContain(unavailable.id);});
 it('uses the exact dragged copy when multiple Talonflame are in hand',()=>{const g=game();const first=g.player1.hand.cards[0],second=getCardByName('Talonflame ex M6');second.id=9888;g.player1.hand.cards.push(second);g.store.dispatch(new PlayCardAction(g.player1.id,1,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:4}));expect(g.player1.bench[4].cards).toContain(second);expect(g.player1.hand.cards).toContain(first);expect(g.player1.hand.cards).not.toContain(second);});
 it('does not advertise or place the hand Ability on a full Bench',()=>{const g=game();for(let i=1;i<g.player1.bench.length;i++){const c=getCardByName('Charmander BS');c.id=9800+i;g.player1.bench[i].cards.push(c);}const card=g.player1.hand.cards[0];g.store.restoreState(g.state);expect(g.player1.playableCardIds).not.toContain(card.id);expect(()=>play(g,4)).toThrow();expect(g.player1.hand.cards).toContain(card);});

 it('rejects an ineligible hand Ability even when the card can evolve normally',()=>{
  const g=game(false);class Base extends PokemonCard {public stage=Stage.STAGE_1;public name='Fletchinder';public fullName='Fletchinder TEST';public set='TST';}
  const base=new Base();base.id=9901;g.player1.bench[0].cards.push(base);g.player1.bench[0].pokemonPlayedTurn=0;const card=g.player1.hand.cards[0];
  g.store.restoreState(g.state);expect(g.player1.playableCardIds).toContain(card.id);
  expect(()=>play(g,3)).toThrow();expect(g.player1.hand.cards).toContain(card);expect(g.player1.bench[3].cards.length).toBe(0);expect(g.player1.bench[0].cards).toContain(base);
 });

});
