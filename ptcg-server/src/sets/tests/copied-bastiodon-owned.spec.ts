import { CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Store } from '../../game/store/store';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { AttackAction } from '../../game/store/actions/game-actions';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { StoreLike } from '../../game/store/store-like';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Bastiodon } from '../set-pitch-black/bastiodon';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility } from './card-test-helpers';

class BastiodonReprint extends Bastiodon { public fullName='Bastiodon REPRINT'; public set='REPRINT'; }
class BastiodonChangedAttack extends Bastiodon {
  public reduceEffect(store:StoreLike,state:State,effect:Effect):State {
    state=super.reduceEffect(store,state,effect);
    if(effect instanceof AttackEffect && effect.attack===this.attacks[0]) effect.damage+=30;
    return state;
  }
}
function game(source?:PokemonCard) {
  const b=setupGame({turn:5,player1:{active:{card:'Mew ex 30C',energy:['Metal Energy SVE','Metal Energy SVE','Metal Energy SVE']},bench:[{card:'Bastiodon M5'}],deck:padDeck(10)},player2:{active:{card:'Dragapult ex TWM',energy:['Grass Energy SVE']},deck:padDeck(10)}});
  if(source) { source.id=b.player1.bench[0].cards[0].id; b.player1.bench[0].cards=[source]; }
  b.overridePrompt('Choose attack',()=>({index:0,attack:'Hammer In'}));
  return b;
}
function copy(b:ReturnType<typeof game>) {
  useAbility(b.store,b.state,0,'Memory Helix');
}
function opponentTurn(b:ReturnType<typeof game>,removeSource=true) {
  if(removeSource) b.player1.bench[0].moveCardTo(b.player1.bench[0].getPokemonCard()!,b.player1.lostzone);
  b.state.activePlayer=1;b.state.phase=GamePhase.PLAYER_TURN;
  b.store.dispatch(new AttackAction(b.player2.id,'Jet Headbutt'));
}
describe('copied Bastiodon Hammer In owns no Ability',()=>{
  beforeEach(()=>clearCopyAttackSessionsForTests());
  it('uses Mew Memory Helix and takes normal damage from an actual opposing attack after Bastiodon leaves play',()=>{
    const b=game();copy(b);expect(b.player2.active.damage).toBe(160);
    expect(()=>opponentTurn(b)).not.toThrow();expect(b.player1.active.damage).toBe(70);
  });
  it('retains a benched Bastiodon’s genuine Ancient Bulwark',()=>{
    const b=game();copy(b);expect(()=>opponentTurn(b,false)).not.toThrow();expect(b.player1.active.damage).toBe(0);
  });
  it('retains behavior for a metadata-only reprint',()=>{
    const b=game(new BastiodonReprint());copy(b);expect(()=>opponentTurn(b)).not.toThrow();expect(b.player1.active.damage).toBe(70);
  });
  it('retains a subclass attack override',()=>{
    const b=game(new BastiodonChangedAttack());copy(b);expect(b.player2.active.damage).toBe(190);
  });
  it('obeys real Ability suppression on the original Bastiodon',()=>{
    const b=game();copy(b);
    const garbodor=getCardByName('Garbodor DRX'),tool=getCardByName('Bravery Charm PAL');
    garbodor.id=99998;tool.id=99999;b.player2.bench[0].cards=[garbodor,tool];b.player2.bench[0].tools=[tool];
    expect(()=>opponentTurn(b,false)).not.toThrow();expect(b.player1.active.damage).toBe(70);
  });
  it('remains safe after a snapshot restore with the source in the Lost Zone',()=>{
    const b=game();copy(b);
    b.player1.bench[0].moveCardTo(b.player1.bench[0].getPokemonCard()!,b.player1.lostzone);
    b.state.activePlayer=1;b.state.phase=GamePhase.PLAYER_TURN;
    const lists=b.state.players.flatMap(p=>[p.active,...p.bench,p.deck,p.hand,p.discard,p.lostzone,p.stadium,p.supporter,...p.prizes]);
    const cards=Array.from(new Set(lists.flatMap(list=>list.cards)));
    cards.forEach((card,index)=>card.id=index);b.state.cardNames=cards.map(card=>card.fullName);
    StateSerializer.setKnownCards(cards);
    const serializer=new StateSerializer(),restored=serializer.deserialize(serializer.serialize(b.state));
    const store=new Store({onStateChange:()=>undefined});store.restoreState(restored);
    expect(()=>store.dispatch(new AttackAction(restored.players[1].id,'Jet Headbutt'))).not.toThrow();
    const wait=restored.prompts.find(p=>p.result===undefined);
    expect(wait).toBeDefined();
    expect(()=>(store as any).reducePrompt(restored,new ResolvePromptAction(wait!.id,null))).not.toThrow();
    expect(restored.players[0].active.damage).toBe(70);
  });
});
