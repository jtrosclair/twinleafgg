import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType } from '../../game/store/card/card-types';
import { Player } from '../../game/store/state/player';
import { State, GamePhase } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';

class TestPokemon extends PokemonCard { public set = 'TEST'; public name = 'Test'; public fullName = 'Test Pokemon'; }
class TestEnergy extends EnergyCard { public set = 'TEST'; public name = 'Energy'; public fullName = 'Test Energy'; }

function battle() {
  const state = new State(); const player = new Player(); const opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.turn = 2;
  state.phase = GamePhase.ATTACK;
  const card = new TestPokemon(); card.hp = 200; card.name = 'Attacker';
  card.attacks = [{ name: 'Hit', damage: 40, cost: [], text: '' }];
  player.active.cards = [card];
  const defender = new TestPokemon(); defender.hp = 200; defender.name = 'Defender';
  opponent.active.cards = [defender];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  return { state, player, opponent, card, store };
}
function energy(type: CardType = CardType.DARK) {
  const e = new TestEnergy(); e.provides = [type]; return e;
}
function resolve(b: ReturnType<typeof battle>, result: any) {
  const prompt = b.state.prompts.filter(p => p.result === undefined).pop()!;
  // Resolve real prompt callbacks without unrelated table-state/prize processing.
  (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, result));
}

