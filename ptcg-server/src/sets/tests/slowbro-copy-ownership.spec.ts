import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { CardList } from '../../game/store/state/card-list';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Slowbro } from '../set-dark-explorers/slowbro';
import { Garbodor } from '../set-breakpoint/garbodor';

class TestEnergy extends EnergyCard {
  public name = 'Test Water Energy'; public fullName = 'Test Water Energy'; public set = 'TEST'; public provides = [CardType.WATER];
}
class Defender extends PokemonCard {
  public name = 'Test Defender'; public fullName = 'Test Defender'; public set = 'TEST'; public hp = 500;
}
class Reprint extends Slowbro {
  public name = 'Test Slowbro'; public fullName = 'Test Slowbro'; public set = 'TEST';
}
function battle() {
  const state = new State(); const player = new Player(); const opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.phase = GamePhase.ATTACK; state.turn = 2;
  const mew = new Mewex(); const source = new Slowbro();
  player.active.cards = [mew, new TestEnergy(), new TestEnergy()];
  const bench = new PokemonCardList(); bench.cards = [source]; player.bench.push(bench);
  opponent.active.cards = [new Defender()];
  const prize = new CardList(); prize.cards = [new TestEnergy()]; player.prizes = [prize];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, mew, source, store };
}
function setPrizes(player: Player, count: number) {
  player.prizes = Array.from({length: count}, () => { const prize = new CardList(); prize.cards = [new TestEnergy()]; return prize; });
}
function blockAbilities(b: ReturnType<typeof battle>) {
  const slot = new PokemonCardList(), tool = new TestEnergy(); slot.cards = [new Garbodor(), tool]; slot.tools = [tool]; b.opponent.bench.push(slot);
}
function copyEffect(b: ReturnType<typeof battle>, source = b.source) {
  const attacks = cloneAttacks(source.attacks);
  openCopyAttackSession(b.state, b.player, b.mew, source, attacks, attacks[0]);
  const attack = new AttackEffect(b.player, b.opponent, attacks[0]);
  b.store.reduceEffect(b.state, attack); return attack;
}
function resolve(b: ReturnType<typeof battle>, result: any) {
  const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
  if (!prompt) throw new Error('Expected pending prompt');
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, result));
}
describe('Slowbro DEX copied attack ownership', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  it('direct Lazy Headbutt causes Sleep when its Ability is active and prizes are odd', () => {
    const b = battle(); b.player.active.cards = [b.source]; b.player.bench[0].cards = [];
    const attack = new AttackEffect(b.player, b.opponent, b.source.attacks[0]); b.store.reduceEffect(b.state, attack);
    expect(attack.damage).toBe(80); expect(b.player.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });
  [2, 4, 6].forEach(count => it('direct Airhead blocks the attack with ' + count + ' Prizes', () => {
    const b = battle(); b.player.active.cards = [b.source]; b.player.bench[0].cards = []; setPrizes(b.player, count);
    const attack = new AttackEffect(b.player, b.opponent, b.source.attacks[0]);
    expect(() => b.store.reduceEffect(b.state, attack)).toThrow(); expect(b.player.active.specialConditions).not.toContain(SpecialCondition.ASLEEP);
  }));
  it('direct Lazy Headbutt still causes Sleep under real Garbotoxin with two Prizes', () => {
    const b = battle(); b.player.active.cards = [b.source]; b.player.bench[0].cards = []; setPrizes(b.player, 2); blockAbilities(b);
    const attack = new AttackEffect(b.player, b.opponent, b.source.attacks[0]); b.store.reduceEffect(b.state, attack);
    expect(attack.damage).toBe(80); expect(b.player.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });
  [1,2,4,6].forEach(count => it('copied Lazy Headbutt applies Sleep without inheriting Airhead at ' + count + ' Prizes', () => {
    const b = battle(); setPrizes(b.player, count); const attack = copyEffect(b);
    expect(attack.damage).toBe(80); expect(b.player.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  }));
  it('actually uses Mew Memory Helix to copy Lazy Headbutt and places Sleep on Mew', () => {
    const b = battle(); setPrizes(b.player, 2);
    b.store.reduceEffect(b.state, new PowerEffect(b.player, b.mew.powers[0], b.mew));
    resolve(b, b.source.attacks[0]); b.state.phase = GamePhase.FINISHED; resolve(b, null);
    expect(b.opponent.active.damage).toBe(80); expect(b.player.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });
  it('inherits the attack-only contract on a metadata-only reprint', () => {
    const b = battle(), source = new Reprint(); b.player.bench[0].cards = [source]; setPrizes(b.player, 2);
    copyEffect(b, source); expect(b.player.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });
  it('preserves Sleep and attack ownership through a serialized checkpoint', () => {
    const b = battle(); setPrizes(b.player, 2); copyEffect(b);
    const cards = [...b.player.active.cards, ...b.player.bench.flatMap(slot => slot.cards),
      ...b.opponent.active.cards, ...b.player.prizes.flatMap(prize => prize.cards)];
    cards.forEach((card, index) => card.id = index); b.state.cardNames = cards.map(card => card.fullName);
    StateSerializer.setKnownCards([new Mewex(), new Slowbro(), new TestEnergy(), new Defender()]);
    const serializer = new StateSerializer(), restored = serializer.deserialize(serializer.serialize(b.state));
    clearCopyAttackSessionsForTests();
    const store = new Store({ onStateChange: () => undefined }); store.restoreState(restored);
    const player = restored.players[0], opponent = restored.players[1];
    expect(player.active.specialConditions).toContain(SpecialCondition.ASLEEP);
    const selected = restored.copiedAttackCheckpoints![0].selectedAttack!;
    player.active.specialConditions = [];
    store.reduceEffect(restored, new AttackEffect(player, opponent, selected));
    expect(player.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });
});
