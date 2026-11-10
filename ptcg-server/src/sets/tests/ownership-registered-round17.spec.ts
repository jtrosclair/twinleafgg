import { CardType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase } from '../../game/store/state/state';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { ensureCardsRegistered, getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

type Entry = {name:string; attack:string; energy:string[]; damage:number};
const all: Entry[] = [
  {name:'Drednaw SCR',attack:'Hard Crunch',energy:['Water Energy SVE','Water Energy SVE','Water Energy SVE'],damage:80},
  {name:'Bronzong FCO',attack:'Guard Press',energy:['Metal Energy SVE','Metal Energy SVE','Metal Energy SVE'],damage:60},
  {name:'Aegislash XY 86',attack:"King's Shield",energy:['Metal Energy SVE','Metal Energy SVE','Metal Energy SVE','Metal Energy SVE'],damage:50},
  {name:'Passimian UPR',attack:'Rock Hurl',energy:['Fighting Energy SVE','Fighting Energy SVE'],damage:40},
  {name:'Regirock EX FCO',attack:'Bedrock Press',energy:['Fighting Energy SVE','Fighting Energy SVE','Fighting Energy SVE'],damage:100},
];
function game(entry:Entry, active = 'Mew TM') {
  const g=setupGame({turn:3,player1:{active:{card:active,energy:entry.energy},deck:padDeck(10)},player2:{active:{card:'Squirtle BS'},deck:padDeck(10)}});
  g.player1.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.hp=1000;
  return g;
}
function copy(entry:Entry) {
  const g=game(entry);
  if(entry.attack==='Bedrock Press') g.player1.active.getPokemonCard()!.cardType=CardType.FIGHTING;
  g.player1.lostzone.cards.push(getCardByName(entry.name));
  g.overridePrompt('Choose attack',()=>({index:0,attack:entry.attack}));
  useAbility(g.store,g.state,0,'Lost Link');
  return g;
}
function incoming(g: ReturnType<typeof game>, amount:number) {
  g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
  const effect=new DealDamageEffect(new AttackEffect(g.player2,g.player1,{name:'Hit',cost:[],damage:amount,text:''}),amount);
  g.store.reduceEffect(g.state,effect);
  return effect;
}
describe('registered attack and ability ownership round 17',()=>{
 beforeAll(()=>ensureCardsRegistered(['Aegislash XY','Regirock EX FCO']));
 beforeEach(()=>clearCopyAttackSessionsForTests());
 all.forEach(entry=>{
  it(entry.name+' copies the attack without the Lost Zone source ability',()=>{
   const g=copy(entry);expect(g.player2.active.damage).toBe(entry.damage);
  });
  if(entry.name!=='Regirock EX FCO')it(entry.name+' keeps its attack while used by the real card',()=>{
   const g=game(entry,entry.name);useAttack(g.store,g.state,0,entry.attack);expect(g.player2.active.damage).toBe(entry.damage);
  });
 });
 it('does not copy Drednaw Impervious Shell but keeps the real Ability',()=>{
  const g=copy(all[0]);incoming(g,200);expect(g.player1.active.damage).toBe(200);
  const real=game(all[0],'Drednaw SCR');incoming(real,200);expect(real.player1.active.damage).toBe(0);
 });
 it('keeps copied King Shield damage prevention through the opponent turn',()=>{
  const g=copy(all[2]);incoming(g,40);expect(g.player1.active.damage).toBe(0);
  g.state.phase=GamePhase.FINISHED;g.store.reduceEffect(g.state,new EndTurnEffect(g.player2));
  incoming(g,40);expect(g.player1.active.damage).toBe(40);
 });
 it('preserves the actual Regirock Ability while a different Fighting Pokémon attacks',()=>{
  const g=game(all[4]);g.player1.active.getPokemonCard()!.cardType=CardType.FIGHTING;
  const slot=g.player1.bench[0];slot.cards=[getCardByName('Regirock EX FCO')];
  const target=new AttackEffect(g.player1,g.player2,{name:'Hit',cost:[],damage:30,text:''});
  const eff=new PutDamageEffect(target,30);
  g.store.reduceEffect(g.state,eff);expect(eff.damage).toBe(40);
 });
 it('retains inherited ownership on the registered Regirock alternate print',()=>{
  const entry={...all[4],name:'Regirock-EX FCO 43a'};const g=copy(entry);expect(g.player2.active.damage).toBe(100);
 });
 it('preserves actual Bronzong Bench protection',()=>{
  const g=game(all[1]);g.player1.bench[0].cards=[getCardByName('Bronzong FCO')];
  g.player1.bench[1].cards=[getCardByName('Squirtle BS')];
  const attack=new AttackEffect(g.player2,g.player1,{name:'Bench Hit',cost:[],damage:40,text:''});
  const effect=new PutDamageEffect(attack,40);effect.target=g.player1.bench[1];
  g.store.reduceEffect(g.state,effect);expect(g.player1.bench[1].damage).toBe(0);
 });
 it('preserves the real Passimian Bench damage Ability',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Passimian UPR',energy:['Fighting Energy SVE','Fighting Energy SVE']},bench:[{card:'Passimian UPR'}],deck:padDeck(10)},player2:{active:{card:'Drednaw SCR'},deck:padDeck(10)}});
  g.player2.active.getPokemonCard()!.hp=1000;useAttack(g.store,g.state,0,'Rock Hurl');expect(g.player2.active.damage).toBe(70);
 });

 it('preserves copied Guard Press and expires it with the opponent turn',()=>{
  const g=copy(all[1]), actual=game(all[1],'Bronzong FCO');useAttack(actual.store,actual.state,0,'Guard Press');
  incoming(g,80);incoming(actual,80);expect(g.player1.active.damage).toBe(actual.player1.active.damage);expect(g.player1.active.damage).toBeLessThan(80);
  g.player1.active.damage=0;g.state.phase=GamePhase.FINISHED;g.store.reduceEffect(g.state,new EndTurnEffect(g.player2));incoming(g,80);expect(g.player1.active.damage).toBe(80);
 });
 it('retains copied Rock Hurl resistance bypass',()=>{
  const g=game(all[3]);g.player2.active.getPokemonCard()!.resistance=[{type:CardType.PSYCHIC,value:-30}];
  g.player1.lostzone.cards.push(getCardByName(all[3].name));g.overridePrompt('Choose attack',()=>({index:0,attack:all[3].attack}));
  useAbility(g.store,g.state,0,'Lost Link');expect(g.player2.active.damage).toBe(40);
 });
 it('retains copied Hard Crunch damage when the target already has damage',()=>{
  const g=game(all[0]);g.player2.active.damage=10;g.player1.lostzone.cards.push(getCardByName(all[0].name));
  g.overridePrompt('Choose attack',()=>({index:0,attack:all[0].attack}));useAbility(g.store,g.state,0,'Lost Link');expect(g.player2.active.damage).toBe(170);
 });

});
