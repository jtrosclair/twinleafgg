import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Dragapultex } from '../set-twilight-masquerade/dragapult-ex';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

class DragapultChangedAttack extends Dragapultex {
  public reduceEffect(store:StoreLike,state:State,effect:Effect):State {
    state=super.reduceEffect(store,state,effect);
    if(effect instanceof AttackEffect && effect.attack===this.attacks[0]) effect.damage+=10;
    return state;
  }
}

type Case = { source:string, reprint:string, attack:string, energy:string[], expected:number };
const cases:Case[]=[
  {source:'Dragapult ex TWM',reprint:'Dragapult exFA TWM',attack:'Jet Headbutt',energy:['Psychic Energy SVE'],expected:70},
  {source:'Charizard ex OBF',reprint:'Charizard exFA OBF',attack:'Burning Darkness',energy:['Fire Energy SVE','Fire Energy SVE'],expected:180},
  {source:'Greninja ex TWM',reprint:'Greninja exFA TWM',attack:'Shinobi Blade',energy:['Water Energy SVE'],expected:170},
  {source:'Teal Mask Ogerpon ex TWM',reprint:'Teal Mask Ogerpon exFA TWM',attack:'Myriad Leaf Shower',energy:['Grass Energy SVE','Grass Energy SVE','Grass Energy SVE'],expected:120},
];
function game(c:Case, print=c.source) {
  const g=setupGame({turn:5,
    player1:{active:{card:'Mew ex 30C',energy:c.energy},bench:[{card:print},{card:'Snorlax PGO'}],deck:padDeck(10)},
    player2:{active:{card:'Charizard ex OBF'},bench:[{card:'Snorlax PGO'}],deck:padDeck(10)}});
  g.player2.active.getPokemonCard()!.hp=600;
  g.overridePrompt('Choose attack',()=>({index:0,attack:c.attack}));
  if(c.attack==='Shinobi Blade') g.overridePrompt('Confirm',()=>false);
  return g;
}
function hitBench(store:Store,state:State,target:any,damage=40) {
  const attack=new AttackEffect(state.players[1],state.players[0],{name:'Bench Hit',cost:[],damage,text:''});
  const effect=new PutDamageEffect(attack,damage);effect.target=target;store.reduceEffect(state,effect);
}
function copyAndBench(g:ReturnType<typeof game>,c:Case,keepSource=false) {
  useAbility(g.store,g.state,0,'Memory Helix');
  expect(g.player2.active.damage).toBe(c.expected);
  if(!keepSource) g.player1.bench[0].moveCardTo(g.player1.bench[0].getPokemonCard()!,g.player1.lostzone);
  g.player1.switchPokemon(g.player1.bench[1]);
  g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
}
describe('common Tera copied-attack ownership',()=>{
  beforeEach(()=>clearCopyAttackSessionsForTests());
  cases.forEach(c=>{
    it(c.source+' keeps its original direct attack',()=>{
      const g=setupGame({turn:5,player1:{active:{card:c.source,energy:c.energy},deck:padDeck(10)},
        player2:{active:{card:'Charizard ex OBF'},bench:[{card:'Snorlax PGO'}],deck:padDeck(10)}});
      g.player2.active.getPokemonCard()!.hp=600;
      if(c.attack==='Shinobi Blade') g.overridePrompt('Confirm',()=>false);
      useAttack(g.store,g.state,0,c.attack);
      // Ogerpon is Grass and the test Charizard is weak to Grass; copied Mew is Psychic.
      expect(g.player2.active.damage).toBe(c.source==='Teal Mask Ogerpon ex TWM'?240:c.expected);
    });
    it(c.source+' does not grant Tera Bench protection to a copycat after leaving play',()=>{
      const g=game(c);copyAndBench(g,c);hitBench(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
    });
    it(c.source+' retains the source Tera protection on its own Bench',()=>{
      const g=game(c);copyAndBench(g,c,true);hitBench(g.store,g.state,g.player1.bench[0]);expect(g.player1.bench[0].damage).toBe(0);
    });
    it(c.reprint+' is also attack-only when copied',()=>{
      const g=game(c,c.reprint);copyAndBench(g,c);hitBench(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
    });
  });
  it('preserves Teal Dance on the real Benched Ogerpon',()=>{
    const c=cases[3],g=game(c);const grass=getCardByName('Grass Energy SVE');grass.id=99999;g.player1.hand.cards=[grass];
    useAbility(g.store,g.state,0,'Teal Dance');expect(g.player1.bench[0].cards).toContain(grass);expect(g.player1.hand.cards.length).toBe(1);
  });
  it('retains a subclass attack override via the legacy fallback',()=>{
    const c=cases[0],g=game(c),card=new DragapultChangedAttack();
    card.id=g.player1.bench[0].cards[0].id;g.player1.bench[0].cards=[card];
    useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(80);
  });
  it('copies Phantom Dive and places its six damage counters on the Bench',()=>{
    const c:Case={...cases[0],attack:'Phantom Dive',energy:['Fire Energy SVE','Psychic Energy SVE'],expected:200};
    const g=game(c);
    g.overridePrompt('Put damage',()=>[{target:{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0},damage:60}]);
    useAbility(g.store,g.state,0,'Memory Helix');
    expect(g.player2.active.damage).toBe(200);expect(g.player2.bench[0].damage).toBe(60);
  });
  it('copies Mirage Barrage, deals damage to both targets and discards two Energy',()=>{
    const c:Case={...cases[2],attack:'Mirage Barrage',energy:['Water Energy SVE','Water Energy SVE','Psychic Energy SVE'],expected:120};
    const g=game(c);useAbility(g.store,g.state,0,'Memory Helix');
    expect(g.player2.active.damage).toBe(120);expect(g.player2.bench[0].damage).toBe(120);
    expect(g.player1.active.energies.cards.length).toBe(1);
  });
});
