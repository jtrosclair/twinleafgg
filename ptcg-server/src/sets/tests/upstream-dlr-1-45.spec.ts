import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { CardManager } from '../../game/cards/card-manager';
import { CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { setDeltaReign } from '../set-delta-reign';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttachEnergyPrompt, AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';

const printed: Array<[string,string,number]> = [["Heracross M6", "1", 130], ["Surskit M6", "2", 50], ["Masquerain M6", "3", 110], ["Cacnea M6", "4", 70], ["Cacturne M6", "5", 130], ["Combee M6", "6", 50], ["Vespiquen M6", "7", 120], ["Shaymin MEM", "8", 80], ["Virizion MEM", "9", 120], ["Wimpod M6", "10", 70], ["Mega Golisopod ex M6", "11", 340], ["Sprigatito MEM", "12", 70], ["Floragato MEM", "13", 90], ["Meowscarada ex MEM", "14", 320], ["Smoliv MEM", "15", 60], ["Dolliv MEM", "16", 90], ["Arboliva MEM", "17", 150], ["Growlithe M6", "18", 80], ["Arcanine M6", "19", 150], ["Magmar M6", "20", 90], ["Magmortar M6", "21", 140], ["Torkoal M6", "22", 130], ["Heat Rotom ex M6", "23", 190], ["Heatmor M6", "24", 110], ["Mantine M6", "25", 110], ["Kyogre M6", "26", 150], ["Frillish M6", "27", 80], ["Jellicent M6", "28", 120], ["Wishiwashi ex M6", "29", 260], ["Electabuzz M6", "30", 90], ["Electivire M6", "31", 140], ["Jolteon MEE", "32", 110], ["Raikou ex M6", "33", 200], ["Rotom MEE", "34", 80], ["Thundurus M6", "35", 120], ["Pincurchin M6", "36", 80], ["Pawmi MEE", "37", 60], ["Pawmo MEE", "38", 90], ["Pawmot MEE", "39", 150], ["Wattrel M6", "40", 60], ["Kilowattrel M6", "41", 120], ["Miraidon MEE", "42", 120], ["Drowzee M6", "43", 80], ["Hypno M6", "44", 120], ["Giratina M6", "45", 130]];
const grass = 'Grass Energy SVE', fire = 'Fire Energy SVE', water = 'Water Energy SVE', lightning = 'Lightning Energy SVE', psychic = 'Psychic Energy SVE';
function game(name: string, energy: string[], copied = false) {
  const g = setupGame({turn:2, player1:{active:{card:copied ? 'Mew ex 30C' : name, energy}, bench:copied ? [{card:name}] : [], deck:padDeck(12)}, player2:{active:{card:'Mew ex MEW'}, deck:padDeck(12)}});
  const target = g.player2.active.getPokemonCard()!; target.weakness = []; target.resistance = []; target.hp = 1000; return g;
}
function attack(g: ReturnType<typeof game>, name: string, copied = false) {
  if (copied) { g.overridePrompt('Choose attack', () => ({index:0, attack:name})); useAbility(g.store,g.state,0,'Memory Helix'); }
  else useAttack(g.store,g.state,0,name);
}
describe('Delta Reign 1-45', () => {
 beforeAll(() => { const manager = CardManager.getInstance(); if (!manager.isCardDefined('Heracross M6')) manager.defineSet(setDeltaReign); });
 beforeEach(() => spyOn(Math,'random').and.returnValue(0.1));
 for (const [name, number, hp] of printed) it('registers printed identity ' + name, () => { const card:any = getCardByName(name); expect(card.set).toBe('DLR'); expect(card.setNumber).toBe(number); expect(card.hp).toBe(hp); });
 for (const name of ['Mega Golisopod ex M6','Meowscarada ex MEM','Heat Rotom ex M6','Wishiwashi ex M6','Raikou ex M6']) it('ex tag remains visible for '+name,()=>expect(getCardByName(name).tags).toContain(CardTag.POKEMON_ex));
 for (const copied of [false,true]) {
  const label = copied ? 'copied ' : 'direct ';
  for (const [name, move, energy, damage] of [
    ['Surskit M6','Bug Bite',[grass],10],['Floragato MEM','Slash',[grass,grass],60],['Drowzee M6','Pound',[psychic],20],['Frillish M6','Hook',[water],10],
  ] as Array<[string,string,string[],number]>) it(label+name+' '+move,()=>{const g=game(name,energy,copied);attack(g,move,copied);expect(g.player2.active.damage).toBe(damage);});
  for(const heads of [false,true]) it(label+'Cacnea coin damage '+heads,()=>{(Math.random as jasmine.Spy).and.returnValue(heads?0.1:0.9);const g=game('Cacnea M6',[grass],copied);attack(g,'Knock Away',copied);expect(g.player2.active.damage).toBe(heads?20:10);});
  for(const damage of [0,10]) it(label+'Mega Golisopod Finishing Blow on '+damage+' damage',()=>{const g=game('Mega Golisopod ex M6',[grass],copied);g.player2.active.damage=damage;attack(g,'Finishing Blow',copied);expect(g.player2.active.damage).toBe(damage+(damage?220:60));});
  it(label+'Heracross Spike Draw draws two',()=>{const g=game('Heracross M6',[grass],copied);attack(g,'Spike Draw',copied);expect(g.player1.hand.cards.length).toBe(2);});
 }
 for (const copied of [false,true]) it((copied?'copied ':'direct ')+'Chaos Crawler records only a completed attack and blocks a different Giratina on the following turn',()=>{
   const g=game('Giratina M6',[psychic,psychic,water],copied), turn=g.state.turn;
   expect(g.player1.marker.markers.some(m=>m.name.startsWith('DLR_CHAOS_CRAWLER_TURN_'))).toBe(false);
   attack(g,'Chaos Crawler',copied);
   expect(g.player1.marker.hasMarker('DLR_CHAOS_CRAWLER_TURN_'+turn)).toBe(true);
   g.state.turn=turn+2;
   const later=getCardByName('Giratina M6') as PokemonCard;
   const attempt=new AttackEffect(g.player1,g.player2,later.attacks[0]);
   expect(()=>later.reduceEffect(g.store,g.state,attempt)).toThrow();
   g.state.turn=turn+4;
   expect(()=>later.reduceEffect(g.store,g.state,new AttackEffect(g.player1,g.player2,later.attacks[0]))).not.toThrow();
 });
 it('Chaos Crawler does not record an attempted attack before it resolves',()=>{
   const g=game('Giratina M6',[psychic,psychic,water]), turn=g.state.turn;
   const card=g.player1.active.getPokemonCard()!;
   card.reduceEffect(g.store,g.state,new AttackEffect(g.player1,g.player2,card.attacks[0]));
   expect(g.player1.marker.hasMarker('DLR_CHAOS_CRAWLER_TURN_'+turn)).toBe(false);
   card.reduceEffect(g.store,g.state,new AfterAttackEffect(g.player1,g.player2,card.attacks[0]));
   expect(g.player1.marker.hasMarker('DLR_CHAOS_CRAWLER_TURN_'+turn)).toBe(true);
 });

 for (const copied of [false,true]) it((copied?'copied ':'direct ')+'Raikou Thunder-Clad can attach Special Energy',()=>{
   const g=game('Raikou ex M6',[lightning],copied);
   const energy=getCardByName('Double Turbo Energy BRS'); energy.id=9321; g.player1.deck.cards.unshift(energy);
   g.overridePrompt(AttachEnergyPromptType, prompt=>{
     const p=prompt as AttachEnergyPrompt;
     expect(p.filter.superType).toBe(energy.superType);
     expect(p.validate([{card:energy,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}}])).toBe(true);
     return [{index:p.cardList.cards.indexOf(energy),to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}}];
   });
   attack(g,'Thunder-Clad',copied);
   expect(g.player1.active.cards).toContain(energy);
   expect(g.player1.deck.cards).not.toContain(energy);
 });
 it('an attack blocked by sleep does not record Chaos Crawler',()=>{
   const g=game('Giratina M6',[psychic,psychic,water]),turn=g.state.turn;
   g.player1.active.specialConditions.push(SpecialCondition.ASLEEP);
   expect(()=>attack(g,'Chaos Crawler')).toThrow();
   expect(g.player1.marker.hasMarker('DLR_CHAOS_CRAWLER_TURN_'+turn)).toBe(false);
 });

 for(const copied of [false,true]) it((copied?'copied ':'direct ')+'Bug Out counts matching Pokémon, shuffles Pokémon back and discards non-Pokémon',()=>{
   const g=game('Combee M6',[grass,grass,grass],copied);
   const names=['Combee M6','Masquerain M6','Squirtle BS',water,water,water,water];
   const revealed=names.map((name,i)=>{const card=getCardByName(name);card.id=9600+i;return card;});
   g.player1.deck.cards.push(...revealed);
   attack(g,'Bug Out',copied);
   expect(g.player2.active.damage).toBe(100);
   for(const card of revealed.slice(0,3)) expect(g.player1.deck.cards).toContain(card);
   for(const card of revealed.slice(3)) expect(g.player1.discard.cards).toContain(card);
 });

});
