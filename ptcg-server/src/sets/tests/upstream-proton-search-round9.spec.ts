import { Card } from '../../game/store/card/card';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { Base64 } from '../../utils/base64';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardTag, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { PlaySupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { TeamRocketsProton } from '../set-destined-rivals/team-rockets-proton';
import { TeamRocketsDiglett } from '../set-ascended-heroes/team-rockets-diglett';
import { Parasect } from '../set-neo-revelation/parasect';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';

class Basic extends PokemonCard { public name='Fixture'; public fullName='Fixture TST'; public set='TST'; public hp=100; public stage=Stage.BASIC; }
class RocketEvolution extends Basic { public stage=Stage.STAGE_1; public tags=[CardTag.TEAM_ROCKET]; }
class MoveBlocker extends Basic {
  public reduceEffect(_store:StoreLike,state:State,effect:Effect):State {
    if(effect instanceof MoveCardsEffect && effect.sourceCard instanceof TeamRocketsProton) effect.preventDefault=true;
    return state;
  }
}
class MoveRedirector extends Basic {
  public reduceEffect(_store:StoreLike,state:State,effect:Effect):State {
    if(effect instanceof MoveCardsEffect && effect.sourceCard instanceof TeamRocketsProton) effect.destination=state.players[0].lostzone;
    return state;
  }
}
function setup() {
  const state=new State(), player=new Player(), opponent=new Player(), supporter=new TeamRocketsProton();
  player.id=1; opponent.id=2; state.players=[player,opponent]; state.turn=2; state.phase=GamePhase.PLAYER_TURN; state.activePlayer=0;
  player.active.cards=[new Basic()]; opponent.active.cards=[new Basic()];
  const a=new TeamRocketsDiglett(), b=new TeamRocketsDiglett(), c=new TeamRocketsDiglett(), ordinary=new Basic(), evolution=new RocketEvolution(), energy=new WaterEnergy();
  player.deck.cards=[a,b,c,ordinary,evolution,energy]; player.deck.cards.forEach((card,index)=>card.id=index+1); supporter.id=100; player.hand.cards=[supporter];
  const store=new Store({onStateChange:()=>undefined}); store.state=state;
  const moves:MoveCardsEffect[]=[]; const reduce=store.reduceEffect.bind(store);
  spyOn(store,'reduceEffect').and.callFake((s:State,e:any)=>{ if(e instanceof MoveCardsEffect) moves.push(e); return reduce(s,e); });
  store.reduceEffect(state,new PlaySupporterEffect(player,supporter));
  return {state,player,opponent,supporter,store,a,b,c,ordinary,evolution,energy,moves};
}
function pending<T>(x:ReturnType<typeof setup>,ctor:new (...args:any[])=>T) { return x.state.prompts.find(p=>p instanceof ctor && p.result===undefined) as unknown as T|undefined; }
function send(x:ReturnType<typeof setup>,prompt:any,result:any) { (x.store as any).reducePrompt(x.state,new ResolvePromptAction(prompt.id,result)); }
function select(x:ReturnType<typeof setup>,cards:Card[]) { const prompt=pending(x,ChooseCardsPrompt)!; expect(prompt.validate(cards)).toBe(true); send(x,prompt,cards); }

describe('Team Rocket’s Proton search sequencing',()=>{
  it('reveals three different physical Basic Rocket Pokémon before moving or shuffling',()=>{
    const x=setup(); select(x,[x.a,x.b,x.c]);
    const show=pending(x,ShowCardsPrompt)!; expect(show).toBeDefined(); expect(show.playerId).toBe(x.opponent.id); expect(show.cards).toEqual([x.a,x.b,x.c]);
    expect(x.moves.length).toBe(0); expect(x.player.deck.cards).toContain(x.a); expect(x.player.hand.cards.length).toBe(0); expect(pending(x,ShuffleDeckPrompt)).toBeUndefined();
    send(x,show,true); expect(x.player.hand.cards).toEqual([x.a,x.b,x.c]); expect(x.player.deck.cards).toEqual([x.ordinary,x.evolution,x.energy]);
    expect(x.moves.length).toBe(1); expect(x.moves[0].sourceCard).toBe(x.supporter); expect(x.moves[0].sourceEffect instanceof TrainerEffect).toBe(true);
    const shuffle=pending(x,ShuffleDeckPrompt)!; expect(shuffle).toBeDefined(); send(x,shuffle,[2,0,1]);
    expect(x.player.deck.cards).toEqual([x.energy,x.ordinary,x.evolution]); expect(x.player.supporter.cards).not.toContain(x.supporter); expect(x.player.discard.cards).toContain(x.supporter);
    expect(x.player.supporterTurn).toBe(1); expect(x.player.rocketSupporter).toBe(true);
  });
  it('permits failing the private search and still shuffles',()=>{
    const x=setup(); select(x,[]); expect(pending(x,ShowCardsPrompt)).toBeUndefined(); expect(pending(x,ShuffleDeckPrompt)).toBeDefined(); expect(x.player.deck.cards.length).toBe(6);
  });
  it('rejects non-Rocket Basics and Rocket evolutions in the prompt',()=>{
    const x=setup(), prompt=pending(x,ChooseCardsPrompt)!;
    expect(prompt.validate([x.ordinary])).toBe(false); expect(prompt.validate([x.evolution])).toBe(false); expect(prompt.validate([x.energy])).toBe(false);
    expect(prompt.validate([x.a,x.b,x.c])).toBe(true);
  });
  it('rejects duplicate, stale and malformed selections without moving cards and allows retry',()=>{
    const x=setup(), prompt=pending(x,ChooseCardsPrompt)!;
    expect(()=>send(x,prompt,[x.a,x.a])).toThrow(); expect(prompt.result).toBeUndefined(); expect(x.player.deck.cards).toContain(x.a);
    const stale=new TeamRocketsDiglett(); expect(()=>send(x,prompt,[stale])).toThrow(); expect(prompt.result).toBeUndefined();
    expect(()=>send(x,prompt,null)).toThrow(); expect(prompt.result).toBeUndefined();
    expect(()=>send(x,prompt,[x.ordinary])).toThrow(); expect(prompt.result).toBeUndefined();
    send(x,prompt,[x.a]); expect(pending(x,ShowCardsPrompt)).toBeDefined();
  });
  it('reveals and then shuffles even when movement is prevented',()=>{
    const x=setup(), slot=new PokemonCardList(); slot.cards=[new MoveBlocker()]; x.opponent.bench.push(slot); select(x,[x.a]);
    const show=pending(x,ShowCardsPrompt)!; expect(show.cards).toEqual([x.a]); expect(x.player.deck.cards).toContain(x.a);
    send(x,show,true); expect(x.player.deck.cards).toContain(x.a); expect(x.player.hand.cards).not.toContain(x.a); expect(pending(x,ShuffleDeckPrompt)).toBeDefined();
  });
  it('reveals before a redirected movement and still shuffles',()=>{
    const x=setup(), slot=new PokemonCardList(); slot.cards=[new MoveRedirector()]; x.opponent.bench.push(slot); select(x,[x.a]);
    const show=pending(x,ShowCardsPrompt)!; expect(x.player.lostzone.cards).not.toContain(x.a); send(x,show,true);
    expect(x.player.lostzone.cards).toContain(x.a); expect(x.player.hand.cards).not.toContain(x.a); expect(pending(x,ShuffleDeckPrompt)).toBeDefined();
  });
  it('works with real Parasect in play',()=>{
    const x=setup(), slot=new PokemonCardList(); slot.cards=[new Parasect()]; x.opponent.bench.push(slot); select(x,[x.a]);
    expect(()=>send(x,pending(x,ShowCardsPrompt)!,true)).not.toThrow(); expect(x.player.hand.cards).toContain(x.a); expect(pending(x,ShuffleDeckPrompt)).toBeDefined();
  });
  it('rejects an empty deck and a second Supporter before changing state',()=>{
    const state=new State(), p=new Player(), o=new Player(), card=new TeamRocketsProton(); p.id=1;o.id=2;state.players=[p,o];state.phase=GamePhase.PLAYER_TURN;p.active.cards=[new Basic()];o.active.cards=[new Basic()];p.hand.cards=[card];
    const store=new Store({onStateChange:()=>undefined});store.state=state;
    expect(()=>store.reduceEffect(state,new PlaySupporterEffect(p,card))).toThrow();expect(p.hand.cards).toContain(card);expect(p.rocketSupporter).toBe(false);
    p.deck.cards=[new Basic()];p.supporterTurn=1;
    expect(()=>store.reduceEffect(state,new PlaySupporterEffect(p,card))).toThrow();expect(p.hand.cards).toContain(card);expect(p.rocketSupporter).toBe(false);
  });
  it('resolves show before shuffle in the actual simulator',()=>{
    ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];
    const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);};
    state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Dummy':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(prize=>add(prize,'Fire Energy SVE'));add(p.deck,'Fire Energy SVE');add(p.active,index?'Squirtle BS':'Charmander BS');});
    add(state.players[0].deck,"Team Rocket's Diglett ASC");add(state.players[0].hand,"Team Rocket's Proton DRI");
    const simulator=new ClientSimulator();simulator.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});
    simulator.dispatch(new PlayCardAction(1,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BOARD,index:0}));
    const search=simulator.state.prompts.find(p=>p instanceof ChooseCardsPrompt && p.result===undefined) as ChooseCardsPrompt;expect(search).toBeDefined();
    const index=simulator.state.players[0].deck.cards.findIndex(c=>c.name==="Team Rocket's Diglett");expect(index).toBeGreaterThan(-1);
    const arbiter=(simulator as any).arbiter, resolve=arbiter.resolvePrompt.bind(arbiter), seen:string[]=[];
    spyOn(arbiter,'resolvePrompt').and.callFake((s:State,prompt:any)=>{seen.push(prompt.type);return resolve(s,prompt);});
    simulator.resolvePrompt(search.id,[index]);expect(seen.indexOf('Show cards')).toBeGreaterThan(-1);expect(seen.indexOf('Shuffle deck')).toBeGreaterThan(seen.indexOf('Show cards'));
    expect(simulator.state.players[0].hand.cards.some(c=>c.name==="Team Rocket's Diglett")).toBe(true);expect(simulator.state.players[0].discard.cards.some(c=>c.name==="Team Rocket's Proton")).toBe(true);
    expect(simulator.state.players[0].supporterTurn).toBe(1);simulator.cleanup();
  });
  it('can still be played on the first turn in the actual simulator',()=>{
    ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=1;state.players=[new Player(),new Player()];
    const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);};
    state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Dummy':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(prize=>add(prize,'Fire Energy SVE'));add(p.deck,'Fire Energy SVE');add(p.active,index?'Squirtle BS':'Charmander BS');});
    add(state.players[0].deck,"Team Rocket's Diglett ASC");add(state.players[0].hand,"Team Rocket's Proton DRI");
    const simulator=new ClientSimulator();simulator.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});
    expect(()=>simulator.dispatch(new PlayCardAction(1,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BOARD,index:0}))).not.toThrow();
    expect(simulator.state.prompts.some(p=>p instanceof ChooseCardsPrompt && p.result===undefined)).toBe(true);
    expect(simulator.state.players[0].supporterTurn).toBe(1);simulator.cleanup();
  });
});
