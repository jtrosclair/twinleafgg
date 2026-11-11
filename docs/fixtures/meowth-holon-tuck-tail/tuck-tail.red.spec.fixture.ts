// Non-shipping regression: both cases should return the attached Holon card.
import { padDeck,setupGame } from './test-helpers';
import { useAbility,useAttack } from './card-test-helpers';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';

describe('Tuck Tail returns attached Pokemon Energy',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true]) it('returns Holon Magnemite to hand, copied='+copied,()=>{
  const fire='Fire Energy SVE';
  const g=setupGame({turn:5,player1:{active:{card:copied?'Mew ex 30C':'Meowth ex POR',energy:[fire,fire,fire]},bench:copied?[{card:'Meowth ex POR'},{card:'Charmander BS'}]:[{card:'Charmander BS'}],hand:["Holon's Magnemite DS"],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
  g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];
  const holon=g.player1.hand.cards[0];g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}]);
  g.store.dispatch(new UseAbilityAction(g.player1.id,holon.powers[0].name,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.HAND,index:0}));
  expect(g.player1.active.energies.cards).toContain(holon);
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Tuck Tail'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Tuck Tail');
  expect(g.player2.active.damage).toBe(60);expect(g.player1.hand.cards).toContain(holon);
 });
});
