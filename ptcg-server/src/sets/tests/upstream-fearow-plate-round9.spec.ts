import { CardTag, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { AttackEffect, MoveCardsEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { Fearow } from '../set-ex-crystal-guardians/fearow';
import { MysteryPlateAlpha } from '../set-skyridge/mystery-plate-alpha';
import { PremierBall } from '../set-great-encounters/premier-ball';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';
import { Parasect } from '../set-neo-revelation/parasect';
class Basic extends PokemonCard { public name='Fixture'; public fullName='Fixture TST'; public set='TST'; public hp=100; public stage=Stage.BASIC; }
class Delta extends Basic { public tags=[CardTag.DELTA_SPECIES]; }
function setup() {
  const state=new State(), player=new Player(), opponent=new Player();player.id=1;opponent.id=2;state.players=[player,opponent];state.phase=GamePhase.PLAYER_TURN;state.turn=2;
  player.active.cards=[new Basic()];opponent.active.cards=[new Basic()];
  const store=new Store({onStateChange:()=>undefined});store.state=state;
  const moves:MoveCardsEffect[]=[];const reduce=store.reduceEffect.bind(store);
  spyOn(store,'reduceEffect').and.callFake((s:State,e:any)=>{if(e instanceof MoveCardsEffect) moves.push(e);return reduce(s,e);});
  return {state,player,opponent,store,moves};
}
function pending<T>(x:ReturnType<typeof setup>,ctor:new (...args:any[])=>T) {return x.state.prompts.find(p=>p instanceof ctor && p.result===undefined) as unknown as T|undefined;}
function send(x:ReturnType<typeof setup>,p:any,result:any) {(x.store as any).reducePrompt(x.state,new ResolvePromptAction(p.id,result));}
function fearow() {const x=setup(), card=new Fearow(), delta=new Delta(), energy=new WaterEnergy();card.id=1;delta.id=2;energy.id=3;x.player.active.cards=[card];x.player.deck.cards=[delta,energy];x.store.reduceEffect(x.state,new PowerEffect(x.player,card.powers[0],card));return {...x,card,delta,energy};}
function plate(prizes=6) {const x=setup(), card=new MysteryPlateAlpha(), trainer=new PremierBall(), energy=new WaterEnergy();card.id=4;trainer.id=2;energy.id=3;x.player.active.cards.push(card);x.player.deck.cards=[trainer,energy];x.opponent.prizes=Array.from({length:prizes},()=>{const c=new CardList();c.cards=[new WaterEnergy()];return c;});const effect=new AttackEffect(x.player,x.opponent,card.attacks[0]);x.store.reduceEffect(x.state,effect);return {...x,card,trainer,energy,effect};}
describe('Delta Sign and Desert Burn search sequencing',()=>{
  it('reveals Delta before moving and shuffling with power provenance',()=>{const x=fearow(), p=pending(x,ChooseCardsPrompt)!;expect(p.validate([x.delta])).toBe(true);expect(p.validate([x.energy])).toBe(false);send(x,p,[x.delta]);const show=pending(x,ShowCardsPrompt)!;expect(show.playerId).toBe(x.opponent.id);expect(show.cards).toEqual([x.delta]);expect(x.player.deck.cards).toContain(x.delta);expect(x.moves.length).toBe(0);send(x,show,true);expect(x.player.hand.cards).toContain(x.delta);expect(x.moves[0].sourceCard).toBe(x.card);expect(x.moves[0].sourceEffect).toBe(x.card.powers[0]);expect(pending(x,ShuffleDeckPrompt)).toBeDefined();});
  it('allows fail to find and still shuffles',()=>{const x=fearow();send(x,pending(x,ChooseCardsPrompt)!,[]);expect(pending(x,ShowCardsPrompt)).toBeUndefined();expect(pending(x,ShuffleDeckPrompt)).toBeDefined();});
  it('rejects invalid selections and preserves the once-per-turn marker',()=>{const x=fearow(),p=pending(x,ChooseCardsPrompt)!;for(const cards of [[x.energy],[new Delta()],[x.delta,x.delta]]){expect(()=>send(x,p,cards)).toThrow();expect(p.result).toBeUndefined();}send(x,p,[]);const second=new Fearow(),bench=new PokemonCardList();bench.cards=[second];x.player.bench.push(bench);expect(()=>x.store.reduceEffect(x.state,new PowerEffect(x.player,second.powers[0],second))).toThrow();});
  it('reveals the Trainer before moving and shuffling with the actual attacker as source',()=>{const x=plate(),p=pending(x,ChooseCardsPrompt)!;expect(p.validate([x.trainer])).toBe(true);expect(p.validate([x.energy])).toBe(false);send(x,p,[x.trainer]);const show=pending(x,ShowCardsPrompt)!;expect(show.playerId).toBe(x.opponent.id);expect(x.player.deck.cards).toContain(x.trainer);expect(x.moves.length).toBe(0);send(x,show,true);expect(x.player.hand.cards).toContain(x.trainer);expect(x.moves[0].sourceCard).toBe(x.player.active.getPokemonCard());expect(x.moves[0].sourceEffect).toBe(x.effect);expect(pending(x,ShuffleDeckPrompt)).toBeDefined();});
  it('shuffles after choosing no Trainer and rejects invalid cards',()=>{const x=plate(),p=pending(x,ChooseCardsPrompt)!;for(const cards of [[x.energy],[new PremierBall()],[x.trainer,x.trainer]]){expect(()=>send(x,p,cards)).toThrow();expect(p.result).toBeUndefined();}send(x,p,[]);expect(pending(x,ShowCardsPrompt)).toBeUndefined();expect(pending(x,ShuffleDeckPrompt)).toBeDefined();});
  it('searches with exactly five prizes left',()=>{const x=plate(5);expect(pending(x,ChooseCardsPrompt)).toBeDefined();});
  it('inflicts all three conditions with exactly one prize left',()=>{const x=plate(1);expect(pending(x,ChooseCardsPrompt)).toBeUndefined();expect(x.opponent.active.specialConditions).toContain(SpecialCondition.PARALYZED);expect(x.opponent.active.specialConditions).toContain(SpecialCondition.POISONED);expect(x.opponent.active.specialConditions).toContain(SpecialCondition.BURNED);});
  it('does not search with four prizes left',()=>{const x=plate(4);expect(pending(x,ChooseCardsPrompt)).toBeUndefined();});
  it('does not let Parasect block a deck search',()=>{const x=plate(),slot=new PokemonCardList();slot.cards=[new Parasect()];x.opponent.bench.push(slot);send(x,pending(x,ChooseCardsPrompt)!,[x.trainer]);send(x,pending(x,ShowCardsPrompt)!,true);expect(x.player.hand.cards).toContain(x.trainer);});
});
