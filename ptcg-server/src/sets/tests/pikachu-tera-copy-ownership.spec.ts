import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase } from '../../game/store/state/state';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Store } from '../../game/store/store';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Pikachuex } from '../set-surging-sparks/pikachu-ex';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

class PikachuReprint extends Pikachuex { public fullName='Pikachu ex REPRINT'; public set='REPRINT'; }
class PikachuChangedAttack extends Pikachuex {
  public reduceEffect(store:StoreLike,state:State,effect:Effect):State {
    state=super.reduceEffect(store,state,effect);
    if(effect instanceof AttackEffect && effect.attack===this.attacks[0]) effect.damage+=10;
    return state;
  }
}
function game(variant: 'base' | 'reprint' | 'changed' = 'base') {
  const g=setupGame({turn:5,
    player1:{active:{card:'Mew ex 30C',energy:['Grass Energy SVE','Lightning Energy SVE','Metal Energy SVE']},
      bench:[{card:'Pikachu ex SSP'},{card:'Snorlax PGO'}],deck:padDeck(10)},
    player2:{active:{card:'Charizard ex OBF',energy:['Fire Energy SVE','Fire Energy SVE']},deck:padDeck(10)}});
  g.player2.active.getPokemonCard()!.hp=600;
  if(variant!=='base') { const card=variant==='reprint'?new PikachuReprint():new PikachuChangedAttack(); card.id=g.player1.bench[0].cards[0].id; g.player1.bench[0].cards=[card]; }
  g.overridePrompt('Choose attack',()=>({index:0,attack:'Topaz Bolt'}));
  return g;
}
function copyAndBench(g: ReturnType<typeof game>, keepSource=false) {
  useAbility(g.store,g.state,0,'Memory Helix');
  expect(g.player2.active.damage).toBe(300);
  if(!keepSource) g.player1.bench[0].moveCardTo(g.player1.bench[0].getPokemonCard()!,g.player1.lostzone);
  g.player1.switchPokemon(g.player1.bench[1]);
  expect(g.player1.bench[1].getPokemonCard()!.fullName).toBe('Mew ex 30C');
  g.state.activePlayer=1; g.state.phase=GamePhase.ATTACK;
}
function benchHit(store:Store, state:any, target:any, amount=40) {
  const attack=new AttackEffect(state.players[1],state.players[0],{name:'Bench Hit',cost:[],damage:amount,text:''});
  const hit=new PutDamageEffect(attack,amount); hit.target=target;
  store.reduceEffect(state,hit);
}
describe('copied Pikachu Topaz Bolt does not confer Tera protection',()=>{
  beforeEach(()=>clearCopyAttackSessionsForTests());
  it('takes opposing Bench damage after the source has left play',()=>{
    const g=game();copyAndBench(g);benchHit(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
  });
  it('takes opposing Bench damage while the original Pikachu remains in play',()=>{
    const g=game();copyAndBench(g,true);benchHit(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
    benchHit(g.store,g.state,g.player1.bench[0]);expect(g.player1.bench[0].damage).toBe(0);
  });
  it('keeps the original Pikachu Tera Bench protection with no copied session',()=>{
    const g=game();g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
    benchHit(g.store,g.state,g.player1.bench[0]);expect(g.player1.bench[0].damage).toBe(0);
  });
  it('does not inherit Bench protection from a metadata-only reprint',()=>{
    const g=game('reprint');copyAndBench(g);benchHit(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
  });
  it('does not inherit Bench protection from a registered full-art reprint',()=>{
    const g=game(),reprint=getCardByName('Pikachu exFA SSP');
    reprint.id=g.player1.bench[0].cards[0].id;g.player1.bench[0].cards=[reprint];
    copyAndBench(g);benchHit(g.store,g.state,g.player1.bench[1]);expect(g.player1.bench[1].damage).toBe(40);
  });
  it('does not give full-HP Mew the source Pikachu’s Tenacious Heart',()=>{
    const g=game();useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(300);
    g.player1.bench[0].moveCardTo(g.player1.bench[0].getPokemonCard()!,g.player1.lostzone);
    g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
    benchHit(g.store,g.state,g.player1.active,250);expect(g.player1.active.damage).toBeGreaterThan(159);
  });
  it('lets an actual opposing attack Knock Out full-HP Mew after it copies Topaz Bolt',()=>{
    const g=game(),mew=g.player1.active.getPokemonCard()!;
    useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(300);
    g.player1.bench[0].moveCardTo(g.player1.bench[0].getPokemonCard()!,g.player1.lostzone);
    g.state.activePlayer=1;g.state.phase=GamePhase.PLAYER_TURN;
    useAttack(g.store,g.state,1,'Burning Darkness');
    expect(g.player1.discard.cards).toContain(mew);
  });
  it('preserves an unannotated subclass attack override via legacy fallback',()=>{
    const g=game('changed'); useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(310);
  });
  it('retains the lost-zone source session safely across a serialized snapshot',()=>{
    const g=game();copyAndBench(g);
    const lists=g.state.players.flatMap(p=>[p.active,...p.bench,p.deck,p.hand,p.discard,p.lostzone,p.stadium,p.supporter,...p.prizes]);
    const cards=Array.from(new Set(lists.flatMap(list=>list.cards)));cards.forEach((card,index)=>card.id=index);g.state.cardNames=cards.map(card=>card.fullName);
    StateSerializer.setKnownCards(cards); const serializer=new StateSerializer(),restored=serializer.deserialize(serializer.serialize(g.state));
    const store=new Store({onStateChange:()=>undefined});store.restoreState(restored);
    benchHit(store,restored,restored.players[0].bench[1]);expect(restored.players[0].bench[1].damage).toBe(40);
  });
  it('keeps direct Topaz Bolt damage and discards its three Energy',()=>{
    const g=setupGame({turn:5,player1:{active:{card:'Pikachu ex SSP',energy:['Grass Energy SVE','Lightning Energy SVE','Metal Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Dragapult ex TWM'},deck:padDeck(10)}});
    const pika=g.player1.active.getPokemonCard()! as PokemonCard;
    g.player2.active.getPokemonCard()!.hp=600;
    useAttack(g.store,g.state,0,'Topaz Bolt');
    expect(g.player2.active.damage).toBe(300); expect(g.player1.active.energies.cards.length).toBe(0);
    expect(g.player1.discard.cards.filter(c=>c.superType===3).length).toBe(3); expect(pika.fullName).toBe('Pikachu ex SSP');
  });
  it('preserves Tenacious Heart on the original Active Pikachu',()=>{
    const g=setupGame({turn:5,player1:{active:{card:'Pikachu ex SSP'},deck:padDeck(10)},player2:{active:{card:'Dragapult ex TWM'},deck:padDeck(10)}});
    g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
    benchHit(g.store,g.state,g.player1.active,250);expect(g.player1.active.damage).toBe(190);
  });
  it('lets real Garbotoxin suppress the original Tenacious Heart',()=>{
    const g=setupGame({turn:5,player1:{active:{card:'Pikachu ex SSP'},deck:padDeck(10)},player2:{active:{card:'Dragapult ex TWM'},bench:[{card:'Garbodor DRX',tools:['Bravery Charm PAL']}],deck:padDeck(10)}});
    g.state.activePlayer=1;g.state.phase=GamePhase.ATTACK;
    benchHit(g.store,g.state,g.player1.active,250);expect(g.player1.active.damage).toBe(250);
  });
});
