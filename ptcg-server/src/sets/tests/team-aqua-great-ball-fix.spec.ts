import { CardList } from '../../game/store/state/card-list';
import { ClientSimulator } from '../../client/simulator';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { Card } from '../../game/store/card/card';
import { GameLog } from '../../game/game-message';
import { getCardByName,padDeck,setupGame } from './test-helpers';
import { playTrainerCard } from './card-test-helpers';

const aqua="Team Aqua's Spheal DCR",item="Team Aqua's Great Ball DCR";
const water='Water Energy SVE',fire='Fire Energy SVE';
function game(deck:string[]=[fire,aqua,water,aqua,water,'Charmander BS','Double Turbo Energy BRS']) {
 const g=setupGame({turn:3,player1:{active:{card:'Turtwig DP'},hand:[item],deck},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
 return g;
}
function first(p:ChooseCardsPrompt,name:string,n=0){const matches=p.cards.cards.map((c,i)=>({c,i})).filter(x=>x.c.fullName===name);return matches[n].i;}

describe("Team Aqua's Great Ball search",()=>{
 for(const selection of ['none','pokemon','water','both'] as const)it('legally selects '+selection+', reveals only chosen cards then shuffles',()=>{
  const g=game(),originalDeck=[...g.player1.deck.cards],ball=g.player1.hand.cards[0],events:string[]=[];let expected:Card[]=[];let shuffledCards:Card[]=[];
  g.overridePrompt('Choose cards',(p:any)=>{
   events.push('choose');expect(p.playerId).toBe(g.player1.id);expect(p.cards).not.toBe(g.player1.deck);expect(g.player1.deck.cards).toEqual(originalDeck);const sorted=new CardList();sorted.cards=[...originalDeck];sorted.sort();expect(p.cards.cards).toEqual(sorted.cards);
   expect(p.options.allowCancel).toBe(false);expect(p.options.max).toBe(2);expect(p.options.maxPokemons).toBe(1);expect(p.options.maxEnergies).toBe(1);
   const indices=selection==='none'?[]:selection==='pokemon'?[first(p,aqua)]:selection==='water'?[first(p,water)]:[first(p,aqua),first(p,water)];
   expected=indices.map(i=>p.cards.cards[i]);return indices;
  });
  g.overridePrompt('Show cards',(p:any)=>{events.push('reveal');expect(p.playerId).toBe(g.player2.id);expect(p.cards).toEqual(expected);for(const c of expected){expect(g.player1.deck.cards).toContain(c);expect(g.player1.hand.cards).not.toContain(c)}return true;});
  g.overridePrompt('Shuffle deck',()=>{events.push('shuffle');shuffledCards=[...g.player1.deck.cards];return shuffledCards.map((_,i)=>shuffledCards.length-1-i);});
  playTrainerCard(g.store,g.state,0,item);
  expect(events).toEqual(expected.length?['choose','reveal','shuffle']:['choose','shuffle']);
  for(const c of expected){expect(g.player1.hand.cards.filter(x=>x===c).length).toBe(1);expect(g.player1.deck.cards).not.toContain(c);}
  expect(g.player1.deck.cards).toEqual(shuffledCards.slice().reverse());expect(g.player1.deck.cards.length).toBe(originalDeck.length-expected.length);
  expect(g.player1.discard.cards.filter(x=>x===ball).length).toBe(1);expect(g.player1.supporter.cards).not.toContain(ball);
 });
 it('requires no more than one from each category and blocks invalid cards',()=>{
  const g=game();g.overridePrompt('Choose cards',(p:any)=>{
   const a=p.cards.cards[first(p,aqua)],a2=p.cards.cards[first(p,aqua,1)],w=p.cards.cards[first(p,water)],w2=p.cards.cards[first(p,water,1)],f=p.cards.cards[first(p,fire)],basic=p.cards.cards[first(p,'Charmander BS')],special=p.cards.cards[first(p,'Double Turbo Energy BRS')];
   expect(p.validate([])).toBe(true);expect(p.validate([a])).toBe(true);expect(p.validate([w])).toBe(true);expect(p.validate([a,w])).toBe(true);
   expect(p.validate([a,a2])).toBe(false);expect(p.validate([w,w2])).toBe(false);expect(p.validate([a,a])).toBe(false);expect(p.validate([w,w])).toBe(false);
   expect(p.validate([f])).toBe(false);expect(p.validate([basic])).toBe(false);expect(p.validate([special])).toBe(false);expect(p.validate(null)).toBe(false);
   return [];
  });g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));playTrainerCard(g.store,g.state,0,item);
 });
 it('keeps eligibility index-specific even for synthetic cross-category duplicate IDs',()=>{
  const g=game();const firstAqua=g.player1.deck.cards.find(c=>c.fullName===aqua)!,nonWater=g.player1.deck.cards.find(c=>c.fullName===fire)!;nonWater.id=firstAqua.id;
  g.overridePrompt('Choose cards',(p:any)=>{expect(p.validate([firstAqua])).toBe(true);expect(p.validate([nonWater])).toBe(false);return [first(p,aqua)];});
  g.overridePrompt('Show cards',()=>true);g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));playTrainerCard(g.store,g.state,0,item);
  expect(g.player1.hand.cards).toContain(firstAqua);expect(g.player1.deck.cards).toContain(nonWater);
 });
 it('rejects a selected disallowed card without completing the Item',()=>{
  const g=game(),before=[...g.player1.deck.cards];g.overridePrompt('Choose cards',(p:any)=>[first(p,fire)]);
  expect(()=>playTrainerCard(g.store,g.state,0,item)).toThrow();expect(g.player1.deck.cards).toEqual(before);expect(g.player1.hand.cards.some(c=>c.fullName===fire)).toBe(false);
 });
 it('rejects cancel without treating it as a completed search',()=>{
  const g=game(),before=[...g.player1.deck.cards];g.overridePrompt('Choose cards',()=>null);
  expect(()=>playTrainerCard(g.store,g.state,0,item)).toThrow();expect(g.player1.deck.cards).toEqual(before);
 });
 for(const deck of [[fire,'Charmander BS'],[aqua],[water],[aqua,water]])it('handles deck contents '+deck.join(' + ')+' without changing categories',()=>{
  const g=game(deck);let shuffled=false;g.overridePrompt('Choose cards',(p:any)=>p.cards.cards.map((_:Card,i:number)=>i).filter((i:number)=>!p.options.blocked.includes(i)));
  g.overridePrompt('Show cards',()=>true);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i)});playTrainerCard(g.store,g.state,0,item);
  expect(shuffled).toBe(true);for(const n of deck){const should=n===aqua||n===water;expect(g.player1.hand.cards.some(c=>c.fullName===n)).toBe(should)}
 });
 it('an Item lock stops the search and keeps the Item in hand',()=>{
  const g=game(),ball=g.player1.hand.cards[0],before=[...g.player1.deck.cards];g.player1.marker.addMarker(g.player1.ATTACK_EFFECT_ITEM_LOCK,g.player2.active.getPokemonCard()!);
  expect(()=>playTrainerCard(g.store,g.state,0,item)).toThrow();expect(g.store.state.players[0].hand.cards).toContain(ball);expect(g.store.state.players[0].deck.cards).toEqual(before);
 });
 it('a failed Trainer-play coin discards the Item without searching or shuffling',()=>{
  const g=game(),ball=g.player1.hand.cards[0],before=[...g.player1.deck.cards];g.player1.coinFlipCancelTrainerPlayTurnsRemaining=1;let choose=false,shuffle=false;
  const prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:any,p:any,cb:any)=>{for(const x of Array.isArray(p)?p:[p]){if(x instanceof ChooseCardsPrompt)choose=true;if(x instanceof ShuffleDeckPrompt)shuffle=true;}return prompt(s,p,cb)});
  spyOn(Math,'random').and.returnValue(0.9);playTrainerCard(g.store,g.state,0,item);expect(choose).toBe(false);expect(shuffle).toBe(false);expect(g.player1.discard.cards).toContain(ball);expect(g.player1.deck.cards).toEqual(before);
 });
 for(const chooseBoth of [false,true])it('resolves and restores the actual local simulator search, both='+chooseBoth,()=>{
  const g=game(chooseBoth?[aqua,water]:[fire,'Charmander BS']);const all:Card[]=[];
  for(const player of g.state.players)for(const list of [player.active,...player.bench,player.hand,player.deck,player.discard,player.lostzone,player.supporter,player.stadium,...player.prizes]){
   const cards=list instanceof PokemonCardList?[...list.cards,...list.energies.cards,...list.tools]:list.cards;for(const c of cards)if(!all.includes(c))all.push(c);
  }
  all.forEach((c,i)=>c.id=i);g.state.cardNames=all.map(c=>c.fullName);StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());
  const snapshot=new Base64().encode(new StateSerializer().serialize(g.state)),sim=new ClientSimulator();sim.loadSnapshot({stateData:snapshot});
  try {
   const p=sim.state.players[0];sim.dispatch(new PlayCardAction(p.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
   const prompt=sim.state.prompts.find(x=>x instanceof ChooseCardsPrompt&&x.result===undefined) as ChooseCardsPrompt;expect(prompt).toBeDefined();
   const checkpoint=new StateSerializer().deserialize(new Base64().decode(sim.getStateData()));
   const savedPrompt=checkpoint.prompts.find(x=>x instanceof ChooseCardsPrompt&&x.result===undefined) as ChooseCardsPrompt;
   expect(savedPrompt.playerId).toBe(checkpoint.players[0].id);expect(savedPrompt.options.isSecret).toBe(false);expect(savedPrompt.cards).not.toBe(checkpoint.players[0].deck);
   expect(savedPrompt.cards.cards.map(c=>c.id).sort((a,b)=>a-b)).toEqual(checkpoint.players[0].deck.cards.map(c=>c.id).sort((a,b)=>a-b));
   if(chooseBoth){expect(savedPrompt.validate([savedPrompt.cards.cards[first(savedPrompt,aqua)],savedPrompt.cards.cards[first(savedPrompt,water)]])).toBe(true);}
   else expect(savedPrompt.cards.cards.every((_,i)=>savedPrompt.options.blocked.includes(i))).toBe(true);
   const indices=chooseBoth?[first(prompt,aqua),first(prompt,water)]:[];sim.resolvePrompt(prompt.id,indices);
   expect(sim.state.prompts.length).toBe(0);expect(sim.state.players[0].hand.cards.some(c=>c.fullName===aqua)).toBe(chooseBoth);expect(sim.state.players[0].hand.cards.some(c=>c.fullName===water)).toBe(chooseBoth);
   expect(sim.state.players[0].discard.cards.some(c=>c.fullName===item)).toBe(true);expect(sim.state.players[0].deck.cards.length).toBe(chooseBoth?0:2);
   const after=sim.getStateData();sim.pushState(after);expect(sim.state.players[0].deck.cards.length).toBe(chooseBoth?0:2);expect(sim.state.players[0].discard.cards.some(c=>c.fullName===item)).toBe(true);
   sim.pushState(snapshot);expect(sim.state.players[0].hand.cards.some(c=>c.fullName===item)).toBe(true);
  } finally {sim.cleanup();}
 });
 it('honors an interceptor redirect without claiming a hand move',()=>{
  const g=game(),reduce=g.store.reduceEffect.bind(g.store);let shuffled=false;
  spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof MoveCardsEffect&&e.source===g.player1.deck&&e.destination===g.player1.hand)e.destination=g.player1.discard;return reduce(s,e)});
  g.overridePrompt('Choose cards',(p:any)=>[first(p,aqua)]);g.overridePrompt('Show cards',()=>true);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i)});
  playTrainerCard(g.store,g.state,0,item);expect(shuffled).toBe(true);expect(g.player1.discard.cards.some(c=>c.fullName===aqua)).toBe(true);expect(g.player1.hand.cards.some(c=>c.fullName===aqua)).toBe(false);expect(g.state.logs.some(log=>log.message===GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND)).toBe(false);
 });
 it('does not log a successful move when an interceptor prevents it',()=>{
  const g=game(),reduce=g.store.reduceEffect.bind(g.store);let revealed=false,shuffled=false;
  spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof MoveCardsEffect&&e.source===g.player1.deck&&e.destination===g.player1.hand)e.preventDefault=true;return reduce(s,e)});
  g.overridePrompt('Choose cards',(p:any)=>[first(p,aqua)]);g.overridePrompt('Show cards',()=>{revealed=true;return true});g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i)});
  playTrainerCard(g.store,g.state,0,item);expect(revealed).toBe(true);expect(shuffled).toBe(true);expect(g.player1.deck.cards.some(c=>c.fullName===aqua)).toBe(true);expect(g.player1.hand.cards.some(c=>c.fullName===aqua)).toBe(false);
  expect(g.state.logs.some(log=>log.message===GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND)).toBe(false);
 });
});
