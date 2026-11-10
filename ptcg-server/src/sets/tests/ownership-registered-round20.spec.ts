import { CardTag } from '../../game/store/card/card-types';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GamePhase } from '../../game/store/state/state';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { getCardByName,padDeck,setupGame } from './test-helpers';
import { useAbility,useAttack } from './card-test-helpers';

type Entry={name:string;attack:string;energy:string[];damage:number};
const entries:Entry[]=[
 {name:"Erika's Dratini G1",attack:'Tail Strike',energy:['Fire Energy SVE','Fire Energy SVE'],damage:30},
 {name:'Ninetales HL',attack:'Quick Attack',energy:['Fire Energy SVE','Fire Energy SVE'],damage:40},
 {name:'Froslass ex PAR',attack:'Frost Bullet',energy:['Water Energy SVE','Water Energy SVE'],damage:140},
 {name:'Mimikyu PAL',attack:'Ghost Eye',energy:['Psychic Energy SVE','Psychic Energy SVE'],damage:70},
 {name:'Durant ex SSP',attack:'Vengeful Crush',energy:['Grass Energy SVE','Grass Energy SVE','Grass Energy SVE'],damage:120},
 {name:'Rabsca TEF',attack:'Psychic',energy:['Grass Energy SVE'],damage:10},
 {name:'Armarouge ex PAR',attack:'Scorching Bazooka',energy:['Fire Energy SVE','Fire Energy SVE'],damage:120},
 {name:'Feraligatr TEF',attack:'Giant Wave',energy:['Water Energy SVE','Water Energy SVE'],damage:160}
];
function game(entry:Entry,active='Mew TM',opponent='Squirtle BS') {
 const g=setupGame({turn:3,player1:{active:{card:active,energy:entry.energy},bench:[{card:'Charmander BS'}],deck:padDeck(10)},player2:{active:{card:opponent},deck:padDeck(10)}});
 g.player1.active.getPokemonCard()!.hp=1000; const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];return g;
}
function copied(entry:Entry,opponent='Squirtle BS') {
 const g=game(entry,'Mew TM',opponent);g.player1.lostzone.cards.push(getCardByName(entry.name));
 g.overridePrompt('Choose attack',()=>({index:0,attack:entry.attack}));useAbility(g.store,g.state,0,'Lost Link');return g;
}
function incoming(g:ReturnType<typeof game>,amount=100) {
 g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
 const hit=new AttackEffect(g.player2,g.player1,{name:'Hit',cost:[],damage:amount,text:''});const effect=new PutDamageEffect(hit,amount);g.store.reduceEffect(g.state,effect);return effect;
}
describe('registered copied-attack ownership round 20',()=>{
 beforeEach(()=>{clearCopyAttackSessionsForTests();spyOn(Math,'random').and.returnValue(0.1);});
 for(const entry of entries) {
  it('copies '+entry.name+' attack',()=>{const g=copied(entry);expect(g.player2.active.damage).toBe(entry.damage);});
  it('retains '+entry.name+' real attack',()=>{const g=game(entry,entry.name);useAttack(g.store,g.state,0,entry.attack);expect(g.player2.active.damage).toBe(entry.damage);});
 }
 for(const isCopy of [false,true]) it('Froslass Frost Bullet damages the chosen Bench Pokémon, copied '+isCopy,()=>{
  const entry=entries[2],g=game(entry,isCopy?'Mew TM':entry.name);g.player2.bench[0].cards.push(getCardByName('Charmander BS'));
  g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);
  if(isCopy){g.player1.lostzone.cards.push(getCardByName(entry.name));g.overridePrompt('Choose attack',()=>({index:0,attack:entry.attack}));useAbility(g.store,g.state,0,'Lost Link');}
  else useAttack(g.store,g.state,0,entry.attack);
  expect(g.player2.active.damage).toBe(140);expect(g.player2.bench[0].damage).toBe(20);
 });
 it('does not give Mew the copied Strange Barrier',()=>{const g=copied(entries[0]);incoming(g);expect(g.player1.active.damage).toBe(100);});
 it('retains the real Strange Barrier',()=>{const g=game(entries[0],entries[0].name);incoming(g);expect(g.player1.active.damage).toBe(10);});
 for(const entry of [entries[1],entries[3]]) {
  it('does not give Mew copied '+entry.name+' Safeguard',()=>{const g=copied(entry);g.player2.active.getPokemonCard()!.tags.push(CardTag.POKEMON_ex);const e=incoming(g);expect(e.preventDefault).toBe(false);expect(g.player1.active.damage).toBe(100);});
  it('retains real '+entry.name+' Safeguard',()=>{const g=game(entry,entry.name);g.player2.active.getPokemonCard()!.tags.push(CardTag.POKEMON_ex);const e=incoming(g);expect(e.preventDefault).toBe(true);expect(g.player1.active.damage).toBe(0);});
 }
 it('does not give copied Froslass Evanescent prize effect to Mew',()=>{
  const g=copied(entries[2]);g.state.activePlayer=0;g.state.phase=GamePhase.ATTACK;g.state.prompts=[];
  const ko=new KnockOutEffect(g.player1,g.player1.active);g.store.reduceEffect(g.state,ko);
  expect(g.state.prompts.filter(p=>p instanceof CoinFlipPrompt && p.result===undefined).length).toBe(0);
 });
 it('retains real Froslass Evanescent coin prompt',()=>{
  const g=game(entries[2],entries[2].name);g.state.activePlayer=0;g.state.phase=GamePhase.ATTACK;const ko=new KnockOutEffect(g.player1,g.player1.active);g.store.reduceEffect(g.state,ko);
  expect(g.state.prompts.filter(p=>p instanceof CoinFlipPrompt && p.result===undefined).length).toBe(1);
 });
 it('retains the real Feraligatr ability and attack bonus',()=>{
  const g=game(entries[7],entries[7].name);useAbility(g.store,g.state,0,'Torrential Heart');expect(g.player1.active.damage).toBe(50);
  useAttack(g.store,g.state,0,'Giant Wave');expect(g.player2.active.damage).toBe(280);
 });
 for(const alias of ['Mimikyu PAF','MimikyuSV PAF','Mimikyu SVP']) it('retains alternate print ownership: '+alias,()=>{
  const g=copied({...entries[3],name:alias});g.player2.active.getPokemonCard()!.tags.push(CardTag.POKEMON_ex);const e=incoming(g);expect(e.preventDefault).toBe(false);expect(g.player1.active.damage).toBe(100);
 });
});
