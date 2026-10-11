import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { CardList } from '../../game/store/state/card-list';
import { Store } from '../../game/store/store';
import { PowerEffect, AttackEffect, KnockOutEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect, CheckHpEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Unown } from '../set-30th-celebration/unown';
import { CastformSnowyForm } from '../set-chilling-reign/castform-snowy-form';
import { Furfrou } from '../set-x-and-y/furfrou';
import { Alakazamex } from '../set-pokemon-151/alakazam-ex';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';

class ReviewPokemon extends PokemonCard {
  public name = 'Review Dummy'; public fullName = 'Review Dummy'; public set = 'TEST';
  public hp = 300; public attacks = [{ name: 'Hit', cost: [], damage: 10, text: '' }];
}
class ReviewEnergy extends EnergyCard { public name = 'Review Energy'; public fullName = 'Review Energy'; public set = 'TEST'; }
class ReviewStadium extends TrainerCard {
  public name = 'Review Stadium'; public fullName = 'Review Stadium'; public set = 'TEST';
  public trainerType = TrainerType.STADIUM;
}
function energy(type: CardType) { const card = new ReviewEnergy(); card.provides = [type]; return card; }
function battle() {
  const state = new State(); const player = new Player(); const opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2;
  state.phase = GamePhase.ATTACK;
  player.active.cards = [new ReviewPokemon()]; opponent.active.cards = [new ReviewPokemon()];
  for (const p of state.players) p.prizes = Array.from({ length: 6 }, () => {
    const list = new CardList(); list.cards = [new ReviewPokemon()]; return list;
  });
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, store };
}
function bench(b: ReturnType<typeof battle>, card: PokemonCard) {
  const slot = new PokemonCardList(); slot.cards = [card]; b.player.bench.push(slot); return slot;
}
function resolve(b: ReturnType<typeof battle>, result: any) {
  const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
  if (!prompt) throw new Error('Expected a pending prompt');
  // Real callbacks, isolated from unrelated legacy next-turn/table-state checks.
  return (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, result));
}
function chooseCopy(b: ReturnType<typeof battle>, mew: Mewex) {
  b.store.reduceEffect(b.state, new PowerEffect(b.player, mew.powers[0], mew));
}
function copy(b: ReturnType<typeof battle>, mew: Mewex, source: PokemonCard, index = 0) {
  chooseCopy(b, mew); resolve(b, source.attacks[index]);
}
function playStadium(b: ReturnType<typeof battle>) {
  return b.store.dispatch(new PlayCardAction(b.player.id, 0, {
    player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0
  }));
}

