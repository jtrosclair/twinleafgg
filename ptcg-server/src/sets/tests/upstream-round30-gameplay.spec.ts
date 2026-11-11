import { ensureClientCards } from '../../client/cards';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
class Bonus extends TrainerCard { name='Bonus'; fullName='Bonus TST'; set='TST'; trainerType=TrainerType.STADIUM; reduceEffect(_s:StoreLike,state:State,e:Effect):State { if(e instanceof AttackEffect)e.damage+=20; return state; } }
const W='Water Energy SVE',L='Lightning Energy SVE',F='Fighting Energy SVE';
function game(name:string, energy:string[], copied:boolean){const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:[...(copied?[{card:name}]:[]),{card:'Charmander BS'}],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Squirtle BS'}],deck:padDeck(12)}});for(const s of [g.player2.active,g.player2.bench[0]]){s.getPokemonCard()!.hp=1000;s.getPokemonCard()!.weakness=[];s.getPokemonCard()!.resistance=[]}return g}
function attack(g:ReturnType<typeof game>,move:string,copied:boolean){if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:move}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,move)}
describe('round30 POP6 inherited gameplay',()=>{
 beforeAll(()=>ensureClientCards());
 for(const copied of [false,true]){
  const label=copied?'copied ':'direct ';
  for(const [name,move,energy,expected] of [['Turtwig P6','Tackle',[],10],['Turtwig P6','Razor Leaf',['Grass Energy SVE'],20],['Buneary P6','Splash',[W],10],['Piplup P6','Peck',[],10],['Starly P6','Gust',[W],10]] as Array<[string,string,string[],number]>)it(label+name+' '+move,()=>{const g=game(name,energy,copied);attack(g,move,copied);expect(g.player2.active.damage).toBe(expected)});
  for(const heads of [false,true])for(const [name,move,energy,expected] of [['Riolu P6','Wild Kick',[F],heads?30:0],['Starly P6','Quick Attack',[W,W],heads?30:10],['Piplup P6','Water Splash',[W,W],heads?30:20]] as Array<[string,string,string[],number]>)it(label+name+' '+move+' heads='+heads,()=>{const g=game(name,energy,copied);spyOn(Math,'random').and.returnValue(heads?0.1:0.9);attack(g,move,copied);expect(g.player2.active.damage).toBe(expected)});
  for(const heads of [false,true])it(label+'Riolu Wild Kick with damage modifier heads='+heads,()=>{const g=game('Riolu P6',[F],copied);g.player1.stadium.cards.push(new Bonus());spyOn(Math,'random').and.returnValue(heads?0.1:0.9);attack(g,'Wild Kick',copied);expect(g.player2.active.damage).toBe(heads?50:0)});
  for(const blocked of [false,true])it(label+'Buneary Jump Kick and Bench protection='+blocked,()=>{const g=game('Buneary P6',[W,W],copied);if(blocked){const m=getCardByName('Manaphy BRS');g.player2.bench[1].cards.push(m)}g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);attack(g,'Jump Kick',copied);expect(g.player2.active.damage).toBe(10);expect(g.player2.bench[0].damage).toBe(blocked?0:10)});
  for(const heads of [false,true])it(label+'Pachirisu Thunder Jolt heads='+heads,()=>{const g=game('Pachirisu P6',[L],copied);spyOn(Math,'random').and.returnValue(heads?0.1:0.9);attack(g,'Thunder Jolt',copied);expect(g.player2.active.damage).toBe(20);expect(g.player1.active.damage).toBe(heads?0:10)});
  for(const found of [false,true])it(label+'Pachirisu search found='+found,()=>{const g=game('Pachirisu P6',[W],copied),energy=getCardByName('Fire Energy SVE');g.player1.deck.cards.unshift(energy);let shuffled=false;g.overridePrompt('Choose cards',()=>found?[0]:[]);g.overridePrompt('Show cards',()=>true);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i)});attack(g,'Minor Errand-Running',copied);expect(g.player1.hand.cards.includes(energy)).toBe(found);expect(shuffled).toBe(true)});
  it(label+'Manaphy Aqua Ring switches attacker after damage',()=>{const g=game('Manaphy P6',[W,W],copied),original=g.player1.active;attack(g,'Aqua Ring',copied);expect(g.player2.active.damage).toBe(30);expect(g.player1.active).not.toBe(original);expect(g.player1.bench).toContain(original)});
  for(const found of [false,true])it(label+'Manaphy Call for Family search found='+found,()=>{const g=game('Manaphy P6',[W],copied),target=getCardByName('Bulbasaur BS');g.player1.deck.cards.unshift(target);let shuffled=false;g.overridePrompt('Choose cards',(p:any)=>found?[p.cards.cards.indexOf(target)]:[]);g.overridePrompt('Shuffle deck',()=>{shuffled=true;return g.player1.deck.cards.map((_,i)=>i)});attack(g,'Call for Family',copied);expect(g.player1.bench.some(x=>x.cards.includes(target))).toBe(found);expect(shuffled).toBe(true)});
  it(label+'Staravia Whirlwind switches defender after damage',()=>{const g=game('Staravia P6',[W,W],copied),defender=g.player2.active;attack(g,'Whirlwind',copied);expect(defender.damage).toBe(20);expect(g.player2.active).not.toBe(defender)});
  for(const blocked of [false,true])it(label+'Staravia Clutch checks attack-effect protection='+blocked,()=>{const g=game('Staravia P6',[W,W],copied);g.player2.active.preventEffectsOfAttacksNextTurn=blocked;attack(g,'Clutch',copied);expect(g.player2.active.damage).toBe(20);expect(g.player2.active.marker.markers.length>0).toBe(!blocked)});
 }
});
