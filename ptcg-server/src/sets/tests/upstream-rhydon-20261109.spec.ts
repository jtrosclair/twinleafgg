import { Rhyhorn } from '../set-stellar-crown/rhyhorn';
import { Rhydon } from '../set-stellar-crown/rhydon';
import { setStellarCrown } from '../set-stellar-crown';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';

class DummyPokemon extends PokemonCard { public name = 'Dummy'; public fullName = 'Dummy'; public set = 'TEST'; public hp = 300; }
class DummyEnergy extends EnergyCard { public name = 'Dummy Energy'; public fullName = 'Dummy Energy'; public set = 'TEST'; public provides = [CardType.WATER]; }

function battle(hasEnergy: boolean) {
  const state = new State(); const player = new Player(); const opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2; state.phase = GamePhase.ATTACK;
  const rhydon = new Rhydon(); player.active.cards = [rhydon];
  const defender = new DummyPokemon(); const energy = new DummyEnergy();
  opponent.active.cards = hasEnergy ? [defender, energy] : [defender];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, rhydon, energy, store };
}
function resolve(b: ReturnType<typeof battle>, result: any) {
  const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
  if (!prompt) throw new Error('Expected a pending prompt');
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, result));
}

describe('Upstream Stellar Crown Rhyhorn and Rhydon', () => {
  it('registers both exact printed identities and their evolution relationship', () => {
    for (const [name, number] of [['Rhyhorn SCR', '74'], ['Rhydon SCR', '75']]) {
      const cards = setStellarCrown.filter(card => card.fullName === name);
      expect(cards.length).toBe(1); expect(cards[0].setNumber).toBe(number);
    }
    expect(new Rhydon().evolvesFrom).toBe(new Rhyhorn().name);
  });

  it('on heads discards the chosen Energy after the coin prompt', () => {
    spyOn(Math, 'random').and.returnValue(0.1);
    const b = battle(true);
    b.store.reduceEffect(b.state, new AttackEffect(b.player, b.opponent, b.rhydon.attacks[0]));
    expect(b.opponent.active.cards).toContain(b.energy);
    resolve(b, true);
    expect(b.opponent.active.cards).toContain(b.energy);
    resolve(b, [b.energy]);
    expect(b.opponent.active.cards).not.toContain(b.energy);
    expect(b.opponent.discard.cards).toContain(b.energy);
  });

  it('on tails leaves Energy attached and does not ask to discard', () => {
    spyOn(Math, 'random').and.returnValue(0.9);
    const b = battle(true);
    b.store.reduceEffect(b.state, new AttackEffect(b.player, b.opponent, b.rhydon.attacks[0]));
    resolve(b, true);
    expect(b.opponent.active.cards).toContain(b.energy);
    expect(b.state.prompts.filter(p => p.result === undefined).length).toBe(0);
  });

  it('on heads with no opposing Energy completes without another prompt', () => {
    spyOn(Math, 'random').and.returnValue(0.1);
    const b = battle(false);
    b.store.reduceEffect(b.state, new AttackEffect(b.player, b.opponent, b.rhydon.attacks[0]));
    resolve(b, true);
    expect(b.opponent.discard.cards.length).toBe(0);
    expect(b.state.prompts.filter(p => p.result === undefined).length).toBe(0);
  });
});
