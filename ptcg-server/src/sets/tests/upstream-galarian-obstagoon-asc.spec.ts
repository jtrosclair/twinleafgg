import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { Player } from '../../game/store/state/player';
import { GamePhase, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { setAscendedHeroes } from '../set-ascended-heroes';
import { GalarianZigzagoon } from '../set-ascended-heroes/galarian-zigzagoon';
import { GalarianLinoone } from '../set-ascended-heroes/galarian-linoone';
import { GalarianObstagoon } from '../set-ascended-heroes/galarian-obstagoon';
import { DoubleTurboEnergy } from '../set-brilliant-stars/double-turbo-energy';

class DummyMon extends PokemonCard { public name='Dummy'; public fullName='Dummy TEST'; public set='TEST'; public hp=1000; }
class BasicEnergy extends EnergyCard { public name='Basic Energy'; public fullName='Basic Energy TEST'; public set='TEST'; public provides=[CardType.DARK]; }
class NoEnergy extends EnergyCard { public name='No Energy'; public fullName='No Energy TEST'; public set='TEST'; public energyType=EnergyType.SPECIAL; public provides: CardType[]=[]; }
class PokemonEnergy extends PokemonCard { public name='Pokémon Energy'; public fullName='Pokémon Energy TEST'; public set='TEST'; public provides: CardType[]=[]; }
function battle() {
  const state=new State(), player=new Player(), opponent=new Player(), card=new GalarianObstagoon();
  player.id=1; opponent.id=2; state.players=[player,opponent]; state.activePlayer=0; state.turn=4; state.phase=GamePhase.ATTACK;
  player.active.cards=[card]; opponent.active.cards=[new DummyMon()];
  const store=new Store({ onStateChange:()=>undefined }); store.state=state;
  return {state,player,opponent,card,store};
}
describe('Ascended Heroes Galarian Obstagoon line', () => {
  it('registers the three distinct printings and their evolution relationships', () => {
    for (const [name,number] of [['Galarian Zigzagoon ASC','130'],['Galarian Linoone ASC','131'],['Galarian Obstagoon ASC','132']]) {
      const cards=setAscendedHeroes.filter(card=>card.fullName===name);
      expect(cards.length).toBe(1); expect(cards[0].setNumber).toBe(number);
    }
    expect(new GalarianLinoone().evolvesFrom).toBe(new GalarianZigzagoon().name);
    expect(new GalarianObstagoon().evolvesFrom).toBe(new GalarianLinoone().name);
  });
  for(const damage of [0,10,30]) {
    it(`Scarring Shout multiplies the ${damage/10} existing damage counters`, () => {
      const b=battle(); b.opponent.active.damage=damage; b.player.active.damage=20;
      const effect=new AttackEffect(b.player,b.opponent,b.card.attacks[0]); b.store.reduceEffect(b.state,effect);
      expect(effect.damage).toBe(70*damage/10);
    });
  }
  it('lets the attacker choose exactly one attached Energy to discard', () => {
    const b=battle(), basic=new BasicEnergy(), turbo=new DoubleTurboEnergy();
    basic.id=1; turbo.id=2; b.player.active.cards.push(basic,turbo);
    b.player.active.energies.cards.push(turbo);
    const effect=new AttackEffect(b.player,b.opponent,b.card.attacks[1]); b.store.reduceEffect(b.state,effect);
    const prompt=b.state.prompts.find(p=>p instanceof ChooseEnergyPrompt && p.result===undefined) as ChooseEnergyPrompt;
    expect(prompt).toBeDefined(); expect(prompt.options.allowCancel).toBe(false);
    const selected=prompt.energy.filter(e=>e.card===turbo);
    expect(selected.length).toBe(1);
    expect(prompt.validate(selected)).toBe(true);
    expect(prompt.validate([])).toBe(false);
    (b.store as any).reducePrompt(b.state,new ResolvePromptAction(prompt.id,selected));
    expect(b.player.active.cards).not.toContain(turbo); expect(b.player.discard.cards).toContain(turbo);
    expect(b.player.active.energies.cards).not.toContain(turbo);
    expect(b.player.active.cards).toContain(basic); expect(b.opponent.discard.cards.length).toBe(0);
  });
  it('still resolves the attack if no Energy remains attached', () => {
    const b=battle(), effect=new AttackEffect(b.player,b.opponent,b.card.attacks[1]);
    b.store.reduceEffect(b.state,effect);
    expect(b.state.prompts.filter(p=>p.result===undefined).length).toBe(0);
    expect(b.player.discard.cards.length).toBe(0);
  });
  it('allows discarding an attached Energy card even when it provides no Energy', () => {
    const b=battle(), basic=new BasicEnergy(), inactive=new NoEnergy();
    basic.id=1; inactive.id=2; b.player.active.cards.push(basic,inactive);
    const effect=new AttackEffect(b.player,b.opponent,b.card.attacks[1]); b.store.reduceEffect(b.state,effect);
    const prompt=b.state.prompts.find(p=>p instanceof ChooseEnergyPrompt && p.result===undefined) as ChooseEnergyPrompt;
    const chosen=prompt.energy.filter(e=>e.card===inactive);
    expect(chosen.length).toBe(1); expect(prompt.validate(chosen)).toBe(true);
    (b.store as any).reducePrompt(b.state,new ResolvePromptAction(prompt.id,chosen));
    expect(b.player.discard.cards).toContain(inactive); expect(b.player.active.cards).toContain(basic);
  });
  it('allows discarding a Pokémon attached as Energy even if it provides none', () => {
    const b=battle(), basic=new BasicEnergy(), attached=new PokemonEnergy();
    basic.id=1; attached.id=2; b.player.active.cards.push(basic); b.player.active.energies.cards.push(attached);
    const effect=new AttackEffect(b.player,b.opponent,b.card.attacks[1]); b.store.reduceEffect(b.state,effect);
    const prompt=b.state.prompts.find(p=>p instanceof ChooseEnergyPrompt && p.result===undefined) as ChooseEnergyPrompt;
    const chosen=prompt.energy.filter(e=>e.card===attached);
    expect(chosen.length).toBe(1); expect(prompt.validate(chosen)).toBe(true);
    (b.store as any).reducePrompt(b.state,new ResolvePromptAction(prompt.id,chosen));
    expect(b.player.discard.cards).toContain(attached); expect(b.player.active.energies.cards).not.toContain(attached);
  });
});
