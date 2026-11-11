import { CardManager } from '../../game/cards/card-manager';
import { AttachEnergyPrompt, AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { padDeck, setupGame } from './test-helpers';
import { useAbility } from './card-test-helpers';
import { Magmortar } from '../set-delta-reign/magmortar';
import { Electivire } from '../set-delta-reign/electivire';
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
beforeAll(() => { const cm = CardManager.getInstance(); for (const c of [new Magmortar(), new Electivire()]) if (!cm.isCardDefined(c.fullName)) cm.defineSet([c]); });
function create() {
  return setupGame({turn:3,player1:{active:{card:'Magmortar M6'},bench:[{card:'Electivire M6'}],hand:['Fire Energy SVE','Lightning Energy SVE','Nitro Fire Energy M4','Water Energy SVE','Fire Energy SVE'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
}
it('rejects Special and other Energy but permits one Basic Fire and one Basic Lightning', () => {
  const g=create();
  g.overridePrompt(AttachEnergyPromptType,p=>{
    const prompt=p as AttachEnergyPrompt;
    const valid=(result:any)=>prompt.validate(prompt.decode(result,g.state));
    expect(()=>valid([{index:2,to:active}])).toThrow();
    expect(()=>valid([{index:3,to:active}])).toThrow();
    expect(valid([{index:0,to:active},{index:4,to:bench}])).toBe(false);
    expect(valid([{index:0,to:active},{index:1,to:bench}])).toBe(true);
    return [{index:0,to:active},{index:1,to:bench}];
  });
  const fire=g.player1.hand.cards[0], lightning=g.player1.hand.cards[1];
  useAbility(g.store,g.state,0,'Buddy Boost');
  expect(g.player1.active.cards).toContain(fire); expect(g.player1.bench[0].cards).toContain(lightning);
  expect(g.player1.energyPlayedTurn).not.toBe(g.state.turn);
});
it('rejects a submitted Special Energy through prompt decode and validation', () => {
  const g=create();g.overridePrompt(AttachEnergyPromptType,()=>[{index:2,to:active}]);
  expect(()=>useAbility(g.store,g.state,0,'Buddy Boost')).toThrow();
});
