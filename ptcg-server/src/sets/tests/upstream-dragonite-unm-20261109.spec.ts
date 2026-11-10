import { CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { Dragonite } from '../set-unified-minds/dragonite';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { LightningEnergy } from '../set-scarlet-and-violet-energy/lightning-energy';
import { FireEnergy } from '../set-scarlet-and-violet-energy/fire-energy';

class TestMon extends PokemonCard { public name='Test'; public fullName='Test TST'; public set='TST'; public hp=200; }
function battle() {
  const state=new State(), player=new Player(), opponent=new Player(), dragonite=new Dragonite();
  player.id=1; opponent.id=2; state.players=[player,opponent]; state.activePlayer=0; state.phase=GamePhase.PLAYER_TURN; state.turn=3;
  player.active.cards=[dragonite,new FireEnergy()]; opponent.active.cards=[new TestMon()];
  const b=new PokemonCardList();b.cards=[new TestMon()];player.bench=[b];
  const store=new Store({onStateChange:()=>undefined});store.state=state;
  const power=()=>store.reduceEffect(state,new PowerEffect(player,dragonite.powers[0],dragonite));
  return {state,player,dragonite,store,power};
}
function pending(state:State):AttachEnergyPrompt { return state.prompts.find(x=>x instanceof AttachEnergyPrompt && x.result===undefined) as AttachEnergyPrompt; }
function resolve(store:Store,state:State,prompt:AttachEnergyPrompt,raw:any) {
  const result=prompt.decode(raw,state); if(!prompt.validate(result)) throw new Error('Invalid selection');
  (store as any).reducePrompt(state,new ResolvePromptAction(prompt.id,result));
}
describe('Upstream Dragonite UNM Hurricane Charge compatibility',()=>{
  it('blocks non-water/lightning cards based on the hand, not attached-energy positions',()=>{
    const {state,player,power}=battle(); player.hand.cards=[new FireEnergy(),new WaterEnergy(),new LightningEnergy()];
    power(); const p=pending(state);expect(p).toBeDefined();expect(p.options.blocked).toContain(0);expect(p.options.blocked).not.toContain(1);expect(p.options.blocked).not.toContain(2);
  });
  it('rejects selecting two Energy of the same type',()=>{
    const {state,player,power}=battle();player.hand.cards=[new WaterEnergy(),new WaterEnergy(),new LightningEnergy()];power();const p=pending(state);
    const t={player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0};
    const selected=p.decode([{index:0,to:t},{index:1,to:t}],state);
    expect(p.validate(selected)).toBe(false);
  });
  it('allows one Water and one Lightning to different Pokemon and uses ability once',()=>{
    const {state,player,dragonite,store,power}=battle();const w=new WaterEnergy(),l=new LightningEnergy();player.hand.cards=[w,l];power();const p=pending(state);
    resolve(store,state,p,[{index:0,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}},{index:1,to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}}]);
    expect(player.active.cards).toContain(w);expect(player.bench[0].cards).toContain(l);expect(player.hand.cards).not.toContain(w);expect(player.hand.cards).not.toContain(l);
    player.hand.cards=[new WaterEnergy()];expect(()=>power()).toThrow();
    state.phase=GamePhase.FINISHED;store.reduceEffect(state,new EndTurnEffect(player));expect(player.marker.hasMarker(dragonite.HURRICANE_CHARGE_MARKER,dragonite)).toBe(false);
  });
  it('offers optional cancellation and does not attach cards when declined',()=>{
    const {state,player,store,power}=battle();const w=new WaterEnergy();player.hand.cards=[w];power();const p=pending(state);
    expect(p.options.allowCancel).toBe(true);expect(p.options.min).toBe(0);resolve(store,state,p,null);expect(player.hand.cards).toContain(w);expect(player.active.cards).not.toContain(w);
  });
  it('preserves the existing reset when this card returns to play',()=>{
    const {state,player,dragonite,store,power}=battle();player.hand.cards=[new WaterEnergy()];power();resolve(store,state,pending(state),null);
    expect(player.marker.hasMarker(dragonite.HURRICANE_CHARGE_MARKER,dragonite)).toBe(true);
    dragonite.reduceEffect(store,state,new PlayPokemonEffect(player,dragonite,player.active));
    expect(player.marker.hasMarker(dragonite.HURRICANE_CHARGE_MARKER,dragonite)).toBe(false);
    expect(()=>power()).not.toThrow();
    expect(pending(state)).toBeDefined();
  });
});
