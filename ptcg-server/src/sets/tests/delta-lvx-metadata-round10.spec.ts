import { CardTag, Stage } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { Fearow } from '../set-ex-crystal-guardians/fearow';
import { Dragonite } from '../set-ex-delta-species/dragonite';
import { Meowth } from '../set-ex-holon-phantoms/meowth';
import { StaraptorFB } from '../set-supreme-victors/staraptor-fb';
import { StaraptorFBLVX } from '../set-supreme-victors/staraptor-fb-lv-x';
import { PremierBall } from '../set-great-encounters/premier-ball';
import { WaterEnergy } from '../set-scarlet-and-violet-energy/water-energy';

function game() {
  const state=new State(), player=new Player(), opponent=new Player();
  player.id=1;opponent.id=2;state.players=[player,opponent];state.phase=GamePhase.PLAYER_TURN;state.turn=3;
  player.active.cards=[new Fearow()];opponent.active.cards=[new StaraptorFB()];
  const store=new Store({onStateChange:()=>undefined});store.state=state;
  return {state,player,opponent,store};
}
function pending<T>(x:ReturnType<typeof game>,ctor:new (...args:any[])=>T) {return x.state.prompts.find(p=>p instanceof ctor && p.result===undefined) as unknown as T;}
function send(x:ReturnType<typeof game>,p:any,result:any) {(x.store as any).reducePrompt(x.state,new ResolvePromptAction(p.id,result));}

describe('Delta Sign and Premier Ball real-card classification',()=>{
  for (const CardClass of [Dragonite,Meowth]) {
    it('finds and retrieves '+CardClass.name+' using Delta Sign',()=>{
      const x=game(), source=x.player.active.getPokemonCard() as Fearow, card=new CardClass(), other=new StaraptorFB();
      card.id=1;other.id=2;x.player.deck.cards=[card,other];
      x.store.reduceEffect(x.state,new PowerEffect(x.player,source.powers[0],source));
      const choose=pending(x,ChooseCardsPrompt);expect(card.tags).toContain(CardTag.DELTA_SPECIES);
      expect(choose.validate([card])).toBe(true);expect(choose.validate([other])).toBe(false);
      send(x,choose,[card]);const show=pending(x,ShowCardsPrompt);expect(show.cards).toEqual([card]);send(x,show,true);
      expect(x.player.hand.cards).toContain(card);
    });
  }
  for (const zone of ['deck','discard'] as const) {
    it('retrieves Staraptor FB Lv. X from the '+zone+' with Premier Ball',()=>{
      const x=game(), card=new StaraptorFBLVX(), item=new PremierBall();card.id=1;item.id=2;
      x.player.hand.cards=[item];if(zone==='deck'){x.player.deck.cards=[card,new WaterEnergy()];}else{x.player.discard.cards=[card];}
      x.store.reduceEffect(x.state,new PlayItemEffect(x.player,item));const choose=pending(x,ChooseCardsPrompt);
      expect(choose).toBeDefined();expect(choose.validate([card])).toBe(true);send(x,choose,[card]);
      const show=pending(x,ShowCardsPrompt);expect(show.cards).toEqual([card]);send(x,show,true);
      expect(x.player.hand.cards).toContain(card);expect(card.stage).toBe(Stage.LV_X);
      expect(card.tags).toContain(CardTag.POKEMON_LV_X);expect(card.tags).toContain(CardTag.POKEMON_SP);
    });
  }
  it('still levels up only the Active Staraptor FB',()=>{
    const x=game(), card=new StaraptorFBLVX(), base=new StaraptorFB(), bench=new PokemonCardList();
    x.player.active.cards=[base];x.player.hand.cards=[card];x.player.canEvolve=true;x.player.active.pokemonPlayedTurn=1;
    x.store.reduceEffect(x.state,new PlayPokemonEffect(x.player,card,x.player.active));expect(x.player.active.cards).toContain(card);
    const y=game(), benchCard=new StaraptorFBLVX();bench.cards=[new StaraptorFB()];bench.pokemonPlayedTurn=1;y.player.bench=[bench];y.player.hand.cards=[benchCard];
    expect(()=>y.store.reduceEffect(y.state,new PlayPokemonEffect(y.player,benchCard,bench))).toThrow();expect(bench.cards).not.toContain(benchCard);
  });
});
