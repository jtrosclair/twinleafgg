import { ensureClientCards } from '../../client/cards';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { getCardByName,padDeck,setupGame } from './test-helpers';
import { useAbility,useAttack } from './card-test-helpers';
const W='Water Energy SVE',F='Fighting Energy SVE';
function game(card:string,energy:string[],copy:boolean){const g=setupGame({turn:3,player1:{active:{card:copy?'Mew ex 30C':card,energy,tools:['Muscle Band XY']},bench:copy?[{card}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Charmander BS'}],deck:padDeck(12)}});g.player1.active.cards=g.player1.active.cards.filter(c=>c.name!=='Muscle Band');const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];return g}
function attack(g:ReturnType<typeof game>,move:string,copy:boolean){if(copy){g.overridePrompt('Choose attack',()=>({index:0,attack:move}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,move)}
describe('independent POP6 edge review',()=>{
 beforeAll(()=>ensureClientCards());
 for(const copy of [false,true])for(const heads of [false,true])for(const [card,move,energy,dmg] of [['Riolu P6','Wild Kick',[F],heads?50:0],['Piplup P6','Water Splash',[W,W],heads?50:40]] as Array<[string,string,string[],number]>)it(card+' '+move+' Muscle Band copied='+copy+' heads='+heads,()=>{const g=game(card,energy,copy);spyOn(Math,'random').and.returnValue(heads?0.1:0.9);attack(g,move,copy);expect(g.player2.active.damage).toBe(dmg)});
 for(const copy of [false,true])for(const blocked of [false,true])it('Staravia Whirlwind effect protection copied='+copy+' blocked='+blocked,()=>{const g=game('Staravia P6',[W,W],copy),defender=g.player2.active;defender.preventEffectsOfAttacksNextTurn=blocked;attack(g,'Whirlwind',copy);expect(defender.damage).toBe(40);expect(g.player2.active===defender).toBe(blocked)});
 it('Piplup reprint changes only the intended Water Splash base damage',()=>{const base=getCardByName('Piplup DP') as PokemonCard,reprint=getCardByName('Piplup P6') as PokemonCard;expect(base.attacks[1].damage).toBe(10);expect(reprint.attacks[1].damage).toBe(20);expect({...reprint.attacks[1],damage:10}).toEqual(base.attacks[1]);expect(reprint.attacks[0]).toEqual(base.attacks[0]);});
 for(const name of ['Manaphy','Pachirisu','Riolu','Staravia','Buneary','Piplup','Starly','Turtwig'])it('numbered POP6 roundtrip resolves '+name,()=>{const c=ensureClientCards().find(c=>c.fullName===name+' P6')!;expect(c).toBeDefined();expect(StateSerializer.normalizeCardName(name+' P6 '+c.setNumber)).toBe(name+' P6')});
});
