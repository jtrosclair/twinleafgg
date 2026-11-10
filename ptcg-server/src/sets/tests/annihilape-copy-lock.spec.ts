import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Annihilape } from '../set-destined-rivals/annihilape';
import { Garbodor } from '../set-breakpoint/garbodor';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { buildAttackListWithEnergyBlocking } from '../../game/store/prefabs/copy-attack-prefabs';

class FightingEnergy extends EnergyCard {
  public name = 'Test Fighting Energy'; public fullName = 'Test Fighting Energy'; public set = 'TEST'; public provides = [CardType.FIGHTING];
}
class Defender extends PokemonCard {
  public name = 'Test Defender'; public fullName = 'Test Defender'; public set = 'TEST'; public hp = 500;
}
function battle() {
  const state = new State(); const player = new Player(); const opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.phase = GamePhase.ATTACK; state.turn = 2;
  const mew = new Mewex(); const source = new Annihilape();
  player.active.cards = [mew, new FightingEnergy(), new FightingEnergy()];
  const bench = new PokemonCardList(); bench.cards = [source]; player.bench.push(bench);
  opponent.active.cards = [new Defender()];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, mew, source, store };
}
function resolve(b: ReturnType<typeof battle>, result: any) {
  const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
  if (!prompt) throw new Error('Expected pending prompt');
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, result));
}
function copyImpactBlow(b: ReturnType<typeof battle>) {
  b.store.reduceEffect(b.state, new PowerEffect(b.player, b.mew.powers[0], b.mew));
  resolve(b, b.source.attacks[0]);
  b.state.phase = GamePhase.FINISHED; resolve(b, null);
}

describe('Annihilape Impact Blow ownership', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());

  it('copies the attack lock without copying Vessel of Rage even if Mew is damaged', () => {
    const b = battle(); b.player.active.damage = 30;
    copyImpactBlow(b);
    expect(b.opponent.active.damage).toBe(160);
    // Resolving the animation also finishes the turn; the pending lock is now active.
    expect(b.player.active.cannotUseAttacksNextTurn).toContain('Impact Blow');
    const choices = buildAttackListWithEnergyBlocking(b.state, b.store, b.player, {
      copycatCard: b.mew, filter: slot => slot !== b.player.active
    });
    expect(choices.blocked.some(entry => entry.attack === 'Impact Blow')).toBe(true);
  });

  it('retains the copied Impact Blow restriction after saving and restoring the game', () => {
    const b = battle(); copyImpactBlow(b);
    const cards = [...b.player.active.cards, ...b.player.bench.flatMap(slot => slot.cards), ...b.opponent.active.cards];
    cards.forEach((card, index) => card.id = index);
    b.state.cardNames = cards.map(card => card.fullName);
    StateSerializer.setKnownCards([new Mewex(), new FightingEnergy(), new Defender(), new Annihilape()]);
    const serializer = new StateSerializer();
    const restored = serializer.deserialize(serializer.serialize(b.state));
    const store = new Store({ onStateChange: () => undefined }); store.restoreState(restored);
    const player = restored.players[0];
    expect(player.active.cannotUseAttacksNextTurn).toContain('Impact Blow');
    const choices = buildAttackListWithEnergyBlocking(restored, store, player, {
      copycatCard: player.active.getPokemonCard(), filter: slot => slot !== player.active
    });
    expect(choices.blocked.some(entry => entry.attack === 'Impact Blow')).toBe(true);
  });

  it('keeps the direct attack and damage bonus on a damaged Annihilape', () => {
    const b = battle(); b.player.active.cards = [b.source]; b.player.active.damage = 30; b.player.bench[0].cards = [];
    const attack = new AttackEffect(b.player, b.opponent, b.source.attacks[0]);
    b.store.reduceEffect(b.state, attack);
    expect(attack.damage).toBe(280);
    expect(b.player.active.cannotUseAttacksNextTurnPending).toContain('Impact Blow');
  });

  it('keeps the direct attack lock when Garbotoxin suppresses Vessel of Rage', () => {
    const b = battle(); b.player.active.cards = [b.source]; b.player.active.damage = 30; b.player.bench[0].cards = [];
    const slot = new PokemonCardList(); const tool = new FightingEnergy(); slot.cards = [new Garbodor(), tool]; slot.tools = [tool]; b.opponent.bench.push(slot);
    const attack = new AttackEffect(b.player, b.opponent, b.source.attacks[0]);
    b.store.reduceEffect(b.state, attack);
    expect(attack.damage).toBe(160);
    expect(b.player.active.cannotUseAttacksNextTurnPending).toContain('Impact Blow');
  });

  it('does not add a Vessel of Rage bonus without two damage counters', () => {
    const b = battle(); b.player.active.cards = [b.source]; b.player.active.damage = 10; b.player.bench[0].cards = [];
    const attack = new AttackEffect(b.player, b.opponent, b.source.attacks[0]);
    b.store.reduceEffect(b.state, attack);
    expect(attack.damage).toBe(160);
    expect(b.player.active.cannotUseAttacksNextTurnPending).toContain('Impact Blow');
  });
});
