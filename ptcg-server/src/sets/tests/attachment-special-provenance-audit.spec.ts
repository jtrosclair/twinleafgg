import { padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
import { CardManager } from '../../game/cards/card-manager';
import { Azurill } from '../set-delta-reign/azurill';
import { AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';

beforeAll(() => {const card=new Azurill(),m=CardManager.getInstance();if(!m.isCardDefined(card.fullName))m.defineSet([card]);});
type Case={name:string,source:string,marker?:string,ace?:boolean,tool?:boolean,generic?:boolean};
const cases:Case[]=[
 {name:'Noivern ex PAL',source:'Noivern ex PAL',marker:'DOMINATING_ECHO_MARKER'},
 {name:'Azelf MT',source:'Azelf MT',marker:'BIND_PULSE_MARKER'},
 {name:'Whimsicott VSTAR BRS',source:'Whimsicott VSTAR BRS',marker:'DOMINATING_ECHO_MARKER'},
 {name:'Noivern-GX BUS',source:'Noivern-GX BUS',marker:'OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER'},
 {name:'Shadow Rider Calyrex V CRE',source:'Shadow Rider Calyrex V CRE',marker:'SHADOW_MIST_MARKER'},
 {name:'Honchkrow-GX UNB',source:'Honchkrow-GX UNB'},
 {name:'Spiritomb LTR',source:'Spiritomb LTR',ace:true},
 {name:'Genesect SFA',source:'Genesect SFA',ace:true,tool:true},
 {name:'generic attack lock',source:'Mew ex MEW',generic:true}
];
function make(c:Case,mode:'deck'|'discard'|'hand',copied=false){
 const energy=c.ace?'Legacy Energy TWM':'Double Turbo Energy BRS';
 const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':'Azurill M6'},bench:copied?[{card:'Charmander BS'},{card:'Azurill M6'}]:[{card:'Charmander BS'}],deck:mode==='deck'?[energy,...padDeck(9)]:padDeck(10),discard:mode==='discard'?[energy]:[],hand:mode==='hand'?[energy]:[]},player2:{active:{card:c.source,tools:c.tool?['Air Balloon SSH']:[]},deck:padDeck(10)}});
 const blocker=g.player2.active.getPokemonCard() as any;
 if(c.marker)g.player1.marker.addMarker(blocker[c.marker],blocker);
 if(c.generic)g.player1.marker.addMarker(g.player1.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK,blocker);
 return g;
}
for(const c of cases){
 for(const zone of ['deck','discard'] as const)it(`${c.name} permits explicit ${zone} attachment`,()=>{
  const g=make(c,zone);const source=g.player1[zone],target=g.player1.bench[0],card=source.cards[0] as EnergyCard;source.moveCardTo(card,target);
  g.store.reduceEffect(g.state,new AttachEnergyEffect(g.player1,card,target,zone));expect(target.cards).toContain(card);expect(target.energies.cards).toContain(card);
 });
 it(`${c.name} still blocks a Special Energy played manually from hand`,()=>{
  const g=make(c,'hand');expect(()=>g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}))).toThrow();
 });
 for(const copied of [false,true])it(`Azurill ${copied?'copied ':''}attaches from deck under ${c.name}`,()=>{
  const g=make(c,'deck',copied),card=g.player1.deck.cards[0];g.overridePrompt(AttachEnergyPromptType,()=>[{index:0,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}]);g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));
  if(copied){g.overridePrompt('Choose attack',()=>({index:1,attack:'Bouncy-Bounce Charge'}));useAbility(g.store,g.state,0,'Memory Helix');}else useAttack(g.store,g.state,0,'Bouncy-Bounce Charge');
  expect(g.player1.bench[0].cards).toContain(card);expect(g.player1.bench[0].energies.cards).toContain(card);
 });
}
for(const energy of ['Triple Acceleration Energy UNB','Team Rocket\'s Energy DRI'])it(`${energy} keeps its own attachment restriction for explicit deck origin`,()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Azurill M6'},bench:[{card:'Charmander BS'}],deck:[energy,...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 const card=g.player1.deck.cards[0] as EnergyCard,target=g.player1.bench[0];g.player1.deck.moveCardTo(card,target);
 expect(()=>g.store.reduceEffect(g.state,new AttachEnergyEffect(g.player1,card,target,'deck'))).toThrow();
});
it('a normal manual Special Energy attachment succeeds without a hand-only lock',()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Azurill M6'},bench:[{card:'Charmander BS'}],hand:['Double Turbo Energy BRS'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 const card=g.player1.hand.cards[0];g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}));expect(g.player1.bench[0].cards).toContain(card);
});