describe('confirmed engine review regressions', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());

  it('keeps copied KO extra prizes when an unrelated Store runs during attack animation', () => {
    for (const interleave of [false, true]) {
      const b = battle(); const mew = new Mewex(); const source = new Unown();
      b.player.active.cards = [mew, energy(CardType.PSYCHIC), energy(CardType.PSYCHIC)];
      bench(b, source); b.opponent.active.getPokemonCard()!.hp = 40; copy(b, mew, source);
      expect(b.opponent.active.damage).toBe(40); expect(b.store.hasPrompts()).toBe(true);
      if (interleave) {
        const other = battle();
        other.store.reduceEffect(other.state, new CheckHpEffect(other.player, other.player.active));
      }
      const ko = new KnockOutEffect(b.opponent, b.opponent.active); b.store.reduceEffect(b.state, ko);
      expect(ko.prizeCount).toBe(2);
    }
  });

  it('blocks copied Frosty Typhoon without Mew Energy despite source Weather Reading', () => {
    const b = battle(); const mew = new Mewex(); const source = new CastformSnowyForm();
    b.player.active.cards = [mew]; bench(b, source);
    b.player.discard.cards = Array.from({ length: 8 }, () => new ReviewStadium());
    const mewAttacks = mew.attacks; const sourceAttacks = source.attacks;
    chooseCopy(b, mew);
    const prompt: any = b.state.prompts.filter(p => p.result === undefined).pop();
    expect(prompt.options.blocked).toEqual([{ index: 0, attack: 'Frosty Typhoon' }]);
    expect(() => resolve(b, source.attacks[0])).toThrow(jasmine.objectContaining({ message: 'NOT_ENOUGH_ENERGY' }));
    expect(b.opponent.active.damage).toBe(0);
    expect(mew.attacks).toBe(mewAttacks); expect(source.attacks).toBe(sourceAttacks);
  });

  it('does not grant source Fur Coat after copying Energy Cutoff', () => {
    spyOn(Math, 'random').and.returnValue(0.9);
    const b = battle(); const mew = new Mewex(); const source = new Furfrou();
    b.player.active.cards = [mew, energy(CardType.PSYCHIC), energy(CardType.PSYCHIC), energy(CardType.PSYCHIC)];
    bench(b, source); copy(b, mew, source); resolve(b, true);
    // Finish the real animation callback without the pre-existing next-turn endGame(NONE) path.
    b.state.phase = GamePhase.FINISHED; resolve(b, null);
    b.state.activePlayer = 1; b.state.phase = GamePhase.ATTACK;
    const hit = new AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage: 40, text: '' });
    b.store.reduceEffect(b.state, new DealDamageEffect(hit, 40));
    expect(b.player.active.damage).toBe(40);
    expect(source.powers[0].name).toBe('Fur Coat');
  });

  it('retains real Stadium and Tool cost reductions for copied attacks', () => {
    const { DimensionValley } = require('../set-phantom-forces/dimension-valley');
    const { CounterGain } = require('../set-lost-thunder/counter-gain');
    for (const modifier of ['stadium', 'tool']) {
      const b = battle(); const mew = new Mewex(); const source = new CastformSnowyForm();
      b.player.active.cards = [mew, energy(CardType.WATER), energy(CardType.WATER)]; bench(b, source);
      if (modifier === 'stadium') b.player.stadium.cards = [new DimensionValley()];
      else { b.player.active.tools = [new CounterGain()]; b.opponent.prizes.pop(); }
      chooseCopy(b, mew);
      const prompt: any = b.state.prompts.filter(p => p.result === undefined).pop();
      expect(prompt.options.blocked).toEqual([]);
      resolve(b, source.attacks[0]); expect(b.opponent.active.damage).toBe(120);
      expect(mew.attacks[0].name).toBe('Teleportation Burst');
      expect(source.attacks[0].cost).toEqual([CardType.WATER, CardType.WATER, CardType.COLORLESS]);
    }
  });

  it('evaluates a copycat attack-reference cost modifier in the copycat context', () => {
    // Synthetic Mew modifier isolates reference-based own-card cost matching.
    const b = battle(); const mew = new Mewex(); const source = new CastformSnowyForm();
    b.player.active.cards = [mew, energy(CardType.WATER), energy(CardType.WATER)]; bench(b, source);
    const originalReduce = mew.reduceEffect;
    mew.reduceEffect = function(store, state, effect) {
      if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index >= 0) effect.cost.splice(index, 1);
      }
      return originalReduce.call(this, store, state, effect);
    };
    chooseCopy(b, mew);
    const prompt: any = b.state.prompts.filter(p => p.result === undefined).pop();
    expect(prompt.options.blocked).toEqual([]);
    resolve(b, source.attacks[0]); expect(b.opponent.active.damage).toBe(120);
  });

  it('does not remove Weather Reading from normal non-copied Castform cost checks', () => {
    const b = battle(); const source = new CastformSnowyForm(); b.player.active.cards = [source];
    b.player.discard.cards = Array.from({ length: 8 }, () => new ReviewStadium());
    const check = new CheckAttackCostEffect(b.player, source.attacks[0]);
    b.store.reduceEffect(b.state, check); expect(check.cost).toEqual([]);
  });

  it('retains copied Harden delayed markers through incoming damage and opponent EndTurn cleanup', () => {
    const { Onix } = require('../set-evolutions/onix');
    const { EndTurnEffect } = require('../../game/store/effects/game-phase-effects');
    const b = battle(); const mew = new Mewex(); const source = new Onix();
    b.player.active.cards = [mew, energy(CardType.FIGHTING)]; bench(b, source); copy(b, mew, source);
    expect(b.player.active.marker.hasMarker(source.HARDEN_MARKER, mew)).toBe(true);
    b.state.phase = GamePhase.FINISHED; resolve(b, null);
    b.state.activePlayer = 1; b.state.phase = GamePhase.ATTACK;
    const hit = new AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage: 40, text: '' });
    b.store.reduceEffect(b.state, new DealDamageEffect(hit, 40));
    expect(b.player.active.damage).toBe(0);
    b.state.phase = GamePhase.FINISHED; b.store.reduceEffect(b.state, new EndTurnEffect(b.opponent));
    expect(b.player.active.marker.hasMarker(source.HARDEN_MARKER, mew)).toBe(false);
    b.state.phase = GamePhase.ATTACK; b.store.reduceEffect(b.state, new DealDamageEffect(hit, 40));
    expect(b.player.active.damage).toBe(40);
    expect(mew.attacks[0].name).toBe('Teleportation Burst');
  });

  it('leaves an actual Furfrou passive Ability working normally', () => {
    const b = battle(); const source = new Furfrou(); b.player.active.cards = [source];
    const hit = new AttackEffect(b.opponent, b.player, { name: 'Hit', cost: [], damage: 40, text: '' });
    b.store.reduceEffect(b.state, new DealDamageEffect(hit, 40)); expect(b.player.active.damage).toBe(20);
  });

  it('pays for copied useOnBench attacks with active Mew Energy, not Alakazam Energy', () => {
    const b = battle(); const mew = new Mewex(); const source = new Alakazamex();
    b.player.active.cards = [mew, energy(CardType.PSYCHIC), energy(CardType.PSYCHIC)];
    const slot = bench(b, source);
    expect(() => copy(b, mew, source, 1)).not.toThrow();
    expect(b.opponent.active.damage).toBe(120);
    expect(b.player.active.triggerAttackAnimation).toBe(true); expect(slot.triggerAttackAnimation).toBe(false);
  });

  it('uses the copycat type and animation source for copied useOnBench attacks', () => {
    const b = battle(); const mew = new Mewex(); const source = new Alakazamex();
    // Labeled artificial Fire type isolates attacker identity, not printed Mew metadata.
    mew.cardType = CardType.FIRE; b.opponent.active.getPokemonCard()!.weakness = [{ type: CardType.FIRE }];
    b.player.active.cards = [mew, energy(CardType.PSYCHIC), energy(CardType.PSYCHIC)];
    const slot = bench(b, source); slot.cards.push(energy(CardType.PSYCHIC), energy(CardType.PSYCHIC));
    copy(b, mew, source, 1);
    expect(b.opponent.active.damage).toBe(240);
    expect(b.player.active.triggerAttackAnimation).toBe(true); expect(slot.triggerAttackAnimation).toBe(false);
  });

  it('preserves ordinary non-delegated useOnBench attacker selection', () => {
    const b = battle(); const source = new Alakazamex(); const slot = bench(b, source);
    slot.cards.push(energy(CardType.PSYCHIC), energy(CardType.PSYCHIC));
    b.store.reduceEffect(b.state, new UseAttackEffect(b.player, source.attacks[1]));
    expect(slot.triggerAttackAnimation).toBe(true); expect(b.player.active.triggerAttackAnimation).toBe(false);
    b.state.phase = GamePhase.FINISHED; resolve(b, null);
    expect(b.opponent.active.damage).toBe(120);
  });

  it('releases cancelled Stadium allowance through PlayCardAction and permits a subsequent heads play', () => {
    const random = spyOn(Math, 'random').and.returnValue(0.9);
    const b = battle(); b.state.phase = GamePhase.PLAYER_TURN;
    b.player.coinFlipCancelTrainerPlayTurnsRemaining = 1;
    const old = new ReviewStadium(); old.name = 'Old'; b.opponent.stadium.cards = [old];
    const failed = new ReviewStadium(); failed.name = 'Failed';
    const next = new ReviewStadium(); next.name = 'Next'; b.player.hand.cards = [failed, next];
    const previousAllowance = b.player.stadiumPlayedTurn;
    playStadium(b); resolve(b, true);
    expect(b.player.discard.cards).toContain(failed); expect(b.opponent.stadium.cards).toEqual([old]);
    expect(b.player.stadiumPlayedTurn).toBe(previousAllowance);
    random.and.returnValue(0.1);
    expect(() => playStadium(b)).not.toThrow();
    if (b.store.hasPrompts()) resolve(b, true);
    expect(b.player.stadium.cards).toEqual([next]); expect(b.opponent.stadium.cards).toEqual([]);
    expect(b.opponent.discard.cards).toContain(old); expect(b.player.stadiumPlayedTurn).toBe(b.state.turn);
  });
});