describe('30C engine compatibility', () => {
  beforeEach(() => require('../../game/store/prefabs/copy-attack-delegation').clearCopyAttackSessionsForTests());
  it('Tri-Bite discards one Energy card for each heads, capped at attached cards', () => {
    spyOn(Math, 'random').and.returnValue(0.1);
    const b = battle(); const { Hydreigon } = require('../set-30th-celebration/hydreigon');
    const card = new Hydreigon(); b.player.active.cards = [card];
    const energies = [energy(), energy()]; b.opponent.active.cards.push(...energies);
    b.store.reduceEffect(b.state, new AttackEffect(b.player, b.opponent, card.attacks[0]));
    resolve(b, true); resolve(b, true); resolve(b, true);
    const prompt: any = b.state.prompts.filter(p => p.result === undefined).pop();
    expect(prompt.options.min).toBe(2); expect(prompt.options.max).toBe(2);
    resolve(b, energies);
    expect(b.opponent.discard.cards).toEqual(energies);
    expect(b.opponent.active.cards.length).toBe(1);
  });
  it('Luring Glow propagates an attack gust that the selected Pokémon can prevent', () => {
    const b = battle(); const { Volbeat } = require('../set-30th-celebration/volbeat');
    const { AfterAttackEffect } = require('../../game/store/effects/game-phase-effects');
    const { GustOpponentBenchEffect } = require('../../game/store/effects/attack-effects');
    const card = new Volbeat(); b.player.active.cards = [card];
    const slot = new PokemonCardList(); const protectedCard = new TestPokemon(); slot.cards = [protectedCard];
    b.opponent.bench.push(slot);
    protectedCard.reduceEffect = (store, state, effect) => {
      if (effect instanceof GustOpponentBenchEffect) effect.preventDefault = true;
      return state;
    };
    const previous = b.opponent.active;
    b.store.reduceEffect(b.state, new AfterAttackEffect(b.player, b.opponent, card.attacks[0]));
    resolve(b, [slot]); expect(b.opponent.active).toBe(previous);
    protectedCard.reduceEffect = (store, state) => state;
    b.store.reduceEffect(b.state, new AfterAttackEffect(b.player, b.opponent, card.attacks[0]));
    resolve(b, [slot]); expect(b.opponent.active).toBe(slot);
  });

  it('Rally Back rewards only an attack-damage KO during the opponent last turn', () => {
    const b = battle(); const { Tropius } = require('../set-30th-celebration/tropius');
    const { PutDamageEffect, PutCountersEffect } = require('../../game/store/effects/attack-effects');
    const { KnockOutEffect } = require('../../game/store/effects/game-effects');
    const card = new Tropius(); b.player.active.cards = [card];
    const victim = new PokemonCardList(); const pokemon = new TestPokemon(); pokemon.hp = 40; victim.cards = [pokemon]; b.player.bench.push(victim);
    b.state.activePlayer = 1;
    const hit = new AttackEffect(b.opponent, b.player, b.card.attacks[0]);
    const counters = new PutCountersEffect(hit, 40); counters.target = victim; b.store.reduceEffect(b.state, counters);
    b.store.reduceEffect(b.state, new KnockOutEffect(b.player, victim));
    const noBonus = new AttackEffect(b.player, b.opponent, card.attacks[0]); card.reduceEffect(b.store,b.state,noBonus);
    expect(noBonus.damage).toBe(30);
    victim.cards = [pokemon]; victim.damage = 0;
    const damage = new PutDamageEffect(hit, 40); damage.target = victim; b.store.reduceEffect(b.state, damage);
    b.store.reduceEffect(b.state, new KnockOutEffect(b.player, victim));
    const bonus = new AttackEffect(b.player,b.opponent,card.attacks[0]); card.reduceEffect(b.store,b.state,bonus);
    expect(bonus.damage).toBe(120);
  });

  it('Mysterious Signal takes one extra prize for its own lethal attack damage only', () => {
    const b = battle(); const { Unown } = require('../set-30th-celebration/unown');
    const { PutDamageEffect, PutCountersEffect } = require('../../game/store/effects/attack-effects');
    const { KnockOutEffect } = require('../../game/store/effects/game-effects');
    const card = new Unown(); b.player.active.cards = [card]; b.opponent.active.getPokemonCard()!.hp = 40;
    const attack = new AttackEffect(b.player,b.opponent,card.attacks[0]);
    b.store.reduceEffect(b.state,new PutDamageEffect(attack,40));
    const ko = new KnockOutEffect(b.opponent,b.opponent.active); b.store.reduceEffect(b.state,ko);
    expect(ko.prizeCount).toBe(2);
    const other = new TestPokemon(); other.hp = 40; b.opponent.active.cards = [other]; b.opponent.active.damage = 0;
    b.store.reduceEffect(b.state,new PutCountersEffect(attack,40));
    const countersKo = new KnockOutEffect(b.opponent,b.opponent.active); b.store.reduceEffect(b.state,countersKo);
    expect(countersKo.prizeCount).toBe(1);
  });

  it('Growl reduces outgoing damage before weakness, then clears when the defender switches', () => {
    const b = battle(); const { NidoranFemale } = require('../set-30th-celebration/nidoran-f');
    const { DealDamageEffect } = require('../../game/store/effects/attack-effects');
    const card = new NidoranFemale(); b.player.active.cards = [card];
    b.opponent.active.getPokemonCard()!.cardType = CardType.FIGHTING;
    b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,card.attacks[0]));
    const attack = new AttackEffect(b.opponent,b.player,{ name:'Hit',cost:[],damage:50,text:'' });
    b.store.reduceEffect(b.state,new DealDamageEffect(attack,50));
    expect(b.player.active.damage).toBe(40);
    const replacement = new PokemonCardList(); replacement.cards = [new TestPokemon()]; b.opponent.bench.push(replacement);
    const previous = b.opponent.active; b.opponent.switchPokemon(replacement,b.store,b.state);
    expect((previous as any).attackDamageReductionNextTurn).toBe(0);
  });

  it('Memory Helix executes copied attack damage and its KO bonus as Mew, without mutating either card', () => {
    const b = battle(); const { Mewex } = require('../set-30th-celebration/mew-ex');
    const { Unown } = require('../set-30th-celebration/unown');
    const { PowerEffect, KnockOutEffect } = require('../../game/store/effects/game-effects');
    const mew = new Mewex(); const source = new Unown(); const bench = new PokemonCardList(); bench.cards = [source];
    b.player.active.cards = [mew,energy(CardType.PSYCHIC),energy(CardType.PSYCHIC)]; b.player.bench.push(bench);
    b.opponent.active.getPokemonCard()!.hp = 40;
    const mewAttacks = mew.attacks; const sourceAttacks = source.attacks;
    b.store.reduceEffect(b.state,new PowerEffect(b.player,mew.powers[0],mew));
    resolve(b,source.attacks[0]);
    expect(b.opponent.active.damage).toBe(40);
    expect(mew.attacks).toBe(mewAttacks); expect(source.attacks).toBe(sourceAttacks);
    const ko = new KnockOutEffect(b.opponent,b.opponent.active); b.store.reduceEffect(b.state,ko);
    expect(ko.prizeCount).toBe(2);
  });

  it('Overwriting Bolt replaces weakness with Lightning x2 without changing printed identity', () => {
    const b = battle(); const { Pikachu40 } = require('../set-30th-celebration/pikachu-40');
    const { DealDamageEffect } = require('../../game/store/effects/attack-effects');
    const card = new Pikachu40(); b.player.active.cards = [card];
    const defender = b.opponent.active.getPokemonCard()!; defender.weakness = [{type:CardType.FIRE,value:20}];
    b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,card.attacks[0]));
    b.store.reduceEffect(b.state,new DealDamageEffect(new AttackEffect(b.player,b.opponent,card.attacks[0]),10));
    expect(b.opponent.active.damage).toBe(20);
    expect(defender.weakness).toEqual([{type:CardType.FIRE,value:20}]);
    expect(card.fullName).toBe('Pikachu 30C 40'); expect(card.setNumber).toBe('40');
  });

  it('Screech adds damage after weakness only on the attacker next turn and expires after it', () => {
    const b = battle(); const { JangmoO } = require('../set-30th-celebration/jangmo-o');
    const { DealDamageEffect } = require('../../game/store/effects/attack-effects');
    const { EndTurnEffect } = require('../../game/store/effects/game-phase-effects');
    const { gamePhaseReducer } = require('../../game/store/effect-reducers/game-phase-effect');
    const card = new JangmoO(); b.player.active.cards = [card]; card.cardType = CardType.LIGHTNING;
    b.opponent.active.getPokemonCard()!.weakness = [{type:CardType.LIGHTNING}];
    b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,card.attacks[0]));
    const hit = new AttackEffect(b.player,b.opponent,{name:'Hit',cost:[],damage:20,text:''});
    b.store.reduceEffect(b.state,new DealDamageEffect(hit,20)); expect(b.opponent.active.damage).toBe(40);
    // Exercise real EndTurn lifecycle without unrelated game-winner/next-turn initialization.
    b.state.phase = GamePhase.FINISHED;
    gamePhaseReducer(b.store,b.state,new EndTurnEffect(b.player));
    b.state.activePlayer = 1; gamePhaseReducer(b.store,b.state,new EndTurnEffect(b.opponent));
    b.state.activePlayer = 0; b.state.phase = GamePhase.ATTACK; b.opponent.active.damage = 0;
    b.store.reduceEffect(b.state,new DealDamageEffect(hit,20)); expect(b.opponent.active.damage).toBe(70);
    b.state.phase = GamePhase.FINISHED; gamePhaseReducer(b.store,b.state,new EndTurnEffect(b.player));
    b.opponent.active.damage = 0; b.store.reduceEffect(b.state,new DealDamageEffect(hit,20));
    expect(b.opponent.active.damage).toBe(40);
  });

  it('Hide protects damage and non-damage effects only during the next opponent turn', () => {
    spyOn(Math,'random').and.returnValue(0.1);
    const b = battle(); const { Cherubi } = require('../set-30th-celebration/cherubi');
    const { DealDamageEffect, AddSpecialConditionsEffect, PutCountersEffect } = require('../../game/store/effects/attack-effects');
    const { SpecialCondition } = require('../../game/store/card/card-types');
    const { EndTurnEffect } = require('../../game/store/effects/game-phase-effects');
    const { gamePhaseReducer } = require('../../game/store/effect-reducers/game-phase-effect');
    const card = new Cherubi(); b.player.active.cards = [card];
    b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,card.attacks[0])); resolve(b,true);
    b.state.phase = GamePhase.FINISHED; gamePhaseReducer(b.store,b.state,new EndTurnEffect(b.player));
    const attack = new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:10,text:''});
    b.store.reduceEffect(b.state,new DealDamageEffect(attack,10));
    b.store.reduceEffect(b.state,new PutCountersEffect(attack,10));
    b.store.reduceEffect(b.state,new AddSpecialConditionsEffect(attack,[SpecialCondition.POISONED]));
    expect(b.player.active.damage).toBe(0); expect(b.player.active.specialConditions).toEqual([]);
    b.state.activePlayer = 1; gamePhaseReducer(b.store,b.state,new EndTurnEffect(b.opponent));
    b.store.reduceEffect(b.state,new DealDamageEffect(attack,10));
    expect(b.player.active.damage).toBe(10);
  });

  it('Quaking Fist discards a Trainer on tails without running its effect, but allows heads', () => {
    const random = spyOn(Math,'random').and.returnValue(0.9);
    const b = battle(); const { Seismitoad } = require('../set-30th-celebration/seismitoad');
    const { TrainerCard } = require('../../game/store/card/trainer-card');
    const { PlayItemEffect, TrainerEffect } = require('../../game/store/effects/play-card-effects');
    const card = new Seismitoad(); b.player.active.cards = [card];
    b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,card.attacks[0]));
    const trainer = new TrainerCard(); let plays = 0;
    trainer.reduceEffect = (store: any,state: any,effect: any) => {
      if (effect instanceof TrainerEffect && effect.trainerCard === trainer) plays++;
      return state;
    };
    b.opponent.hand.cards = [trainer];
    b.store.reduceEffect(b.state,new PlayItemEffect(b.opponent,trainer)); resolve(b,true);
    expect(plays).toBe(0); expect(b.opponent.discard.cards).toContain(trainer);
    b.opponent.discard.cards = []; b.opponent.hand.cards = [trainer]; random.and.returnValue(0.1);
    b.store.reduceEffect(b.state,new PlayItemEffect(b.opponent,trainer)); resolve(b,true);
    expect(plays).toBe(1); expect(b.opponent.discard.cards).toContain(trainer);
  });

  it('Memory Helix enforces copied attack Energy and status checks against the active Mew', () => {
    const { Mewex } = require('../set-30th-celebration/mew-ex');
    const { Unown } = require('../set-30th-celebration/unown');
    const { PowerEffect } = require('../../game/store/effects/game-effects');
    const { SpecialCondition } = require('../../game/store/card/card-types');
    const b = battle(); const mew = new Mewex(); const source = new Unown();
    const slot = new PokemonCardList(); slot.cards = [source,energy(CardType.PSYCHIC),energy(CardType.PSYCHIC)];
    b.player.active.cards = [mew]; b.player.bench.push(slot);
    b.store.reduceEffect(b.state,new PowerEffect(b.player,mew.powers[0],mew));
    const prompt: any = b.state.prompts.filter(p=>p.result===undefined).pop();
    expect(prompt.options.blocked).toEqual([{index:0,attack:'Mysterious Signal'}]);
    expect(() => resolve(b,source.attacks[0])).toThrow();
    expect(b.opponent.active.damage).toBe(0);
    b.player.active.cards.push(energy(CardType.PSYCHIC),energy(CardType.PSYCHIC));
    b.player.active.specialConditions = [SpecialCondition.ASLEEP];
    expect(() => resolve(b,source.attacks[0])).toThrow();
    expect(b.opponent.active.damage).toBe(0);
    expect(mew.attacks[0].name).toBe('Teleportation Burst');
  });

  it('resolves a selected copied attack to its actual card when attack names collide', () => {
    const { findPokemonCardForAttack } = require('../../game/store/prefabs/copy-attack-prefabs');
    const first = new TestPokemon(); const second = new TestPokemon();
    first.attacks = [{name:'Hit',cost:[],damage:10,text:''}];
    second.attacks = [{name:'Hit',cost:[],damage:70,text:''}];
    expect(findPokemonCardForAttack([first,second],second.attacks[0])).toBe(second);
  });

  it('Memory Helix waits through copied Tri-Bite coin and discard prompts without using Teleportation Burst', () => {
    spyOn(Math,'random').and.returnValue(0.1);
    const b = battle(); const { Mewex } = require('../set-30th-celebration/mew-ex');
    const { Hydreigon } = require('../set-30th-celebration/hydreigon');
    const { PowerEffect } = require('../../game/store/effects/game-effects');
    const mew = new Mewex(); const source = new Hydreigon(); const slot = new PokemonCardList(); slot.cards = [source];
    b.player.bench.push(slot); b.player.active.cards = [mew,energy()];
    const energies = [energy(),energy()]; b.opponent.active.cards.push(...energies);
    b.store.reduceEffect(b.state,new PowerEffect(b.player,mew.powers[0],mew)); resolve(b,source.attacks[0]);
    expect(b.opponent.active.damage).toBe(0);
    resolve(b,true); resolve(b,true); resolve(b,true);
    const prompt: any = b.state.prompts.filter(p=>p.result===undefined).pop(); expect(prompt.options.min).toBe(2);
    resolve(b,energies); expect(b.opponent.discard.cards).toEqual(energies);
    expect(b.opponent.active.damage).toBe(0); expect(mew.attacks[0].name).toBe('Teleportation Burst');
    expect(b.state.prompts.filter(p=>p.result===undefined).map(p=>p.type)).not.toContain('Confirm');
  });

  it('keeps the legacy Energy-discard default at one card', () => {
    const b = battle(); const energies = [energy(),energy()]; b.opponent.active.cards.push(...energies);
    const { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } = require('../../game/store/prefabs/attack-effects');
    DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(b.store,b.state,new AttackEffect(b.player,b.opponent,b.card.attacks[0]));
    const prompt: any = b.state.prompts.filter(p=>p.result===undefined).pop();
    expect(prompt.options.min).toBe(1); expect(prompt.options.max).toBe(1);
    resolve(b,[energies[0]]); expect(b.opponent.discard.cards).toEqual([energies[0]]);
    expect(b.opponent.active.cards).toContain(energies[1]);
  });

  it('keeps switching without sourceEffect on the legacy direct path', () => {
    const b = battle(); const slot = new PokemonCardList(); slot.cards = [new TestPokemon()]; b.opponent.bench.push(slot);
    const { SWITCH_IN_OPPONENT_BENCHED_POKEMON } = require('../../game/store/prefabs/prefabs');
    SWITCH_IN_OPPONENT_BENCHED_POKEMON(b.store,b.state,b.player);
    resolve(b,[slot]); expect(b.opponent.active).toBe(slot);
  });

  it('arms Agility and Well-Hidden on heads and leaves protection unarmed on tails', () => {
    const random = spyOn(Math,'random').and.returnValue(0.1);
    for (const [file,name] of [['pikachu-44','Pikachu44'],['slowpoke','Slowpoke']]) {
      const b = battle(); const card = new (require('../set-30th-celebration/'+file)[name])(); b.player.active.cards = [card];
      b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,card.attacks[0])); resolve(b,true);
      expect(b.player.active.preventDamageNextTurnPending).toBe(true);
      expect(b.player.active.preventEffectsOfAttacksNextTurnPending).toBe(true);
      b.player.active.clearEffects(); random.and.returnValue(0.9);
      b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,card.attacks[0])); resolve(b,true);
      expect(b.player.active.preventDamageNextTurnPending).toBe(false);
      expect(b.player.active.preventEffectsOfAttacksNextTurnPending).toBe(false);
      random.and.returnValue(0.1);
    }
  });

  it('Retaliate uses attack-damage last-turn tracking and clears after the owner turn', () => {
    const b = battle(); const { Umbreon } = require('../set-30th-celebration/umbreon');
    const { EndTurnEffect } = require('../../game/store/effects/game-phase-effects');
    const { gamePhaseReducer } = require('../../game/store/effect-reducers/game-phase-effect');
    const card = new Umbreon(); b.player.active.cards = [card];
    b.player.pokemonKnockedOutByAttackDuringOpponentsLastTurn = true;
    const attack = new AttackEffect(b.player,b.opponent,card.attacks[0]); b.store.reduceEffect(b.state,attack);
    expect(attack.damage).toBe(130);
    b.state.phase = GamePhase.FINISHED; gamePhaseReducer(b.store,b.state,new EndTurnEffect(b.player));
    const cleared = new AttackEffect(b.player,b.opponent,card.attacks[0]); b.store.reduceEffect(b.state,cleared);
    expect(cleared.damage).toBe(30);
  });

  it('copied attack damage uses Mew Psychic type rather than the benched source type', () => {
    const b = battle(); const { Mewex } = require('../set-30th-celebration/mew-ex');
    const { PowerEffect } = require('../../game/store/effects/game-effects');
    const mew = new Mewex(); const source = new TestPokemon(); source.cardType = CardType.FIRE;
    source.attacks = [{name:'Hit',cost:[],damage:10,text:''}];
    const slot = new PokemonCardList(); slot.cards = [source]; b.player.bench.push(slot); b.player.active.cards = [mew];
    b.opponent.active.getPokemonCard()!.weakness = [{type:CardType.PSYCHIC}];
    b.store.reduceEffect(b.state,new PowerEffect(b.player,mew.powers[0],mew)); resolve(b,source.attacks[0]);
    expect(b.opponent.active.damage).toBe(20); expect(source.cardType).toBe(CardType.FIRE);
  });

  it('weakness override persists through the opponent turn and expires after the attacker next turn', () => {
    const b = battle(); const { Pikachu40 } = require('../set-30th-celebration/pikachu-40');
    const { EndTurnEffect } = require('../../game/store/effects/game-phase-effects');
    const { gamePhaseReducer } = require('../../game/store/effect-reducers/game-phase-effect');
    const card = new Pikachu40(); b.player.active.cards = [card];
    b.store.reduceEffect(b.state,new AttackEffect(b.player,b.opponent,card.attacks[0]));
    b.state.phase = GamePhase.FINISHED; gamePhaseReducer(b.store,b.state,new EndTurnEffect(b.player));
    expect(b.opponent.active.weaknessOverrideType).toBe(CardType.LIGHTNING);
    b.state.activePlayer = 1; gamePhaseReducer(b.store,b.state,new EndTurnEffect(b.opponent));
    expect(b.opponent.active.weaknessOverrideType).toBe(CardType.LIGHTNING);
    b.state.activePlayer = 0; gamePhaseReducer(b.store,b.state,new EndTurnEffect(b.player));
    expect(b.opponent.active.weaknessOverrideType).toBeUndefined();
  });

  it('trainer cancellation covers Stadiums, Supporters and Tools without consuming their normal play slots', () => {
    spyOn(Math,'random').and.returnValue(0.9);
    const { TrainerCard } = require('../../game/store/card/trainer-card');
    const { PlayStadiumEffect, PlaySupporterEffect, AttachPokemonToolEffect } = require('../../game/store/effects/play-card-effects');
    for (const kind of ['stadium','supporter','tool']) {
      const b = battle(); const trainer = new TrainerCard(); b.opponent.hand.cards = [trainer];
      const oldStadium = new TrainerCard(); b.opponent.stadium.cards = [oldStadium];
      b.opponent.coinFlipCancelTrainerPlayTurnsRemaining = 1;
      const play = kind === 'stadium' ? new PlayStadiumEffect(b.opponent,trainer)
        : kind === 'supporter' ? new PlaySupporterEffect(b.opponent,trainer)
        : new AttachPokemonToolEffect(b.opponent,trainer,b.opponent.active);
      b.store.reduceEffect(b.state,play); resolve(b,true);
      expect(b.opponent.discard.cards).toContain(trainer);
      expect(b.opponent.stadium.cards).toEqual([oldStadium]);
      expect(b.opponent.supporterTurn).toBe(0); expect(b.opponent.active.tools).toEqual([]);
    }
  });

});
