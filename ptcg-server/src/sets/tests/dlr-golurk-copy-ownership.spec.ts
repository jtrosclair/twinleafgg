import { CardManager } from '../../game/cards/card-manager';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { setDeltaReign } from '../set-delta-reign';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

const prints = ['Mega Golurk ex M6', 'Mega Golurk ex UR M6', 'Mega Golurk ex SIR M6'];
const energy = ['Psychic Energy SVE', 'Psychic Energy SVE'];
function game(name: string, copied: boolean, handCount = 0) {
  const g = setupGame({turn:2, player1:{active:{card:copied ? 'Mew ex 30C' : name, energy},
    bench:copied ? [{card:name}] : [], hand:Array(handCount).fill('Fire Energy SVE'), deck:padDeck(12)},
    player2:{active:{card:'Mew ex MEW'}, deck:padDeck(12)}});
  const target = g.player2.active.getPokemonCard()!; target.hp = 1000; target.weakness = []; target.resistance = [];
  return g;
}
function copyAttack(g: ReturnType<typeof game>) {
  g.overridePrompt('Choose attack', () => ({index:0,attack:"Goliath's Punch"}));
  useAbility(g.store,g.state,0,'Memory Helix');
}
describe('Mega Golurk ex DLR copied attack ownership', () => {
  beforeAll(() => {const cards=CardManager.getInstance();if (!cards.isCardDefined('Mega Golurk ex M6')) cards.defineSet(setDeltaReign);});
  for (const name of prints) {
    it(name+' does not lend its attack restriction to a copying Mew with fewer than 10 hand cards',()=>{
      const g=game(name,true); expect(g.player1.hand.cards.length).toBeLessThan(10); copyAttack(g);
      expect(g.player2.active.damage).toBe(300);
      expect(g.player1.active.damage).toBe(30);
    });
    it(name+' Genome Hacking copies the opponent attack and deals recoil to Mew',()=>{
      const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW',energy:['Psychic Energy SVE','Psychic Energy SVE','Psychic Energy SVE']},deck:padDeck(12)},
        player2:{active:{card:name},deck:padDeck(12)}});
      const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
      g.overridePrompt('Choose attack',()=>({index:0,attack:"Goliath's Punch"}));
      useAttack(g.store,g.state,0,'Genome Hacking');
      expect(g.player2.active.damage).toBe(300);expect(g.player1.active.damage).toBe(30);
    });
    it(name+' remains restricted when the real Golurk has fewer than 10 hand cards',()=>{
      const g=game(name,false);
      expect(()=>useAttack(g.store,g.state,0,"Goliath's Punch")).toThrow();
      expect(g.player2.active.damage).toBe(0); expect(g.player1.active.damage).toBe(0);
    });
    it(name+' attacks and deals self damage when its real Ability permits it',()=>{
      const g=game(name,false,10); useAttack(g.store,g.state,0,"Goliath's Punch");
      expect(g.player2.active.damage).toBe(300); expect(g.player1.active.damage).toBe(30);
    });
    it(name+' attacks with fewer than 10 cards when its Ability is suppressed by Pyroduct',()=>{
      const g=game(name,false);
      const left=getCardByName('Legendary Lava Lake (Left) M6');const right=getCardByName('Legendary Lava Lake (Right) M6');
      g.player2.stadium.cards=[left,right];g.player2.stadium.isPublic=true;
      expect((g.player1.active.getPokemonCard() as PokemonCard).stage).toBeDefined();
      useAttack(g.store,g.state,0,"Goliath's Punch");
      expect(g.player2.active.damage).toBe(300);expect(g.player1.active.damage).toBe(30);
    });
  }
});
