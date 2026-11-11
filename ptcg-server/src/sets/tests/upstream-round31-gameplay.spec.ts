import { ensureClientCards } from '../../client/cards';
import { padDeck,setupGame } from './test-helpers';
import { useAbility,useAttack } from './card-test-helpers';
const W='Water Energy SVE',G='Grass Energy SVE',F='Fighting Energy SVE',R='Fire Energy SVE';
function game(name:string,energy:string[],copy:boolean){const g=setupGame({turn:3,player1:{active:{card:copy?'Mew ex 30C':name,energy},bench:copy?[{card:name}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];return g}
function attack(g:ReturnType<typeof game>,move:string,copy:boolean){if(copy){g.overridePrompt('Choose attack',()=>({index:0,attack:move}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,move)}
describe('round31 promo gameplay',()=>{beforeAll(()=>ensureClientCards());for(const copy of [false,true]){
 const label=copy?'copied ':'direct ';
 for(const [name,move,energy,damage] of [['Makuhita MEP','Corkscrew Punch',[F],10],['Makuhita MEP','Confront',[F,F],30],['Chikorita MEP','Razor Leaf',[G],20],['Charmeleon MEP','Steady Firebreathing',[R],40]] as Array<[string,string,string[],number]>)it(label+name+' '+move,()=>{const g=game(name,energy,copy);attack(g,move,copy);expect(g.player2.active.damage).toBe(damage)});
 }it('Chikorita MEP requires Grass instead of arbitrary Energy',()=>{const g=game('Chikorita MEP',[W],false);expect(()=>attack(g,'Razor Leaf',false)).toThrow();expect(g.player2.active.damage).toBe(0)});
});
