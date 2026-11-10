import { CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Power } from '../../game/store/card/pokemon-types';
import { PlayerType, SlotType, PlayCardAction } from '../../game/store/actions/play-card-action';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { CAN_PLAY_POKEMON_CARD } from '../../game/store/prefabs/prefabs';
import { CheckPokemonPlayedTurnEffect } from '../../game/store/effects/check-effects';
import { StadiumEffect } from '../../game/store/effects/play-card-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State, StateUtils, StoreLike } from '../../game';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { Shiftry } from '../set-steam-siege/shiftry';
import { LushForest } from '../set-mega-evolution/forest-of-vitality';
import { Lunatone } from '../set-obsidian-flames/lunatone';
import { Solrock } from '../set-pokemon-go/solrock';
import { Garbodor } from '../set-dragons-exalted/garbodor';

function gameWithForest(turn = 3) {
  const game = setupGame({turn, player1: {active:{card:'Bulbasaur BS'}, bench:[{card:'Charmander BS'}], hand:['Ivysaur BS','Venusaur BS','Charmeleon BS'],deck:padDeck(10)}, player2:{active:{card:'Ralts SIT'},deck:padDeck(10)}});
  game.player1.canEvolve = turn > 2;
  game.player1.active.pokemonPlayedTurn = turn;
  game.player1.bench[0].pokemonPlayedTurn = turn;
  const stadium = new LushForest();
  stadium.id = 9001;
  game.player1.stadium.cards = [stadium];
  return game;
}
function play(game: ReturnType<typeof gameWithForest>, fullName: string, bench = false) {
  const index=game.player1.hand.cards.findIndex(c=>c.fullName===fullName);
  expect(index).toBeGreaterThanOrEqual(0);
  game.store.dispatch(new PlayCardAction(game.player1.id,index,{player:PlayerType.BOTTOM_PLAYER,slot:bench?SlotType.BENCH:SlotType.ACTIVE,index:0}));
}
function playable(game: ReturnType<typeof gameWithForest>, fullName: string) {
  const card=game.player1.hand.cards.find(c=>c.fullName===fullName) as PokemonCard;
  return CAN_PLAY_POKEMON_CARD(game.store,game.state,game.player1,card);
}
describe('Forest of Vitality same-turn evolution',()=>{
  it('treats New Moon as an automatic passive, not a clickable power',()=>{
    expect((new Lunatone().powers[0] as Power).useWhenInPlay).not.toBe(true);
    const g=gameWithForest(), moon=new Lunatone();moon.id=9005;g.player1.bench[1].cards=[moon];
    expect(()=>g.store.dispatch(new UseAbilityAction(g.player1.id,'New Moon',{
      player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:1
    }))).toThrow();
  });
  it('enables a full same-turn Grass chain and exposes each legal card as playable',()=>{
    const g=gameWithForest();
    expect(playable(g,'Ivysaur BS')).toBe(true);
    play(g,'Ivysaur BS');
    expect(g.player1.active.getPokemonCard()!.name).toBe('Ivysaur');
    const meganium=g.player1.hand.cards.find(c=>c.fullName==='Venusaur BS')!;
    expect(g.player1.playableCardIds).toContain(meganium.id);
    expect(playable(g,'Venusaur BS')).toBe(true);
    play(g,'Venusaur BS');
    expect(g.player1.active.getPokemonCard()!.name).toBe('Venusaur');
    expect(g.player1.active.pokemonPlayedTurn).toBe(g.state.turn);
  });
  it('does not change other Pokemon timestamps or allow a Fire evolution',()=>{
    const g=gameWithForest();
    play(g,'Ivysaur BS');
    expect(g.player1.bench[0].pokemonPlayedTurn).toBe(g.state.turn);
    expect(playable(g,'Charmeleon BS')).toBe(false);
    expect(()=>play(g,'Charmeleon BS',true)).toThrow();
  });
  it('does not permanently change another Grass Pokemon’s played turn',()=>{
    const g=gameWithForest();
    const second=getCardByName('Bulbasaur BS');second.id=9002;
    g.player1.bench[0].cards=[second];
    play(g,'Ivysaur BS');
    expect(g.player1.bench[0].pokemonPlayedTurn).toBe(g.state.turn);
    class FireEvolution extends PokemonCard { public stage=Stage.STAGE_1; public cardType=CardType.FIRE; public evolvesFrom='Bulbasaur'; public name='Fire evolution'; public fullName='Fire evolution TST'; public set='TST'; }
    const evolution=new FireEvolution();evolution.id=9003;g.player1.hand.cards.push(evolution);
    expect(CAN_PLAY_POKEMON_CARD(g.store,g.state,g.player1,evolution)).toBe(false);
  });
  it('permits a Grass secondary type on both the current Pokemon and its evolution',()=>{
    const g=gameWithForest();
    const current=g.player1.active.getPokemonCard()!;
    current.cardType=CardType.WATER;current.additionalCardTypes=[CardType.GRASS];
    const evolution=g.player1.hand.cards.find(c=>c.fullName==='Ivysaur BS') as PokemonCard;
    evolution.cardType=CardType.FIRE;evolution.additionalCardTypes=[CardType.GRASS];
    expect(playable(g,'Ivysaur BS')).toBe(true);
    play(g,'Ivysaur BS');
    expect(g.player1.active.getPokemonCard()).toBe(evolution);
  });
  it('does not alter the recorded turn for unrelated checks or make a non-Grass evolution legal',()=>{
    const g=gameWithForest();
    const check=new CheckPokemonPlayedTurnEffect(g.player1,g.player1.active);
    g.store.reduceEffect(g.state,check);
    expect(check.pokemonPlayedTurn).toBe(g.state.turn);
    class WrongType extends PokemonCard { public stage=Stage.STAGE_1; public cardType=CardType.FIRE; public evolvesFrom='Bulbasaur'; public name='Wrong type'; public fullName='Wrong type TST'; public set='TST'; }
    const wrong=new WrongType();g.player1.hand.cards.push(wrong);
    expect(CAN_PLAY_POKEMON_CARD(g.store,g.state,g.player1,wrong)).toBe(false);
  });
  it('does not permit evolution during the player’s first turn',()=>{
    const g=gameWithForest(2);
    expect(playable(g,'Ivysaur BS')).toBe(false);
    expect(()=>play(g,'Ivysaur BS')).toThrow();
  });
  it('stops allowing same-turn evolutions when the stadium leaves play',()=>{
    const g=gameWithForest();play(g,'Ivysaur BS');
    g.player1.stadium.cards=[];
    expect(playable(g,'Venusaur BS')).toBe(false);
    expect(()=>play(g,'Venusaur BS')).toThrow();
  });
  it('does not use the stadium while Wicked Wind suppresses Stadium effects',()=>{
    const g=gameWithForest();const shiftry=new Shiftry();
    g.player2.active.cards=[shiftry];
    g.player2.marker.addMarker(shiftry.WICKED_WIND_MARKER,shiftry);
    const probe=new StadiumEffect(g.player1,g.player1.active,g.player1.stadium.cards[0] as TrainerCard);
    g.store.reduceEffect(g.state,probe);
    expect(probe.preventDefault).toBe(true);
    expect(playable(g,'Ivysaur BS')).toBe(false);
    expect(()=>play(g,'Ivysaur BS')).toThrow();
  });
  it('respects New Moon protection only while Lunatone and Solrock are in play',()=>{
    const g=gameWithForest(); const moon=new Lunatone(), sun=new Solrock();moon.id=9012;sun.id=9013;
    g.player1.bench[1].cards=[moon];
    expect(playable(g,'Ivysaur BS')).toBe(true);
    g.player1.bench[2].cards=[sun];
    const probe=new StadiumEffect(g.player1,g.player1.active,g.player1.stadium.cards[0] as TrainerCard);
    g.store.reduceEffect(g.state,probe);
    expect(probe.preventDefault).toBe(true);
    expect(playable(g,'Ivysaur BS')).toBe(false);
    expect(()=>play(g,'Ivysaur BS')).toThrow();
    g.player1.bench[2].cards=[];
    expect(playable(g,'Ivysaur BS')).toBe(true);
  });
  it('ignores New Moon when Garbotoxin blocks the Ability',()=>{
    const g=gameWithForest(); const moon=new Lunatone(), sun=new Solrock(), garbodor=new Garbodor();
    moon.id=9012;sun.id=9013;garbodor.id=9014;
    g.player1.bench[1].cards=[moon];g.player1.bench[2].cards=[sun];
    const tool=getCardByName('Bravery Charm PAL');tool.id=9015;
    g.player2.bench[0].cards=[garbodor,tool];g.player2.bench[0].tools=[tool];
    expect(playable(g,'Ivysaur BS')).toBe(true);
    play(g,'Ivysaur BS');
  });
  it('resolves nested Stadium Ability locks without ignoring Garbotoxin',()=>{
    class BlockingStadium extends TrainerCard {
      public trainerType=TrainerType.STADIUM; public name='Test Stadium'; public fullName='Test Stadium TST'; public set='TST';
      public reduceEffect(store:StoreLike,state:State,effect:Effect):State {
        if (effect instanceof PowerEffect && effect.card instanceof Lunatone) {
          const slot=StateUtils.findPokemonSlot(state,effect.card);
          if (slot && !IS_STADIUM_EFFECT_BLOCKED(store,state,effect.player,slot,this)) throw new Error('Stadium Ability lock');
        }
        return state;
      }
    }
    const g=gameWithForest();const moon=new Lunatone(),sun=new Solrock(),other=new BlockingStadium();
    moon.id=9012;sun.id=9013;other.id=9014;
    g.player1.bench[1].cards=[moon];g.player1.bench[2].cards=[sun];g.player2.stadium.cards=[other];
    // New Moon protects its owner from the nested Stadium-based Ability lock.
    expect(playable(g,'Ivysaur BS')).toBe(false);
    // Garbotoxin is not a Stadium effect and therefore still shuts off New Moon.
    const garbodor=new Garbodor(),tool=getCardByName('Bravery Charm PAL');garbodor.id=9015;tool.id=9016;
    g.player2.bench[0].cards=[garbodor,tool];g.player2.bench[0].tools=[tool];
    expect(playable(g,'Ivysaur BS')).toBe(true);
  });
  it('does not grant New Moon protection from a Lunatone in the discard pile',()=>{
    const g=gameWithForest(); const moon=new Lunatone(), sun=new Solrock();moon.id=9012;sun.id=9013;
    g.player1.discard.cards=[moon];g.player1.bench[2].cards=[sun];
    expect(playable(g,'Ivysaur BS')).toBe(true);
    play(g,'Ivysaur BS');
  });
  it('also enables the opponent to evolve while the Stadium is on the other side',()=>{
    const g=gameWithForest();
    const moon=new Lunatone(), sun=new Solrock();moon.id=9012;sun.id=9013;
    g.player1.bench[1].cards=[moon];g.player1.bench[2].cards=[sun];
    const basic=getCardByName('Bulbasaur BS');basic.id=9010;
    const evolution=getCardByName('Ivysaur BS') as PokemonCard;evolution.id=9011;
    g.player2.active.cards=[basic];g.player2.active.pokemonPlayedTurn=g.state.turn;
    g.player2.hand.cards=[evolution];g.player2.canEvolve=true;g.state.activePlayer=1;
    expect(CAN_PLAY_POKEMON_CARD(g.store,g.state,g.player2,evolution)).toBe(true);
    g.store.dispatch(new PlayCardAction(g.player2.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
    expect(g.player2.active.getPokemonCard()).toBe(evolution);
  });
});
