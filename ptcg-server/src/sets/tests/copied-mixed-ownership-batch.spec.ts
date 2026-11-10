import { CardManager } from '../../game/cards/card-manager';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase } from '../../game/store/state/state';
import { setDeltaReign } from '../set-delta-reign';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

const fight='Fighting Energy SVE';
function game(name:string, energy:string[], copied:boolean) {
  const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:copied?[{card:name}]:[],deck:padDeck(12)},
    player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  const defender=g.player2.active.getPokemonCard()!; defender.hp=1000;defender.weakness=[];defender.resistance=[];
  return g;
}
function attack(g:ReturnType<typeof game>,name:string,copied:boolean){
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:name}));useAbility(g.store,g.state,0,'Memory Helix');}
  else useAttack(g.store,g.state,0,name);
}
describe('Explicit ownership for six mixed Ability/attack handlers',()=>{
  beforeAll(()=>{const cm=CardManager.getInstance();if(!cm.isCardDefined('Golett M6'))cm.defineSet(setDeltaReign);});
  for(const copied of [false,true]) {
    const label=copied?'copied ':'direct ';
    it(label+'Steelix Tough Swing retains its Resistance bypass',()=>{
      const g=game('Steelix M6',[fight,fight,fight,fight],copied);
      g.player2.active.getPokemonCard()!.resistance=[{type:copied?CardType.PSYCHIC:CardType.FIGHTING,value:-30}];
      attack(g,'Tough Swing',copied);expect(g.player2.active.damage).toBe(150);
    });
    it(label+'Sandslash Digging Claw discards the top opposing deck card',()=>{
      const g=game('Sandslash M6',[fight],copied);const top=g.player2.deck.cards[0];
      attack(g,'Digging Claw',copied);expect(g.player2.active.damage).toBe(60);expect(g.player2.discard.cards).toContain(top);
    });
    it(label+'Zygarde Peace Maker counts the opponent Ultra Beast without copying its Ability',()=>{
      const g=game('Zygarde FLI',[fight],copied), target=g.player2.active.getPokemonCard()!;
      target.tags=[CardTag.ULTRA_BEAST];target.weakness=[{type:copied?CardType.PSYCHIC:CardType.FIGHTING}];
      attack(g,'Peace Maker',copied);expect(g.player2.active.damage).toBe(copied?120:60);
    });
    it(label+'Slaking Crushing Blow discards an opposing Energy',()=>{
      const g=game('Slaking DRX',[fight,fight,fight,fight],copied),defender=g.player2.active.getPokemonCard()!;
      if(!copied)defender.stage=Stage.STAGE_1;
      const energy=getCardByName('Water Energy SVE');energy.id=9909;g.player2.active.cards.push(energy);
      g.overridePrompt('Choose cards',()=>[g.player2.active.cards.indexOf(energy)]);
      attack(g,'Crushing Blow',copied);expect(g.player2.active.damage).toBe(100);expect(g.player2.discard.cards).toContain(energy);
    });
    it(label+'Zebstrika Crashing Bolt retains its printed damage bonus',()=>{
      const g=game('Zebstrika BKP',['Lightning Energy SVE','Lightning Energy SVE'],copied);
      g.player2.active.getPokemonCard()!.resistance=[{type:CardType.FIGHTING,value:-30}];
      attack(g,'Crashing Bolt',copied);expect(g.player2.active.damage).toBe(110);
    });
    it(label+'Tinkaton Special Hammer retains its Special Energy bonus',()=>{
      const g=game('Tinkaton PAL',['Psychic Energy SVE','Gift Energy LOR'],copied);
      attack(g,'Special Hammer',copied);expect(g.player2.active.damage).toBe(180);
    });
  }
  for(const name of ['Tinkaton SVP','Tinkaton PAF']) for(const copied of [false,true]) {
    it((copied?'copied ':'direct ')+name+' retains the Special Energy bonus through its inherited attack contract',()=>{
      const g=game(name,['Psychic Energy SVE','Gift Energy LOR'],copied);
      attack(g,'Special Hammer',copied);expect(g.player2.active.damage).toBe(180);
    });
  }
  it('Slaking keeps its own Unobservant attack restriction against a Basic',()=>{
    const g=game('Slaking DRX',[fight,fight,fight,fight],false);
    expect(()=>attack(g,'Crushing Blow',false)).toThrow();expect(g.player2.active.damage).toBe(0);
  });
  it('Steelix retains its own full-HP Ability when taking opposing attack damage',()=>{
    const g=game('Steelix M6',[],false);g.player1.active.getPokemonCard()!.weakness=[];
    const attacker=g.player2.active.getPokemonCard() as PokemonCard;
    const hit=new AttackEffect(g.player2,g.player1,attacker.attacks[0]);g.store.reduceEffect(g.state,new DealDamageEffect(hit,100));
    expect(g.player1.active.damage).toBe(40);
  });
  for(const copied of [false,true]) it((copied?'copied ':'direct ')+'Sandslash does not transfer its Counterattack Quills Ability',()=>{
    const g=game('Sandslash M6',[fight],copied);
    if(copied)attack(g,'Digging Claw',true);
    g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
    const attacker=g.player2.active.getPokemonCard()!;
    const hit=new AttackEffect(g.player2,g.player1,attacker.attacks[0]);
    const before=g.player2.active.damage;
    g.store.reduceEffect(g.state,new AfterDamageEffect(hit,30));
    expect(g.player2.active.damage).toBe(before+(copied?0:30));
  });
  it('Tinkaton retains its own Gather Materials Ability',()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Tinkaton PAL'},hand:['Fire Energy SVE'],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
    const card=g.player1.hand.cards[0];g.overridePrompt('Choose cards',()=>[0]);useAbility(g.store,g.state,0,'Gather Materials');
    expect(g.player1.hand.cards.length).toBe(3);expect(g.player1.discard.cards).toContain(card);
  });
});
