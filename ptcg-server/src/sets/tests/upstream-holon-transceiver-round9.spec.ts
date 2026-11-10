import { Card } from '../../game/store/card/card';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { ClientSimulator } from '../../client/simulator';
import { ensureClientCards } from '../../client/cards';
import { Base64 } from '../../utils/base64';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { PlayItemEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { SelectOptionPrompt } from '../../game/store/prompts/select-option-prompt';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { HolonTransceiver } from '../set-ex-delta-species/holon-transceiver';
import { HolonFarmer } from '../set-ex-delta-species/holon-farmer';
import { TeamRocketsProton } from '../set-destined-rivals/team-rockets-proton';
import { Parasect } from '../set-neo-revelation/parasect';
import { PokemonTower } from '../set-wotc-promos/pokemon-tower';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';

class Basic extends PokemonCard { public name='Fixture'; public fullName='Fixture TST'; public set='TST'; public hp=100; public stage=Stage.BASIC; }
class MoveBlocker extends Basic { public reduceEffect(_s:StoreLike,state:State,effect:Effect):State {if(effect instanceof MoveCardsEffect && effect.sourceCard instanceof HolonTransceiver) effect.preventDefault=true; return state;} }
function setup(mode:'both'|'deck'|'discard'='both') {
  const state=new State(), player=new Player(), opponent=new Player(), item=new HolonTransceiver();
  player.id=1;opponent.id=2;state.players=[player,opponent];state.turn=2;state.phase=GamePhase.PLAYER_TURN;state.activePlayer=0;
  player.active.cards=[new Basic()];opponent.active.cards=[new Basic()];
  const fromDeck=new HolonFarmer(),fromDiscard=new HolonFarmer(),other=new TeamRocketsProton(),otherItem=new HolonTransceiver(),energy=new WaterEnergy();
  player.deck.cards=mode==='discard'?[]:[fromDeck,other,otherItem,energy];player.discard.cards=mode==='deck'?[]:[fromDiscard];player.hand.cards=[item];
  [...player.deck.cards,...player.discard.cards,item].forEach((c,i)=>c.id=i+1);
  const store=new Store({onStateChange:()=>undefined});store.state=state;
  const moves:MoveCardsEffect[]=[];const reduce=store.reduceEffect.bind(store);
  spyOn(store,'reduceEffect').and.callFake((s:State,e:any)=>{if(e instanceof MoveCardsEffect) moves.push(e);return reduce(s,e);});
  store.reduceEffect(state,new PlayItemEffect(player,item));
  return {state,player,opponent,item,fromDeck,fromDiscard,other,otherItem,energy,store,moves};
}
function pending<T>(x:ReturnType<typeof setup>,ctor:new (...args:any[])=>T) {return x.state.prompts.find(p=>p instanceof ctor && p.result===undefined) as unknown as T|undefined;}
function send(x:ReturnType<typeof setup>,p:any,result:any) {(x.store as any).reducePrompt(x.state,new ResolvePromptAction(p.id,result));}
function choose(x:ReturnType<typeof setup>,card:Card) {const p=pending(x,ChooseCardsPrompt)!;expect(p.validate([card])).toBe(true);send(x,p,[card]);}

describe('Holon Transceiver search sequencing',()=>{
  it('offers deck or discard and reveals the deck choice before moving and shuffling',()=>{
    const x=setup(), option=pending(x,SelectOptionPrompt)!;expect(option).toBeDefined();expect(option.options.allowCancel).toBe(false);send(x,option,0);
    const prompt=pending(x,ChooseCardsPrompt)!;expect(prompt.validate([x.fromDeck])).toBe(true);expect(prompt.validate([x.other])).toBe(false);expect(prompt.validate([x.otherItem])).toBe(false);choose(x,x.fromDeck);
    const show=pending(x,ShowCardsPrompt)!;expect(show.cards).toEqual([x.fromDeck]);expect(show.playerId).toBe(x.opponent.id);expect(x.player.deck.cards).toContain(x.fromDeck);expect(x.moves.length).toBe(0);expect(pending(x,ShuffleDeckPrompt)).toBeUndefined();
    send(x,show,true);expect(x.player.hand.cards).toContain(x.fromDeck);const move=x.moves.find(m=>m.source===x.player.deck)!;expect(move.sourceCard).toBe(x.item);expect(move.sourceEffect instanceof TrainerEffect).toBe(true);
    const shuffle=pending(x,ShuffleDeckPrompt)!;expect(shuffle).toBeDefined();const order=x.player.deck.cards.map((_c,i)=>i);send(x,shuffle,order);expect(x.player.discard.cards).toContain(x.item);
  });
  it('reveals a discard choice before moving, and does not shuffle',()=>{
    const x=setup();send(x,pending(x,SelectOptionPrompt)!,1);choose(x,x.fromDiscard);const show=pending(x,ShowCardsPrompt)!;
    expect(show.cards).toEqual([x.fromDiscard]);expect(x.player.discard.cards).toContain(x.fromDiscard);send(x,show,true);
    expect(x.player.hand.cards).toContain(x.fromDiscard);expect(pending(x,ShuffleDeckPrompt)).toBeUndefined();expect(x.player.discard.cards).toContain(x.item);
  });
  it('uses the discard branch directly when the deck is empty, requiring one card',()=>{
    const x=setup('discard');expect(pending(x,SelectOptionPrompt)).toBeUndefined();const p=pending(x,ChooseCardsPrompt)!;expect(p.validate([])).toBe(false);choose(x,x.fromDiscard);
    send(x,pending(x,ShowCardsPrompt)!,true);expect(x.player.hand.cards).toContain(x.fromDiscard);expect(pending(x,ShuffleDeckPrompt)).toBeUndefined();
  });
  it('allows a failed private deck search but still shuffles',()=>{
    const x=setup('deck'), p=pending(x,ChooseCardsPrompt)!;expect(p.validate([])).toBe(true);send(x,p,[]);
    expect(pending(x,ShowCardsPrompt)).toBeUndefined();expect(pending(x,ShuffleDeckPrompt)).toBeDefined();
  });
  it('rejects invalid branch selection and lets the same prompt be retried',()=>{
    const x=setup(), p=pending(x,SelectOptionPrompt)!;expect(()=>send(x,p,null)).toThrow();expect(p.result).toBeUndefined();expect(()=>send(x,p,9)).toThrow();expect(p.result).toBeUndefined();
    send(x,p,1);expect(pending(x,ChooseCardsPrompt)).toBeDefined();
  });
  it('rejects stale, wrong-type and multiple selections before reveal and permits retry',()=>{
    const x=setup('deck'), p=pending(x,ChooseCardsPrompt)!;
    for(const cards of [[new HolonFarmer()],[x.other],[x.otherItem],[x.fromDeck,x.fromDeck]]) {expect(()=>send(x,p,cards)).toThrow();expect(p.result).toBeUndefined();}
    expect(x.player.deck.cards).toContain(x.fromDeck);expect(pending(x,ShowCardsPrompt)).toBeUndefined();send(x,p,[x.fromDeck]);expect(pending(x,ShowCardsPrompt)).toBeDefined();
  });
  it('rejects when neither a deck nor an eligible discard card exists',()=>{
    const state=new State(),p=new Player(),o=new Player(),card=new HolonTransceiver();p.id=1;o.id=2;state.players=[p,o];state.phase=GamePhase.PLAYER_TURN;p.active.cards=[new Basic()];o.active.cards=[new Basic()];p.hand.cards=[card];p.discard.cards=[new WaterEnergy()];const store=new Store({onStateChange:()=>undefined});store.state=state;
    expect(()=>store.reduceEffect(state,new PlayItemEffect(p,card))).toThrow();expect(state.prompts.length).toBe(0);
  });
  it('Pokemon Tower blocks the discard-to-hand move after the reveal',()=>{
    const x=setup();x.player.stadium.cards=[new PokemonTower()];send(x,pending(x,SelectOptionPrompt)!,1);choose(x,x.fromDiscard);
    const show=pending(x,ShowCardsPrompt)!;expect(show.cards).toEqual([x.fromDiscard]);send(x,show,true);expect(x.player.discard.cards).toContain(x.fromDiscard);expect(x.player.hand.cards).not.toContain(x.fromDiscard);
  });
  it('real Parasect does not block a Trainer effect from the discard pile',()=>{
    const x=setup();const slot=new PokemonCardList();slot.cards=[new Parasect()];x.opponent.bench.push(slot);send(x,pending(x,SelectOptionPrompt)!,1);choose(x,x.fromDiscard);
    expect(()=>send(x,pending(x,ShowCardsPrompt)!,true)).not.toThrow();expect(x.player.hand.cards).toContain(x.fromDiscard);
  });
  it('still shuffles a deck after a revealed move is prevented',()=>{
    const x=setup('deck'),slot=new PokemonCardList();slot.cards=[new MoveBlocker()];x.opponent.bench.push(slot);choose(x,x.fromDeck);
    const show=pending(x,ShowCardsPrompt)!;expect(show.cards).toEqual([x.fromDeck]);send(x,show,true);expect(x.player.deck.cards).toContain(x.fromDeck);expect(x.player.hand.cards).not.toContain(x.fromDeck);expect(pending(x,ShuffleDeckPrompt)).toBeDefined();
  });
  it('resolves the deck branch in the actual local simulator in reveal-then-shuffle order',()=>{
    ensureClientCards();const state=new State();state.phase=GamePhase.PLAYER_TURN;state.turn=2;state.players=[new Player(),new Player()];
    const add=(list:CardList,name:string)=>{const card=CardManager.getInstance().getCardByName(name)!;card.id=state.cardNames.length;state.cardNames.push(card.fullName);list.cards.push(card);};
    state.players.forEach((p,index)=>{p.id=index+1;p.name=index?'Dummy':'Player';p.bench=Array.from({length:5},()=>new PokemonCardList());p.prizes=Array.from({length:6},()=>new CardList());p.prizes.forEach(prize=>add(prize,'Fire Energy SVE'));add(p.deck,'Fire Energy SVE');add(p.active,index?'Squirtle BS':'Charmander BS');});
    add(state.players[0].deck,'Holon Farmer DS');add(state.players[0].hand,'Holon Transceiver DS');
    const sim=new ClientSimulator();sim.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});sim.dispatch(new PlayCardAction(1,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BOARD,index:0}));
    const search=sim.state.prompts.find(p=>p instanceof ChooseCardsPrompt && p.result===undefined) as ChooseCardsPrompt;expect(search).toBeDefined();const index=sim.state.players[0].deck.cards.findIndex(c=>c.name==='Holon Farmer');expect(index).toBeGreaterThan(-1);
    const arbiter=(sim as any).arbiter,resolve=arbiter.resolvePrompt.bind(arbiter),seen:string[]=[];spyOn(arbiter,'resolvePrompt').and.callFake((s:State,p:any)=>{seen.push(p.type);return resolve(s,p);});
    sim.resolvePrompt(search.id,[index]);expect(seen.indexOf('Show cards')).toBeGreaterThan(-1);expect(seen.indexOf('Shuffle deck')).toBeGreaterThan(seen.indexOf('Show cards'));
    expect(sim.state.players[0].hand.cards.some(c=>c.name==='Holon Farmer')).toBe(true);expect(sim.state.players[0].discard.cards.some(c=>c.name==='Holon Transceiver')).toBe(true);sim.cleanup();
  });
});
