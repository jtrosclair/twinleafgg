import { ensureClientCards } from '../../client/cards';
import { CardTag } from '../../game/store/card/card-types';
import { PlayerType,SlotType,PlayCardAction } from '../../game/store/actions/play-card-action';
import { getCardByName,padDeck,setupGame } from './test-helpers';
import { playTrainerCard,useAbility,useAttack } from './card-test-helpers';
describe('round32 Team Aqua Spheal interactions',()=>{
 beforeAll(()=>ensureClientCards());
 for(const team of [true,false])it('Aqua Energy attaches only to Team Aqua Pokemon, team='+team,()=>{
  const g=setupGame({turn:3,player1:{active:{card:team?"Team Aqua's Spheal DCR":'Squirtle BS'},hand:['Aqua Energy MA'],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});const energy=g.player1.hand.cards[0];
  const play=()=>g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
  if(team){expect(g.player1.active.getPokemonCard()!.tags).toContain(CardTag.TEAM_AQUA);expect(play).not.toThrow();expect(g.store.state.players[0].active.cards).toContain(energy)}else{expect(play).toThrow();expect(g.store.state.players[0].hand.cards.some(c=>c.fullName==='Aqua Energy MA')).toBe(true)}
 });
 for(const copied of [false,true])it('Spheal Water Gun respects Choice Belt against V, copied='+copied,()=>{
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':"Team Aqua's Spheal DCR",energy:['Water Energy SVE']},bench:copied?[{card:"Team Aqua's Spheal DCR"}]:[],deck:padDeck(12)},player2:{active:{card:'Mew V FST'},deck:padDeck(12)}});const t=g.player2.active.getPokemonCard()!;t.hp=1000;t.weakness=[];t.resistance=[];g.player1.active.tools.push(getCardByName('Choice Belt BRS'));
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Water Gun'}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,'Water Gun');expect(g.player2.active.damage).toBe(40);
 });
});
