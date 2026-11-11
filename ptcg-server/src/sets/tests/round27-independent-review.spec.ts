import { ensureClientCards } from '../../client/cards';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { padDeck, setupGame } from './test-helpers';
import { playTrainerCard, useAttack, useAbility } from './card-test-helpers';

describe('independent round27 reprint game actions',()=>{
 beforeAll(()=>ensureClientCards());
 for(const name of ['Rare Candy HP','Rare Candy P5','Rare Candy P8']) it(name+' evolves and discards on an actual PlayItem action',()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Charmander BS'},hand:[name,'Charizard ex OBF'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.player1.canEvolve=true;g.player1.active.pokemonPlayedTurn=1;const candy=g.player1.hand.cards[0];
  g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}]);g.overridePrompt('Choose cards',()=>[0]);
  playTrainerCard(g.store,g.state,0,name);
  expect(g.player1.active.getPokemonCard()!.fullName).toBe('Charizard ex OBF');
  expect(g.player1.discard.cards).toContain(candy);expect(g.player1.hand.cards).not.toContain(candy);expect(g.player1.supporter.cards).not.toContain(candy);
 });
 for(const name of ["Bill's Maintenance RG","Bill's Maintenance P5"])it(name+' shuffles before drawing',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:[name,'Water Energy SVE'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  let handAtShuffle=-1,deckAtShuffle=-1;g.overridePrompt('Choose cards',()=>[0]);g.overridePrompt('Shuffle deck',()=>{handAtShuffle=g.player1.hand.cards.length;deckAtShuffle=g.player1.deck.cards.length;return Array.from({length:deckAtShuffle},(_,i)=>i);});
  playTrainerCard(g.store,g.state,0,name);expect(handAtShuffle).toBe(0);expect(deckAtShuffle).toBe(11);expect(g.player1.hand.cards.length).toBe(3);
 });
 for(const name of ["Roseanne's Research SW","Roseanne's Research P8"])it(name+' always shuffles after choosing zero',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:[name],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  let shuffles=0;g.overridePrompt('Choose cards',()=>[]);g.overridePrompt('Shuffle deck',()=>{shuffles++;return Array.from({length:g.player1.deck.cards.length},(_,i)=>i);});
  playTrainerCard(g.store,g.state,0,name);expect(shuffles).toBe(1);
 });
 for(const name of ['Heal Energy DX','Heal Energy P4'])it(name+' does not heal when attached from deck by Azurill',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Azurill M6'},bench:[{card:'Charmander BS',damage:30}],deck:[name,...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  const card=g.player1.deck.cards[0];g.overridePrompt(AttachEnergyPromptType,()=>[{index:0,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}]);
  useAttack(g.store,g.state,0,'Bouncy-Bounce Charge');expect(g.player1.bench[0].cards).toContain(card);expect(g.player1.bench[0].damage).toBe(30);
 });
});

describe('round27 delta species legal evolution',()=>{
 beforeAll(()=>ensureClientCards());
 for(const [basic,evolution] of [
  ['Treecko δ P4','Grovyle P4'],['Treecko AR 78','Grovyle P4'],
  ['Charmander δ P5','Charmeleon δ P5'],['Charmander BS','Charmeleon δ P5'],
  ['Charmeleon δ P5','Charizard ex OBF'],['Charmeleon BS','Charizard ex OBF']
 ]) it(basic+' evolves into '+evolution,()=>{
  const g=setupGame({turn:5,player1:{active:{card:basic},hand:[evolution],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.player1.canEvolve=true;g.player1.active.pokemonPlayedTurn=1;
  g.store.dispatch(new (require('../../game/store/actions/play-card-action').PlayCardAction)(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
  expect(g.player1.active.getPokemonCard()!.fullName).toBe(evolution);
 });
});

describe('round27 Ivysaur attack-effect protection',()=>{
 beforeAll(()=>ensureClientCards());
 for(const name of ['Ivysaur RG','Ivysaur P2']) for(const copied of [false,true]) for(const protectedTarget of [false,true])
 it(name+' '+(copied?'copied':'direct')+' '+(protectedTarget?'protected':'unprotected'),()=>{
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':name,energy:['Water Energy SVE']},bench:copied?[{card:name}]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW',tools:protectedTarget?['Bent Spoon FCO']:[]},deck:padDeck(10)}});
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Poison Seed'}));useAbility(g.store,g.state,0,'Memory Helix');}
  else useAttack(g.store,g.state,0,'Poison Seed');
  expect(g.player2.active.specialConditions.includes(SpecialCondition.POISONED)).toBe(!protectedTarget);
 });
});
