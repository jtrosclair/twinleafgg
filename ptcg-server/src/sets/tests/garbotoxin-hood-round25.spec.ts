import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { setupGame, padDeck } from './test-helpers';
import { CardManager } from '../../game/cards/card-manager';
import { Kadabra } from '../set-mega-evolution/kadabra';

beforeAll(() => {
  const manager = CardManager.getInstance();
  const kadabra = new Kadabra();
  if (!manager.isCardDefined(kadabra.fullName)) manager.defineSet([kadabra]);
});

function game(opposing: boolean, friendly: boolean, hood: boolean) {
  return setupGame({turn: 5,
    player1:{active:{card:'Kadabra M1S',tools:hood?['Stealthy Hood UNB']:[]},bench:friendly?[{card:'Garbodor DRX',tools:['Float Stone PLF']}]:[],deck:padDeck(10)},
    player2:{active:{card:opposing?'Garbodor DRX':'Pikachu BS',tools:opposing?['Float Stone PLF']:[]},deck:padDeck(10)}
  });
}
function check(g:ReturnType<typeof game>, blocked:boolean) {
  const p=g.player1, card=p.active.getPokemonCard()!, power=card.powers[0];
  const effect=new CheckPokemonPowersEffect(p,card);
  g.store.reduceEffect(g.state,effect);
  expect(effect.powers.some(x=>x.name===power.name)).toBe(!blocked);
  if (blocked) expect(()=>g.store.reduceEffect(g.state,new PowerEffect(p,power,card))).toThrow();
  else expect(()=>g.store.reduceEffect(g.state,new PowerEffect(p,power,card))).not.toThrow();
}
describe('Garbotoxin and Stealthy Hood ownership',()=>{
 it('blocks an unprotected opposing Pokémon',()=>check(game(true,false,false),true));
 it('allows a protected Pokémon against the opponent’s Garbotoxin',()=>check(game(true,false,true),false));
 it('still blocks the bearer from its own Garbotoxin',()=>check(game(false,true,true),true));
 it('still blocks when both sides have Garbotoxin',()=>check(game(true,true,true),true));
 it('allows the protected evolved Pokémon to resolve its Ability through public dispatch',()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Abra BS',tools:['Stealthy Hood UNB']},hand:['Kadabra M1S'],deck:padDeck(10)},player2:{active:{card:'Garbodor DRX',tools:['Float Stone PLF']},deck:padDeck(10)}});
  g.player1.canEvolve=true;g.player1.active.pokemonPlayedTurn=1;let offered=0;
  g.overridePrompt('Confirm',()=>{offered++;return true;});
  g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
  expect(g.player1.active.getPokemonCard()!.fullName).toBe('Kadabra M1S');expect(offered).toBe(1);expect(g.player1.hand.cards.length).toBe(2);
 });
 it('protects a Benched Pokémon against the opponent’s Garbotoxin',()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Pikachu BS'},bench:[{card:'Kadabra M1S',tools:['Stealthy Hood UNB']}],deck:padDeck(10)},player2:{active:{card:'Garbodor DRX',tools:['Float Stone PLF']},deck:padDeck(10)}});
  const card=g.player1.bench[0].getPokemonCard()!,power=card.powers[0],query=new CheckPokemonPowersEffect(g.player1,card);g.store.reduceEffect(g.state,query);
  expect(query.powers.some(x=>x.name===power.name)).toBe(true);expect(()=>g.store.reduceEffect(g.state,new PowerEffect(g.player1,power,card))).not.toThrow();
 });
 for (const zone of ['hand','discard'] as const) it(`still blocks Pokémon in the ${zone} without their own Hood`,()=>{
  const g=setupGame({turn:5,player1:{active:{card:'Pikachu BS',tools:['Stealthy Hood UNB']},[zone]:['Kadabra M1S'],deck:padDeck(10)},player2:{active:{card:'Garbodor DRX',tools:['Float Stone PLF']},deck:padDeck(10)}});
  const card=g.player1[zone].cards[0] as any,power=card.powers[0],query=new CheckPokemonPowersEffect(g.player1,card);g.store.reduceEffect(g.state,query);
  expect(query.powers.some(x=>x.name===power.name)).toBe(false);expect(()=>g.store.reduceEffect(g.state,new PowerEffect(g.player1,power,card))).toThrow();
 });
 it('respects prevention of Garbotoxin through the Ability effect contract',()=>{
  const g=game(true,false,false),reduce=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((state:State,effect:Effect)=>{
   if(effect instanceof EffectOfAbilityEffect && effect.power.name==='Garbotoxin'){effect.preventDefault=true;return state;}
   return reduce(state,effect);
  });
  check(g,false);
 });
 it('allows an Ability when no Garbotoxin is active',()=>check(game(false,false,true),false));
});
