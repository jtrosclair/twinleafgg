import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardTag, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Wobbuffet } from '../set-lost-thunder/wobbuffet';
import { Garbodor } from '../set-breakpoint/garbodor';

class TestEnergy extends EnergyCard {
  public name = 'Test Psychic Energy'; public fullName = 'Test Psychic Energy'; public set = 'TEST'; public provides = [CardType.PSYCHIC];
}
class Defender extends PokemonCard {
  public name = 'Test Defender'; public fullName = 'Test Defender'; public set = 'TEST'; public hp = 500;
}
class PrismAttacker extends PokemonCard {
  public name = 'Test Prism'; public fullName = 'Test Prism'; public set = 'TEST'; public hp = 500; public tags = [CardTag.PRISM_STAR];
  public attacks = [{ name: 'Prism Test', cost: [], damage: 10, text: '' }];
  public powers = [{ name: 'Prism Ability', powerType: PowerType.ABILITY, text: '' }];
}
class MetadataWobbuffet extends Wobbuffet {
  public name = 'Test Reprint'; public fullName = 'Test Reprint'; public set = 'TEST';
}
function battle(Source: typeof Wobbuffet = Wobbuffet) {
  const state = new State(); const player = new Player(); const opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.phase = GamePhase.ATTACK; state.turn = 2;
  const mew = new Mewex(); const source = new Source();
  player.active.cards = [mew, new TestEnergy(), new TestEnergy()];
  const bench = new PokemonCardList(); bench.cards = [source]; player.bench.push(bench);
  opponent.active.cards = [new Defender()];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, mew, source, store };
}
function forceFlip(b: ReturnType<typeof battle>, result: boolean) {
  const reduce = b.store.reduceEffect.bind(b.store);
  spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: any) => {
    if (effect instanceof CoinFlipEffect) { effect.callback!(result); return state; }
    return reduce(state, effect);
  });
}
function resolve(b: ReturnType<typeof battle>, result: any) {
  const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
  if (!prompt) throw new Error('Expected pending prompt');
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, result));
}
function copy(b: ReturnType<typeof battle>) {
  b.store.reduceEffect(b.state, new PowerEffect(b.player, b.mew.powers[0], b.mew));
  resolve(b, b.source.attacks[0]);
  b.state.phase = GamePhase.FINISHED; resolve(b, null);
}
function activePrism(b: ReturnType<typeof battle>) {
  const prism = new PrismAttacker(); b.opponent.active.cards = [prism]; return prism;
}

