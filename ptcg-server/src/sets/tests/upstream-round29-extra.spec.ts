import { ensureClientCards } from '../../client/cards';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { State } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
const water='Water Energy SVE', light='Lightning Energy SVE', dark='Darkness Energy SVE';
const data=[
 {name:'Beldum UL',number:'44',set:'UL',hp:60,type:CardType.PSYCHIC,attacks:[['Reaction',10]]}
] as Array<any>;
function setup(name:string,energy:string[],copied:boolean,opponentEnergy:string[]=[water]){const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name},{card:'Charmander BS'}]:[{card:'Charmander BS'}],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW',energy:opponentEnergy},bench:[{card:'Charmander BS'}],deck:padDeck(12)}});for(const slot of [g.player2.active,g.player2.bench[0]]){const c=slot.getPokemonCard()!;c.hp=1000;c.weakness=[];c.resistance=[]}return g}
function attack(g:ReturnType<typeof setup>,name:string,copied:boolean){if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,name)}
describe('round29 Beldum switching',()=>{
 beforeAll(()=>ensureClientCards());
 for(const r of data)it(r.name+' metadata',()=>{const c=getCardByName(r.name) as PokemonCard;expect([c.fullName,c.set,c.setNumber,c.hp,c.cardType]).toEqual([r.name,r.set,r.number,r.hp,r.type]);expect(c.attacks.map(a=>[a.name,a.damage])).toEqual(r.attacks)});
 for(const copied of [false,true]){
  for(const yes of [false,true])it((copied?'copied ':'direct ')+'Beldum optional switch='+yes,()=>{const g=setup('Beldum UL',['Psychic Energy SVE'],copied),source=g.player1.active;g.overridePrompt('Confirm',()=>yes);attack(g,'Reaction',copied);expect(g.player2.active.damage).toBe(10);expect(g.player1.active===source).toBe(!yes)});
 }

});
