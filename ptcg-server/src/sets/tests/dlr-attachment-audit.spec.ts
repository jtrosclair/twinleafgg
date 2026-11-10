import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
import { CardManager } from '../../game/cards/card-manager';
import { AttachEnergyPrompt, AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { AttackEffect, MoveCardsEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CardType } from '../../game/store/card/card-types';
import { Steelix } from '../set-delta-reign/steelix';
import { Sableye } from '../set-delta-reign/sableye';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { State } from '../../game/store/state/state';
import { Delibird } from '../set-delta-reign/delibird';
import { KommoO } from '../set-delta-reign/kommo-o';
import { Azurill } from '../set-delta-reign/azurill';

const cards = [new Delibird(), new KommoO(), new Azurill(), new Steelix(), new Sableye()];
const delibird=cards[0].fullName,kommo=cards[1].fullName,azurill=cards[2].fullName;
const bench={player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0};
const active={player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0};
function register(){const cm=CardManager.getInstance();for(const c of cards)if(!cm.isCardDefined(c.fullName))cm.defineSet([c]);}
describe('Delta Reign attachment and subset shuffle audit',()=>{
 beforeAll(register);
 it('Delibird must choose an Energy, then shuffles only looked-at leftovers to the deck bottom',()=>{
  const g=setupGame({turn:3,player1:{active:{card:delibird},deck:['Fire Energy SVE','Ralts SIT','Water Energy SVE','Charmander BS','Psychic Energy SVE','Mew ex MEW','Lightning Energy SVE','Fighting Energy SVE']},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  const before=g.player1.deck.cards.slice();let shuffleCount=-1;
  g.overridePrompt(ChooseCardsPromptType,p=>{const q=p as ChooseCardsPrompt;expect(q.options.min).toBe(1);expect(q.options.max).toBe(1);return [0];});
  g.overridePrompt('Shuffle deck',p=>{shuffleCount=(p as ShuffleDeckPrompt).count!;return [4,3,2,1,0];});
  useAbility(g.store,g.state,0,'Energizing Present');
  expect(shuffleCount).toBe(5);expect(g.player1.hand.cards).toContain(before[0]);
  expect(g.player1.deck.cards).toEqual([before[6],before[7],before[5],before[4],before[3],before[2],before[1]]);
 });
 it('Delibird with no Energy preserves the untouched deck prefix and shuffles its looked-at cards',()=>{
  const g=setupGame({turn:3,player1:{active:{card:delibird},deck:['Ralts SIT','Charmander BS','Mew ex MEW','Ralts SIT','Charmander BS','Mew ex MEW','Water Energy SVE']},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const before=g.player1.deck.cards.slice();
  g.overridePrompt('Shuffle deck',()=>[5,4,3,2,1,0]);useAbility(g.store,g.state,0,'Energizing Present');
  expect(g.player1.deck.cards).toEqual([before[6],before[5],before[4],before[3],before[2],before[1],before[0]]);expect(g.player1.hand.cards.length).toBe(0);
 });
 for(const copied of [false,true]) it((copied?'copied ':'direct ')+'Azurill attaches Special Energy and sends its notification after shuffle',()=>{
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':azurill},bench:[{card:copied?azurill:'Charmander BS'}],deck:['Double Turbo Energy BRS',...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const energy=g.player1.deck.cards[0],events:string[]=[];const reduce=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof AttachEnergyEffect)events.push('attach');return reduce(state,e);});
  g.overridePrompt(AttachEnergyPromptType,()=>[{index:0,to:bench}]);g.overridePrompt('Shuffle deck',()=>{events.push('shuffle');return g.player1.deck.cards.map((_,i)=>i);});
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Bouncy-Bounce Charge'}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,'Bouncy-Bounce Charge');
  expect(g.player1.bench[0].cards).toContain(energy);expect(g.player1.bench[0].energies.cards).toContain(energy);expect(events).toEqual(['shuffle','attach']);
 });
 it('Azurill does not notify an attachment blocked by an intervening effect',()=>{
  const g=setupGame({turn:3,player1:{active:{card:azurill},bench:[{card:'Charmander BS'}],deck:['Fire Energy SVE',...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const card=g.player1.deck.cards[0];let notified=0;const reduce=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof MoveCardsEffect&&e.destination===g.player1.bench[0]){e.preventDefault=true;return state;}if(e instanceof AttachEnergyEffect)notified++;return reduce(state,e);});g.overridePrompt(AttachEnergyPromptType,()=>[{index:0,to:bench}]);useAttack(g.store,g.state,0,'Bouncy-Bounce Charge');expect(notified).toBe(0);expect(g.player1.deck.cards).toContain(card);
 });
 it('Kommo-o attaches only chosen Basic Energy to a Dragon and notifies after shuffling',()=>{
  const g=setupGame({turn:3,player1:{active:{card:kommo},bench:[{card:'Charmander BS'}],deck:['Fire Energy SVE','Water Energy SVE','Double Turbo Energy BRS','Ralts SIT',...padDeck(5)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const fire=g.player1.deck.cards[0],water=g.player1.deck.cards[1],special=g.player1.deck.cards[2],events:string[]=[];const reduce=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof AttachEnergyEffect)events.push('attach');return reduce(state,e);});
  g.overridePrompt(AttachEnergyPromptType,p=>{const q=p as AttachEnergyPrompt;expect(q.options.min).toBe(0);expect(q.options.max).toBe(4);expect(q.options.blocked).toContain(q.cardList.cards.indexOf(special));expect(q.options.blockedTo).toContain(bench);return [{index:q.cardList.cards.indexOf(fire),to:active}];});
  g.overridePrompt('Shuffle deck',()=>{events.push('shuffle');return g.player1.deck.cards.map((_,i)=>i);});useAbility(g.store,g.state,0,'Beat Scales');
  expect(g.player1.active.cards).toContain(fire);expect(g.player1.deck.cards).toContain(water);expect(g.player1.deck.cards).toContain(special);expect(events).toEqual(['shuffle','attach']);
 });
 it('Kommo-o can choose to attach nothing and still shuffle',()=>{
  const g=setupGame({turn:3,player1:{active:{card:kommo},deck:['Fire Energy SVE',...padDeck(8)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const card=g.player1.deck.cards[0];let shuffled=false;
  g.overridePrompt(AttachEnergyPromptType,()=>[]);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i);});useAbility(g.store,g.state,0,'Beat Scales');expect(g.player1.deck.cards).toContain(card);expect(shuffled).toBe(true);
 });
 it('Steelix reduces opposing damage after Weakness while at full HP',()=>{
  const g=setupGame({turn:3,player1:{active:{card:new Steelix().fullName},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const source=g.player2.active.getPokemonCard()!;source.cardType=CardType.GRASS;const attack=new AttackEffect(g.player2,g.player1,source.attacks[0]);g.store.reduceEffect(g.state,new DealDamageEffect(attack,100));expect(g.player1.active.damage).toBe(140);
 });
 it('Steelix does not reduce own attack damage or damage when already damaged',()=>{
  const g=setupGame({turn:3,player1:{active:{card:new Steelix().fullName},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const self=g.player1.active.getPokemonCard()!;const attack=new AttackEffect(g.player1,g.player2,self.attacks[0]);const recoil=new DealDamageEffect(attack,100);recoil.target=g.player1.active;g.store.reduceEffect(g.state,recoil);expect(g.player1.active.damage).toBe(100);
  g.player1.active.damage=10;const enemy=g.player2.active.getPokemonCard()!;enemy.cardType=CardType.GRASS;g.store.reduceEffect(g.state,new DealDamageEffect(new AttackEffect(g.player2,g.player1,enemy.attacks[0]),100));expect(g.player1.active.damage).toBe(210);
 });
 for(const copied of [false,true]) it((copied?'copied ':'direct ')+'Steelix Tough Swing ignores Resistance',()=>{
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':new Steelix().fullName,energy:['Fighting Energy SVE','Fighting Energy SVE','Water Energy SVE','Water Energy SVE']},bench:copied?[{card:new Steelix().fullName}]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[{type:copied?CardType.PSYCHIC:CardType.FIGHTING,value:-30}];
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Tough Swing'}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,'Tough Swing');expect(g.player2.active.damage).toBe(150);
 });

 for(const copied of [false,true]) it((copied?'copied ':'direct ')+'Sableye Lure Out reveals the same top five cards to both players',()=>{
  const name=new Sableye().fullName;
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':name,energy:['Darkness Energy SVE']},bench:copied?[{card:name}]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:['Charmander BS','Ralts SIT','Mew ex MEW','Water Energy SVE','Fighting Energy SVE',...padDeck(5)]}});
  const top=g.player2.deck.cards.slice(0,5), reveals:Array<{player:number,cards:unknown[]}>=[];const prompt=g.store.prompt.bind(g.store);
  spyOn(g.store,'prompt').and.callFake((state:any,p:any,callback:any)=>{if(p instanceof ShowCardsPrompt)reveals.push({player:p.playerId,cards:p.cards.slice()});return prompt(state,p,callback);});
  g.overridePrompt('Choose cards',()=>[]);if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Lure Out'}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,'Lure Out');
  expect(reveals.filter(r=>r.player===g.player1.id).some(r=>r.cards.length===5&&r.cards.every((card,i)=>card===top[i]))).toBe(true);
  expect(reveals.filter(r=>r.player===g.player2.id).some(r=>r.cards.length===5&&r.cards.every((card,i)=>card===top[i]))).toBe(true);
 });

 it('Azurill still shuffles when no Bench target exists and does not notify an attachment',()=>{
  const g=setupGame({turn:3,player1:{active:{card:azurill},deck:['Fire Energy SVE',...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const card=g.player1.deck.cards[0],events:string[]=[];const reduce=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof AttachEnergyEffect)events.push('attach');return reduce(state,e);});
  g.overridePrompt(AttachEnergyPromptType,()=>[]);g.overridePrompt('Shuffle deck',()=>{events.push('shuffle');return g.player1.deck.cards.map((_,i)=>i);});useAttack(g.store,g.state,0,'Bouncy-Bounce Charge');expect(g.player1.deck.cards).toContain(card);expect(events).toEqual(['shuffle']);
 });
 it('Kommo-o does not notify an attachment prevented while moving the card',()=>{
  const g=setupGame({turn:3,player1:{active:{card:kommo},deck:['Fire Energy SVE',...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const card=g.player1.deck.cards[0];let notified=0;const reduce=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof MoveCardsEffect&&e.destination===g.player1.active){e.preventDefault=true;return state;}if(e instanceof AttachEnergyEffect)notified++;return reduce(state,e);});
  g.overridePrompt(AttachEnergyPromptType,p=>[{index:(p as AttachEnergyPrompt).cardList.cards.indexOf(card),to:active}]);useAbility(g.store,g.state,0,'Beat Scales');expect(notified).toBe(0);expect(g.player1.deck.cards).toContain(card);
 });

});