describe('Wobbuffet LOT copied attack ownership', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  [false, true].forEach(heads => {
    it('resolves direct Knock Away for ' + (heads ? 'heads' : 'tails'), () => {
      const b = battle(); b.player.active.cards = [b.source]; b.player.bench[0].cards = []; forceFlip(b, heads);
      const attack = new AttackEffect(b.player, b.opponent, b.source.attacks[0]);
      b.store.reduceEffect(b.state, attack);
      expect(attack.damage).toBe(heads ? 60 : 30);
    });
    it('resolves Mew copied Knock Away for ' + (heads ? 'heads' : 'tails'), () => {
      const b = battle(); forceFlip(b, heads); copy(b);
      expect(b.opponent.active.damage).toBe(heads ? 60 : 30);
    });
  });
  it('copies an inherited metadata-only Wobbuffet print', () => {
    const b = battle(MetadataWobbuffet); forceFlip(b, true); copy(b);
    expect(b.opponent.active.damage).toBe(60);
  });
  it('does not grant Shady Tail to Mew after the copied source leaves play', () => {
    const b = battle(); forceFlip(b, true); copy(b);
    b.player.bench[0].moveTo(b.player.discard);
    b.state.phase = GamePhase.ATTACK; b.state.activePlayer = 1;
    const prism = activePrism(b), attack = new AttackEffect(b.opponent, b.player, prism.attacks[0]);
    expect(() => b.store.reduceEffect(b.state, attack)).not.toThrow();
  });
  it('blocks an opposing Prism Star attack while Wobbuffet is on the Bench', () => {
    const b = battle(), prism = activePrism(b);
    const attack = new AttackEffect(b.opponent, b.player, prism.attacks[0]);
    expect(() => b.store.reduceEffect(b.state, attack)).toThrow();
  });
  it('blocks an allied Prism Star attack while Wobbuffet is on the Bench', () => {
    const b = battle(), prism = new PrismAttacker(); b.player.active.cards = [prism];
    const attack = new AttackEffect(b.player, b.opponent, prism.attacks[0]);
    expect(() => b.store.reduceEffect(b.state, attack)).toThrow();
  });
  it('does not block non-Prism attacks', () => {
    const b = battle(); const attack = new AttackEffect(b.player, b.opponent, b.mew.attacks[0]);
    expect(() => b.store.reduceEffect(b.state, attack)).not.toThrow();
  });
  it('does not block an attack if Wobbuffet is Active rather than on the Bench', () => {
    const b = battle(), prism = activePrism(b); b.player.active.cards = [b.source]; b.player.bench[0].cards = [];
    const attack = new AttackEffect(b.opponent, b.player, prism.attacks[0]);
    expect(() => b.store.reduceEffect(b.state, attack)).not.toThrow();
  });
  it('respects Garbotoxin when considering the Prism attack lock', () => {
    const b = battle(), prism = activePrism(b), slot = new PokemonCardList(), tool = new TestEnergy();
    slot.cards = [new Garbodor(), tool]; slot.tools = [tool]; b.opponent.bench.push(slot);
    const attack = new AttackEffect(b.opponent, b.player, prism.attacks[0]);
    expect(() => b.store.reduceEffect(b.state, attack)).not.toThrow();
  });
  it('blocks a Prism Star Ability while Wobbuffet is on the Bench', () => {
    const b = battle(), prism = activePrism(b);
    expect(() => b.store.reduceEffect(b.state, new PowerEffect(b.opponent, prism.powers[0], prism))).toThrow();
  });
  it('removes Prism Star Ability choices from the power check while on the Bench', () => {
    const b = battle(), prism = activePrism(b);
    const check = new CheckPokemonPowersEffect(b.opponent, prism);
    b.store.reduceEffect(b.state, check);
    expect(check.powers).not.toContain(prism.powers[0]);
  });
  it('retains Prism Star Ability choices when Wobbuffet is Active', () => {
    const b = battle(), prism = activePrism(b);
    b.player.active.cards = [b.source]; b.player.bench[0].cards = [];
    const check = new CheckPokemonPowersEffect(b.opponent, prism);
    b.store.reduceEffect(b.state, check);
    expect(check.powers).toContain(prism.powers[0]);
  });
  it('does not block Prism Star Abilities when Shady Tail itself is suppressed', () => {
    const b = battle(), prism = activePrism(b);
    const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: any) => {
      if (effect instanceof PowerEffect && effect.card === b.source && effect.power.name === 'Shady Tail') throw new Error('suppressed');
      return reduce(state, effect);
    });
    expect(() => b.store.reduceEffect(b.state, new PowerEffect(b.opponent, prism.powers[0], prism))).not.toThrow();
  });
  it('restores an ended copied attack checkpoint without inheriting Shady Tail', () => {
    const b = battle(); forceFlip(b, true); copy(b);
    const cards = [...b.player.active.cards, ...b.player.bench.flatMap(slot => slot.cards), ...b.opponent.active.cards];
    cards.forEach((card, index) => card.id = index); b.state.cardNames = cards.map(card => card.fullName);
    StateSerializer.setKnownCards([new Mewex(), new TestEnergy(), new Defender(), new Wobbuffet()]);
    const serializer = new StateSerializer(), restored = serializer.deserialize(serializer.serialize(b.state));
    clearCopyAttackSessionsForTests();
    const store = new Store({ onStateChange: () => undefined }); store.restoreState(restored);
    expect(restored.players[1].active.damage).toBe(60);
    const active = restored.players[0].active.getPokemonCard()!;
    expect(active).toEqual(jasmine.any(Mewex));
    const check = new CheckPokemonPowersEffect(restored.players[0], active);
    expect(() => store.reduceEffect(restored, check)).not.toThrow();
  });
});
