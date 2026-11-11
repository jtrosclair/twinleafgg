import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { SuperType } from '../../game/store/card/card-types';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType,SlotType } from '../../game/store/actions/play-card-action';
import { getCardByName,padDeck,setupGame } from './test-helpers';
describe('Pokemon-as-Energy snapshot-diff restoration',()=>{
 for(const name of ["Holon's Magnemite DS",'Charjabug UNB'])it(name+' survives encoded attach diff without mutating same-print hand card',()=>{
  const g=setupGame({turn:2,player1:{active:{card:'Vikavolt SUM',energy:['Fire Energy SVE','Fire Energy SVE']},hand:[name,name],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  const all=Array.from(new Set(g.state.players.flatMap(p=>[...p.active.cards,...p.bench.flatMap(s=>s.cards),...p.hand.cards,...p.deck.cards,...p.discard.cards,...p.prizes.flatMap(s=>s.cards)])));
  all.forEach((c,i)=>c.id=i);g.state.cardNames=all.map(c=>c.fullName);StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());const serializer=new StateSerializer(),base=serializer.serialize(g.state);
  const physical=g.player1.hand.cards[0],same=g.player1.hand.cards[1];g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}]);g.store.dispatch(new UseAbilityAction(g.player1.id,physical.powers[0].name,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.HAND,index:0}));
  const diff=serializer.serializeDiff(base,g.store.state),restored=serializer.deserializeDiff(base,diff),card=restored.players[0].active.energies.cards.find(c=>c.id===physical.id)!;
  expect(card).toBeDefined();expect(card.superType).toBe(SuperType.ENERGY);expect(restored.players[0].active.cards).toContain(card);expect(restored.players[0].hand.cards.find(c=>c.id===same.id)!.superType).toBe(SuperType.POKEMON);
  expect(getCardByName(name).superType).toBe(SuperType.POKEMON);
 });
});
