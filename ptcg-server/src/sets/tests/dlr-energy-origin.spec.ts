import { CardManager } from '../../game/cards/card-manager';
import { PlayerType, SlotType, PlayCardAction } from '../../game/store/actions/play-card-action';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt, AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Gliscor } from '../set-phantom-forces/gliscor';
import { Araquanid } from '../set-burning-shadows/araquanid';
import { GengarMimikyuGX } from '../set-team-up/gengar-and-mimikyu-gx';
import { AlolanGolemGx } from '../set-crimson-invasion/alolan-golem-gx';
import { setDeltaReign } from '../set-delta-reign';
import { padDeck, setupGame } from './test-helpers';
import { useAbility } from './card-test-helpers';

type Game=ReturnType<typeof setupGame>;
type Lock={name:string; make:()=>PokemonCard; mark:(g:Game,c:any,target:Game['player1']['active'])=>void};
const locks:Lock[]=[
 {name:'Gliscor PHF',make:()=>new Gliscor(),mark:(_g,c,t)=>t.marker.addMarker(c.BLOCK_ATTACH_MARKER,c)},
 {name:'Araquanid BUS',make:()=>new Araquanid(),mark:(_g,c,t)=>t.marker.addMarker(c.BLOCK_ATTACH_MARKER,c)},
 {name:'Gengar & Mimikyu-GX TEU',make:()=>new GengarMimikyuGX(),mark:(g,c)=>g.player1.marker.addMarker(c.CANNOT_PLAY_CARDS_FROM_HAND_MARKER,c)},
 {name:'Alolan Golem-GX CIN',make:()=>new AlolanGolemGx(),mark:(g,c)=>g.player1.marker.addMarker(c.BLOCK_CARDS_MARKER,c)}
];
beforeAll(()=>{const cm=CardManager.getInstance();if(!cm.isCardDefined('Kommo-o M6'))cm.defineSet(setDeltaReign);});
for(const lock of locks) for(const targetBench of [false,true]) {
 it(`Kommo-o can attach from deck to ${targetBench?'Benched':'Active'} Dragon through ${lock.name}'s hand-only lock`,()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Kommo-o M6'},bench:[{card:'Kommo-o M6'}],
    deck:['Fire Energy SVE','Water Energy SVE','Ralts SIT',...padDeck(7)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  const c=lock.make(),target=targetBench?g.player1.bench[0]:g.player1.active,fire=g.player1.deck.cards[0];
  g.player2.discard.cards.push(c);lock.mark(g,c,target);
  let shuffled=false;const origins:Array<string|undefined>=[],reduce=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof AttachEnergyEffect)origins.push(e.sourceZone);return reduce(state,e);});
  g.overridePrompt(AttachEnergyPromptType,p=>[{index:(p as AttachEnergyPrompt).cardList.cards.indexOf(fire),
    to:{player:PlayerType.BOTTOM_PLAYER,slot:targetBench?SlotType.BENCH:SlotType.ACTIVE,index:0}}]);
  g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i);});
  useAbility(g.store,g.state,0,'Beat Scales');
  expect(shuffled).toBe(true);expect(target.cards).toContain(fire);expect(target.energies.cards).toContain(fire);expect(origins).toEqual(['deck']);
 });
}
it('Ruler’s Roar reports the real deck origin of its attachment after the shuffle',()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:['Mega Rayquaza ex DLR'],deck:['Fire Energy SVE','Water Energy SVE','Lightning Energy SVE','Ralts SIT','Psychic Energy SVE']},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 let origin:string|undefined;let observedAfterShuffle=false,shuffled=false;const reduce=g.store.reduceEffect.bind(g.store);
 spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof AttachEnergyEffect){origin=e.sourceZone;observedAfterShuffle=shuffled;}return reduce(state,e);});
 g.overridePrompt('Confirm',()=>true);g.overridePrompt('Choose cards',()=>[0]);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return [0,1,2];});
 g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}));
 expect(g.player1.bench[0].cards.some(c=>c.fullName==='Fire Energy SVE')).toBe(true);expect(origin).toBe('deck');expect(observedAfterShuffle).toBe(true);
});

for(const locked of [false,true]) it(`Pawmot attaches Lightning Energy from discard ${locked?'through a hand-only lock':'without locks'}`,()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Pawmot MEE'},discard:['Lightning Energy SVE'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 const energy=g.player1.discard.cards[0];if(locked){const c=new Gliscor();g.player2.discard.cards.push(c);g.player1.active.marker.addMarker(c.BLOCK_ATTACH_MARKER,c);}
 g.overridePrompt(AttachEnergyPromptType,()=>[{index:0,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}}]);
 useAbility(g.store,g.state,0,"Generator's Touch");
 expect(g.player1.discard.cards).not.toContain(energy);expect(g.player1.active.cards).toContain(energy);expect(g.player1.active.energies.cards).toContain(energy);
});
for(const locked of [false,true]) it(`Darkrai attaches up to two Basic Darkness Energy from deck ${locked?'through a hand-only lock':'without locks'}`,()=>{
 const g=setupGame({turn:3,player1:{active:{card:'Darkrai MEZ',energy:['Darkness Energy SVE']},deck:['Darkness Energy SVE','Darkness Energy SVE',...padDeck(8)]},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
 const energies=g.player1.deck.cards.slice(0,2);if(locked){const c=new Gliscor();g.player2.discard.cards.push(c);g.player1.active.marker.addMarker(c.BLOCK_ATTACH_MARKER,c);}
 g.overridePrompt(AttachEnergyPromptType,()=>[0,1].map(index=>({index,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}})));
 g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));
 const {useAttack}=require('./card-test-helpers') as typeof import('./card-test-helpers');useAttack(g.store,g.state,0,'Shadow-Clad');
 for(const energy of energies){expect(g.player1.deck.cards).not.toContain(energy);expect(g.player1.active.cards).toContain(energy);expect(g.player1.active.energies.cards).toContain(energy);}
});

for(const mode of ['Memory Helix','Genome Hacking']) it(`Darkrai's ${mode} copied Shadow-Clad attaches to the attacker`,()=>{
 const copied=mode==='Memory Helix';const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':'Mew ex MEW',energy:['Darkness Energy SVE','Psychic Energy SVE','Psychic Energy SVE']},
  bench:copied?[{card:'Darkrai MEZ'}]:[],deck:['Darkness Energy SVE','Darkness Energy SVE',...padDeck(8)]},
  player2:{active:{card:copied?'Mew ex MEW':'Darkrai MEZ'},deck:padDeck(10)}});
 const energies=g.player1.deck.cards.slice(0,2);
 g.overridePrompt(AttachEnergyPromptType,()=>[0,1].map(index=>({index,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}})));
 g.overridePrompt('Shuffle deck',()=>g.player1.deck.cards.map((_,i)=>i));
 g.overridePrompt('Choose attack',()=>({index:0,attack:'Shadow-Clad'}));
 const {useAttack}=require('./card-test-helpers') as typeof import('./card-test-helpers');
 if(copied)useAbility(g.store,g.state,0,'Memory Helix');else useAttack(g.store,g.state,0,'Genome Hacking');
 for(const energy of energies){expect(g.player1.deck.cards).not.toContain(energy);expect(g.player1.active.cards).toContain(energy);expect(g.player1.active.energies.cards).toContain(energy);}
});
