import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State, GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { DuraludonVMAX } from '../set-evolving-skies/duraludon-vmax';

class Attacker extends PokemonCard {
  public name = 'Attacker'; public fullName = 'Attacker test'; public set = 'TEST'; public hp = 1000;
}
class TestEnergy extends EnergyCard {
  public name = 'Test Energy'; public fullName = 'Test Energy'; public set = 'TEST';
}
function battle(defender: PokemonCard) {
  const state = new State(), player = new Player(), opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2;
  state.phase = GamePhase.ATTACK; state.activePlayer = 0;
  player.active.cards = [defender]; opponent.active.cards = [new Attacker()];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, store };
}
function energy(type: EnergyType, provides = CardType.PSYCHIC) {
  const result = new TestEnergy(); result.energyType = type; result.provides = [provides]; return result;
}
function hit(b: ReturnType<typeof battle>) {
  const attack = new AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage: 70, text: '' });
  const damage = new PutDamageEffect(attack, 70); b.store.reduceEffect(b.state, damage);
  return damage;
}
function resolve(b: ReturnType<typeof battle>, result: any) {
  const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
  if (!prompt) throw new Error('Expected pending prompt');
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, result));
}
function copy(b: ReturnType<typeof battle>, mew: Mewex, source: DuraludonVMAX) {
  const slot = new PokemonCardList(); slot.cards = [source]; b.player.bench.push(slot);
  b.player.active.cards.push(energy(EnergyType.SPECIAL, CardType.FIGHTING), energy(EnergyType.BASIC, CardType.METAL), energy(EnergyType.BASIC, CardType.METAL));
  b.store.reduceEffect(b.state, new PowerEffect(b.player, mew.powers[0], mew));
  resolve(b, source.attacks[0]); b.state.phase = GamePhase.FINISHED; resolve(b, null);
  b.state.activePlayer = 1; b.state.phase = GamePhase.ATTACK;
}

describe('Duraludon Skyscraper and copied attacks', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  it('prevents attack damage when the attacker has Special Energy', () => {
    const b = battle(new DuraludonVMAX()); b.opponent.active.cards.push(energy(EnergyType.SPECIAL));
    expect(hit(b).preventDefault).toBe(true);
  });
  it('does not prevent damage merely because the defender has Special Energy', () => {
    const b = battle(new DuraludonVMAX()); b.player.active.cards.push(energy(EnergyType.SPECIAL));
    expect(hit(b).preventDefault).toBe(false);
  });
  it('does not prevent damage when its Ability is blocked', () => {
    const b = battle(new DuraludonVMAX()); b.opponent.active.cards.push(energy(EnergyType.SPECIAL));
    const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((s: State, e: Effect) => {
      if (e instanceof PowerEffect) throw new Error('Ability blocked'); return reduce(s, e);
    });
    expect(hit(b).preventDefault).toBe(false);
  });
  it('does not grant Skyscraper to Mew after it copies G-Max Pulverization', () => {
    const mew = new Mewex(), b = battle(mew); copy(b, mew, new DuraludonVMAX());
    b.opponent.active.cards.push(energy(EnergyType.SPECIAL));
    expect(hit(b).preventDefault).toBe(false);
  });
});
