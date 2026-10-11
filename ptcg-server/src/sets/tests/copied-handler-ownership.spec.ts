import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { PowerEffect, AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike } from '../../game/store/store-like';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Onix } from '../set-evolutions/onix';
import { Unown } from '../set-30th-celebration/unown';
import { CastformSnowyForm } from '../set-chilling-reign/castform-snowy-form';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Drednaw } from '../set-stellar-crown/drednaw';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';

class OwnershipEnergy extends EnergyCard {
  public name = 'Ownership Energy'; public fullName = 'Ownership Energy'; public set = 'TEST';
}
class OwnershipDefender extends PokemonCard {
  public name = 'Ownership Defender'; public fullName = 'Ownership Defender'; public set = 'TEST';
  public hp = 400;
}
// Adversarial legacy fixtures: both branches share one handler and the same event.
// They model the absent ownership boundary; they are not replacement card implementations.
class MixedOwnershipSource extends Onix {
  public powers = [{ name: 'Fixture Shell', powerType: PowerType.ABILITY, text: 'Prevent incoming damage of 200 or more.' }];
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    state = super.reduceEffect(store, state, effect);
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this) && effect.damage >= 200) {
      effect.damage = 0;
    }
    return state;
  }
}
class InitialOwnershipSource extends OwnershipDefender {
  public powers = [{ name: 'Fixture Boost', powerType: PowerType.ABILITY, text: 'This Pokémon attacks do 40 more damage.' }];
  public attacks = [{ name: 'Fixture Attack', cost: [], damage: 40, text: 'This attack does 10 more damage.' }];
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += 10; // Attack-owned branch.
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += 40; // Ability-owned branch, intentionally no PowerEffect hook.
    }
    return state;
  }
}
function battle() {
  const state = new State(); const player = new Player(); const opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2;
  state.phase = GamePhase.ATTACK;
  const mew = new Mewex(); player.active.cards = [mew]; opponent.active.cards = [new OwnershipDefender()];
  for (let i = 0; i < 3; i++) {
    const energy = new OwnershipEnergy(); energy.provides = [CardType.PSYCHIC]; player.active.cards.push(energy);
  }
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, store, mew };
}
function resolve(b: ReturnType<typeof battle>, result: any) {
  const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
  if (!prompt) throw new Error('Expected pending prompt');
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, result));
}
function copy(b: ReturnType<typeof battle>, source: PokemonCard, index = 0) {
  const slot = new PokemonCardList(); slot.cards = [source]; b.player.bench.push(slot);
  b.store.reduceEffect(b.state, new PowerEffect(b.player, b.mew.powers[0], b.mew));
  resolve(b, source.attacks[index]);
  // Run the actual animation callback, excluding unrelated legacy next-turn initialization.
  b.state.phase = GamePhase.FINISHED; resolve(b, null);
  b.state.activePlayer = 1; b.state.phase = GamePhase.ATTACK;
}
function hit(b: ReturnType<typeof battle>, damage: number) {
  const attack = new AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage, text: '' });
  b.store.reduceEffect(b.state, new DealDamageEffect(attack, damage));
}

describe('copied handler ownership architectural acceptance', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());

  it('copies Hard Crunch without inheriting unguarded Impervious Shell on incoming 200 damage', () => {
    const b = battle(); const source = new Drednaw(); copy(b, source);
    expect(b.opponent.active.damage).toBe(80);
    hit(b, 200);
    expect(b.player.active.damage).toBe(200);
  });

  it('does not allow an unrelated passive merely because Harden armed a copied marker', () => {
    const b = battle(); const source = new MixedOwnershipSource();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, source);
    expect(b.player.active.marker.hasMarker(source.HARDEN_MARKER, b.mew)).toBe(true);
    hit(b, 200);
    expect(b.player.active.damage).toBe(200);
  });

  it('does not inherit an unguarded Ability branch on the initial AttackEffect', () => {
    const b = battle(); copy(b, new InitialOwnershipSource());
    expect(b.opponent.active.damage).toBe(50);
  });

  it('keeps actual Drednaw Impervious Shell effective on its own incoming damage', () => {
    const b = battle(); b.player.active.cards = [new Drednaw()]; hit(b, 200);
    expect(b.player.active.damage).toBe(0);
  });

  it('copies the legitimate conditional Hard Crunch bonus', () => {
    const b = battle(); b.opponent.active.damage = 10; copy(b, new Drednaw());
    expect(b.opponent.active.damage).toBe(170);
  });

  it('does not prevent below-threshold incoming damage after copying Drednaw', () => {
    const b = battle(); copy(b, new Drednaw()); hit(b, 190);
    expect(b.player.active.damage).toBe(190);
  });

  it('retains the legitimate copied Harden defense on a source with no passive Ability', () => {
    const b = battle(); const source = new Onix();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, source); hit(b, 40);
    expect(b.player.active.damage).toBe(0);
  });

  it('cleans copied Harden markers when the opponent turn ends', () => {
    const b = battle(); const source = new Onix();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, source); b.state.phase = GamePhase.FINISHED;
    b.store.reduceEffect(b.state, new EndTurnEffect(b.opponent));
    expect(b.player.active.marker.hasMarker(source.HARDEN_MARKER, b.mew)).toBe(false);
    b.state.phase = GamePhase.ATTACK; hit(b, 40);
    expect(b.player.active.damage).toBe(40);
  });

  it('keeps attack-induced defense despite an unrelated passive on the same source', () => {
    const b = battle(); const source = new MixedOwnershipSource();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.FIGHTING];
    copy(b, source); hit(b, 40);
    expect(b.player.active.damage).toBe(0);
  });

  it('retains copied Mysterious Signal extra prizes without requiring an attack marker', () => {
    const b = battle(); b.opponent.active.getPokemonCard()!.hp = 40; copy(b, new Unown());
    b.state.activePlayer = 0;
    const ko = new KnockOutEffect(b.opponent, b.opponent.active); b.store.reduceEffect(b.state, ko);
    expect(ko.prizeCount).toBe(2);
  });

  it('retains copied cannot-attack-next-turn effects', () => {
    const b = battle();
    (b.player.active.cards[1] as EnergyCard).provides = [CardType.WATER];
    (b.player.active.cards[2] as EnergyCard).provides = [CardType.WATER];
    copy(b, new CastformSnowyForm());
    expect(b.player.active.cannotUseAttacksNextTurn.concat(b.player.active.cannotUseAttacksNextTurnPending))
      .toContain('Frosty Typhoon');
    expect(b.opponent.active.damage).toBe(120);
  });

  it('preserves copycat and source attack references and all printed identities', () => {
    const b = battle(); const source = new Drednaw();
    const attacks = b.mew.attacks; const sourceAttacks = source.attacks; copy(b, source);
    expect(b.mew.attacks).toBe(attacks); expect(source.attacks).toBe(sourceAttacks);
    expect(b.mew.fullName).toBe('Mew ex 30C'); expect(b.mew.setNumber).toBe('57');
    expect(b.mew.usSetNumber).toBe('30C 66');
    expect(source.fullName).toBe('Drednaw SCR'); expect(source.setNumber).toBe('44');
  });
});
