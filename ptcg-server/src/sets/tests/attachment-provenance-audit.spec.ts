import { CardManager } from '../../game/cards/card-manager';
import { Azurill } from '../set-delta-reign/azurill';
import { padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
import { AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';

beforeAll(() => { const card = new Azurill(); const manager = CardManager.getInstance(); if (!manager.isCardDefined(card.fullName)) manager.defineSet([card]); });

for (const [pokemon, energy] of [['Zapdos AQ', 'Lightning Energy SVE'], ['Moltres SK', 'Fire Energy SVE']]) {
  for (const copied of [false, true]) {
    it(`Azurill ${copied ? 'copied ' : ''}can attach ${energy} from deck to ${pokemon}`, () => {
      const game = setupGame({turn: 3, player1: {
        active: {card: copied ? 'Mew ex 30C' : 'Azurill M6'},
        bench: copied ? [{card:'Azurill M6'}, {card:pokemon}] : [{card:pokemon}],
        deck: [energy, ...padDeck(9)]
      }, player2: {active:{card:'Mew ex MEW'}, deck:padDeck(10)}});
      const target = game.player1.bench[copied ? 1 : 0];
      const card = game.player1.deck.cards[0];
      game.overridePrompt(AttachEnergyPromptType, () => [{index:0,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:copied?1:0}}]);
      game.overridePrompt('Shuffle deck', () => game.player1.deck.cards.map((_, i) => i));
      if (copied) {
        game.overridePrompt('Choose attack', () => ({index:0,attack:'Bouncy-Bounce Charge'}));
        useAbility(game.store, game.state, 0, 'Memory Helix');
      } else useAttack(game.store, game.state, 0, 'Bouncy-Bounce Charge');
      expect(target.cards).toContain(card);
      expect(target.energies.cards).toContain(card);
    });
  }
}

import { EnergyCard } from '../../game/store/card/energy-card';
import { PlayCardAction } from '../../game/store/actions/play-card-action';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { Gliscor } from '../set-phantom-forces/gliscor';
import { Araquanid } from '../set-burning-shadows/araquanid';
import { GengarMimikyuGX } from '../set-team-up/gengar-and-mimikyu-gx';
import { AlolanGolemGx } from '../set-crimson-invasion/alolan-golem-gx';
import { Duskull } from '../set-stormfront/duskull';
import { Zapdos } from '../set-aquapolis/zapdos';
import { Moltres } from '../set-skyridge/moltres';
import { PokemonCard } from '../../game/store/card/pokemon-card';

type Case = {name:string, energy:string, target:string, active?:boolean, blocker?:PokemonCard, mark?:(g:ReturnType<typeof setupGame>, c:any)=>void};
const cases:Case[] = [
 {name:'Zapdos AQ',energy:'Lightning Energy SVE',target:'Zapdos AQ'},
 {name:'Moltres SK',energy:'Fire Energy SVE',target:'Moltres SK'},
 {name:'Gliscor PHF',energy:'Fire Energy SVE',target:'Charmander BS',blocker:new Gliscor(),mark:(g,c)=>g.player1.bench[0].marker.addMarker(c.BLOCK_ATTACH_MARKER,c)},
 {name:'Araquanid BUS',energy:'Fire Energy SVE',target:'Charmander BS',blocker:new Araquanid(),mark:(g,c)=>g.player1.bench[0].marker.addMarker(c.BLOCK_ATTACH_MARKER,c)},
 {name:'Gengar & Mimikyu-GX TEU',energy:'Fire Energy SVE',target:'Charmander BS',blocker:new GengarMimikyuGX(),mark:(g,c)=>g.player1.marker.addMarker(c.CANNOT_PLAY_CARDS_FROM_HAND_MARKER,c)},
 {name:'Alolan Golem-GX CIN',energy:'Fire Energy SVE',target:'Charmander BS',blocker:new AlolanGolemGx(),mark:(g,c)=>g.player1.marker.addMarker(c.BLOCK_CARDS_MARKER,c)},
 {name:'Duskull SF',energy:'Fire Energy SVE',target:'Charmander BS',active:true,blocker:new Duskull(),mark:(g,c)=>g.player1.marker.addMarker(c.NIGHT_BIND_MARKER,c)}
];
for (const c of cases) {
 for (const zone of ['deck', 'discard'] as const) {
  it(`${c.name} allows an explicitly marked ${zone} attachment`,()=>{
   const g=setupGame({turn:3,player1:{active:{card:c.active?c.target:'Mew ex MEW'},bench:c.active?[]:[{card:c.target}],deck:zone==='deck'?[c.energy,...padDeck(9)]:padDeck(10),discard:zone==='discard'?[c.energy]:[]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
   if(c.blocker){g.player2.discard.cards.push(c.blocker);c.mark!(g,c.blocker);}
   const source=g.player1[zone];const target=c.active?g.player1.active:g.player1.bench[0];const card=source.cards[0] as EnergyCard;
   source.moveCardTo(card,target);g.store.reduceEffect(g.state,new AttachEnergyEffect(g.player1,card,target,zone));
   expect(target.cards).toContain(card);expect(target.energies.cards).toContain(card);
  });
 }
 it(`${c.name} continues to block a manual attachment from hand`,()=>{
  const g=setupGame({turn:3,player1:{active:{card:c.active?c.target:'Mew ex MEW'},bench:c.active?[]:[{card:c.target}],hand:[c.energy],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  if(c.blocker){g.player2.discard.cards.push(c.blocker);c.mark!(g,c.blocker);}
  expect(()=>g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:c.active?SlotType.ACTIVE:SlotType.BENCH,index:0}))).toThrow();
 });
}

import { StateSerializer } from '../../game/serializer/state-serializer';
for (const c of cases.slice(2,6)) for (const copied of [false,true]) {
 it(`Azurill ${copied?'copied ':''}attaches through ${c.name}'s hand-only restriction`,()=>{
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':'Azurill M6'},bench:copied?[{card:c.target},{card:'Azurill M6'}]:[{card:c.target}],deck:[c.energy,...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.player2.discard.cards.push(c.blocker!);c.mark!(g,c.blocker!);const energy=g.player1.deck.cards[0];
  g.overridePrompt(AttachEnergyPromptType,()=>[{index:0,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}]);
  g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));
  if(copied){g.overridePrompt('Choose attack',()=>({index:1,attack:'Bouncy-Bounce Charge'}));useAbility(g.store,g.state,0,'Memory Helix');}
  else useAttack(g.store,g.state,0,'Bouncy-Bounce Charge');
  expect(g.player1.bench[0].cards).toContain(energy);expect(g.player1.bench[0].energies.cards).toContain(energy);
 });
}
it('snapshot round trip preserves a successful Azurill attachment',()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Azurill M6'},bench:[{card:'Zapdos AQ'}],deck:['Lightning Energy SVE',...padDeck(9)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 g.overridePrompt(AttachEnergyPromptType,()=>[{index:0,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}]);g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));
 useAttack(g.store,g.state,0,'Bouncy-Bounce Charge');
 const cards = g.state.players.flatMap(p => [p.active, ...p.bench, ...p.prizes, p.hand, p.deck, p.discard, p.lostzone, p.stadium, p.supporter].flatMap(list => list.cards));
 cards.forEach((card,i)=>card.id=i);g.state.cardNames=cards.map(card=>card.fullName);
 StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());
 const serializer=new StateSerializer();const restored=serializer.deserialize(serializer.serialize(g.state));
 expect(restored.players[0].bench[0].cards.some(c=>c.fullName==='Lightning Energy SVE')).toBe(true);
 expect(restored.players[0].bench[0].energies.cards.some(c=>c.fullName==='Lightning Energy SVE')).toBe(true);
});
