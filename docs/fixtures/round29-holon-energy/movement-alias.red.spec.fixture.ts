// Research only. Copy to sets/tests in an isolated checkout; several expectations are deliberately red.
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { SuperType } from '../../game/store/card/card-types';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { CardList } from '../../game/store/state/card-list';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { Store } from '../../game/store/store';
import { MoveCardsEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { HolonsMagnemite } from '../set-ex-delta-species/holons-magnemite';
import { GrassEnergy } from '../set-scarlet-and-violet-energy/grass-energy';

class Dummy extends PokemonCard { public name='Dummy'; public fullName='Dummy TEST'; public hp=100; public set='TEST'; }
function fixture() {
  const state=new State(), player=new Player(), opponent=new Player();
  player.id=1;opponent.id=2;state.players=[player,opponent];state.phase=GamePhase.PLAYER_TURN;state.turn=2;
  player.bench=[new PokemonCardList()]; const host=new Dummy(), holon=new HolonsMagnemite(), basic=new GrassEnergy();
  [host,holon,basic].forEach((card,index)=>card.id=index); holon.superType=SuperType.ENERGY;
  player.active.cards=[host,holon,basic];player.active.energies.cards=[holon,basic];player.bench[0].cards=[new Dummy()];opponent.active.cards=[new Dummy()];
  const store=new Store({onStateChange(){}});store.state=state;
  return{state,player,opponent,holon,basic,store,slot:player.active,destination:player.bench[0]};
}
describe('canonical Pokemon/Energy movement aliases - deferred research',()=>{
  it('bounces a whole Pokemon with exactly one occurrence of each attached physical card',()=>{
    const f=fixture();f.store.reduceEffect(f.state,new MoveCardsEffect(f.slot,f.player.hand));
    expect(f.player.hand.cards.filter(card=>card===f.holon).length).toBe(1);
    expect(f.player.hand.cards.filter(card=>card===f.basic).length).toBe(1);
  });
  it('moves a whole Pokemon directly to discard without duplicating attachment mirrors',()=>{
    const f=fixture();f.slot.moveTo(f.player.discard);
    expect(f.player.discard.cards.filter(card=>card===f.holon).length).toBe(1);
    expect(f.player.discard.cards.filter(card=>card===f.basic).length).toBe(1);
  });
  it('keeps ordinary MoveCardsEffect discard unique',()=>{
    const f=fixture();f.store.reduceEffect(f.state,new MoveCardsEffect(f.slot,f.player.discard));
    expect(f.player.discard.cards.filter(card=>card===f.holon).length).toBe(1);
    expect(f.player.discard.cards.filter(card=>card===f.basic).length).toBe(1);
    expect(f.slot.energies.cards.length).toBe(0);
  });
  it('keeps ordinary KnockOutEffect discard unique',()=>{
    const f=fixture();f.store.reduceEffect(f.state,new KnockOutEffect(f.player,f.slot));
    expect(f.player.discard.cards.filter(card=>card===f.holon).length).toBe(1);
    expect(f.player.discard.cards.filter(card=>card===f.basic).length).toBe(1);
    expect(f.slot.energies.cards.length).toBe(0);
  });
  it('transfers through PokemonCardList while maintaining both canonical arrays',()=>{
    const f=fixture();f.slot.moveCardsTo([f.holon,f.basic],f.destination);
    expect(f.slot.cards).not.toContain(f.holon);expect(f.slot.energies.cards).not.toContain(f.holon);
    expect(f.destination.cards.filter(card=>card===f.holon).length).toBe(1);
    expect(f.destination.energies.cards.filter(card=>card===f.holon).length).toBe(1);
    expect(f.destination.getPokemonCard()!.name).toBe('Dummy');
  });
  for(const method of ['moveTo','moveCardsTo']) it('moves physical attachments with their mirrors using '+method,()=>{
    const f=fixture();
    if(method==='moveTo') f.slot.energies.moveTo(f.destination.energies);
    else f.slot.energies.moveCardsTo([f.holon,f.basic],f.destination.energies);
    expect(f.slot.cards).not.toContain(f.holon);expect(f.slot.cards).not.toContain(f.basic);
    expect(f.destination.cards).toContain(f.holon);expect(f.destination.cards).toContain(f.basic);
  });
  it('preserves moveToTopOfDestination copy-helper semantics for a temporary source list',()=>{
    const f=fixture(), temporary=new CardList();temporary.cards=[f.holon];
    temporary.moveToTopOfDestination(f.player.deck);
    expect(temporary.cards).toEqual([f.holon]);expect(f.player.deck.cards[0]).toBe(f.holon);
  });
  it('can use the returned physical Holon card once after a whole-Pokemon bounce',()=>{
    const f=fixture();f.store.reduceEffect(f.state,new MoveCardsEffect(f.slot,f.player.hand));
    f.player.active.cards=[new Dummy()];
    expect(()=>{
      f.store.reduceEffect(f.state,new PowerEffect(f.player,f.holon.powers[0],f.holon));
      const prompt=f.state.prompts.find(p=>p.result===undefined)!;
      (f.store as any).reducePrompt(f.state,new ResolvePromptAction(prompt.id,[f.player.active]));
    }).not.toThrow();
    expect(f.player.hand.cards).not.toContain(f.holon);
    expect(f.player.active.cards.filter(card=>card===f.holon).length).toBe(1);
    expect(f.player.active.energies.cards.filter(card=>card===f.holon).length).toBe(1);
  });
});
