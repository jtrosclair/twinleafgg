import { GameMessage } from '../../game/game-message';
import { AttackAction, PassTurnAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { CheckPrizesDestinationEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { PutDamagePrompt } from '../../game/store/prompts/put-damage-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { GamePhase, GameWinner, State } from '../../game/store/state/state';
import { padDeck, PokemonSlotConfig, setupGame } from './test-helpers';

const punch = 'Vengeful Punch OBF';
const spell = 'Spell Tag LOT';
const golem = 'Golem FST 137';
const qwilfish = 'Qwilfish CRE';
const maractus = 'Maractus JTG';
const mew = 'Mew ex MEW';
const pecharunt = 'Pecharunt ex SFA';
const arceus = 'Arceus V BRS';
const fighter = 'Fighting Energy SVE';
const lightning = 'Lightning Energy SVE';
const darkness = 'Darkness Energy SVE';
const water = 'Water Energy SVE';
const psychic = 'Psychic Energy SVE';
const photon = 'Photon Blaster';
const miraidon = { card: 'Miraidon ex SVI', energy: [lightning, lightning, darkness] };
const electivire = { ...miraidon, card: 'Electivire ex DRI' };
const moon = { card: 'Roaring Moon ex PAR', energy: [darkness, darkness, darkness] };
const foeActive = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const foeBench = (index: number) => ({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
const myBench = (index: number) => ({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });

function battle(defender: PokemonSlotConfig, {
  attacker = miraidon as PokemonSlotConfig,
  attackBench = [{ card: mew }] as PokemonSlotConfig[],
  defenseBench = [{ card: pecharunt }] as PokemonSlotConfig[],
  attackPrizes = 5, defensePrizes = 6
} = {}) {
  return setupGame({
    turn: 5,
    player1: { active: attacker, bench: attackBench, prizeCount: attackPrizes, deck: padDeck(18) },
    player2: { active: defender, bench: defenseBench, prizeCount: defensePrizes, deck: padDeck(18) }
  });
}

describe('Knock Out retaliation and Prize timing', () => {
  for (const benched of [false, true]) {
    it(`places exactly four Vengeful Punch counters from a ${benched ? 'Benched' : 'Active'} holder`, () => {
      const withTool = { card: mew, damage: 130, tools: [punch] };
      const { store, player1, player2, overridePrompt } = battle(benched ? { card: arceus } : withTool,
        { attacker: electivire, defenseBench: benched ? [withTool] : [{ card: pecharunt }] });
      const slot = benched ? player2.bench[0] : player2.active;
      const holder = slot.getPokemonCard()!;
      const tool = slot.tools[0];
      expect(slot.cards).toContain(tool);
      overridePrompt('Choose pokemon', () => [foeActive, foeBench(0)]);
      store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
      expect(player2.discard.cards).toContain(holder);
      expect(player2.discard.cards.filter(card => card === tool).length).toBe(1);
      expect(player1.active.damage).toBe(40);
    });
  }

  it('follows the original attacker after Hit and Run', () => {
    const { store, player1, player2, overridePrompt } = battle({ card: arceus, damage: 190, tools: [punch] },
      { attacker: { card: 'Hitmonchan TEU', energy: [fighter] } });
    const attacker = player1.active;
    const replacement = player1.bench[0];
    const holder = player2.active.getPokemonCard()!;
    overridePrompt('Confirm', () => true);
    overridePrompt('Choose pokemon', () => [myBench(0)]);
    store.dispatch(new AttackAction(player1.id, 'Hit and Run'));
    expect(player1.active).toBe(replacement);
    expect(player2.discard.cards).toContain(holder);
    expect(attacker.damage).toBe(40);
    expect(replacement.damage).toBe(0);
  });

  it('does not transfer Vengeful Punch to a new attacker after Aqua Return', () => {
    const { store, player1, player2 } = battle({ card: mew, damage: 80, tools: [punch] },
      { attacker: { card: 'Lumineon V BRS', energy: [water, water, water] } });
    const attacker = player1.active.getPokemonCard()!;
    const replacement = player1.bench[0];
    const holder = player2.active.getPokemonCard()!;
    store.dispatch(new AttackAction(player1.id, 'Aqua Return'));
    expect(player1.deck.cards).toContain(attacker);
    expect(player1.active).toBe(replacement);
    expect(player2.discard.cards).toContain(holder);
    expect(replacement.damage).toBe(0);
  });

  it('counts both physically separate Vengeful Punch Tools', () => {
    const { store, player1 } = battle({ card: 'Revavroom ex OBF', damage: 80, tools: [punch, punch] });
    store.dispatch(new AttackAction(player1.id, photon));
    expect(player1.active.damage).toBe(80);
  });

  it('respects opposing Tool Jammer during a Vengeful Punch Knock Out', () => {
    const { store, player1 } = battle({ card: mew, tools: [punch] },
      { attacker: { ...miraidon, tools: ['Tool Jammer BST'] } });
    store.dispatch(new AttackAction(player1.id, photon));
    expect(player1.active.damage).toBe(0);
  });

  it('applies Vengeful Punch through Ghost Veil as a Tool effect', () => {
    const { store, player1, player2, overridePrompt } = battle({ card: qwilfish, damage: 80, tools: [punch] },
      { attacker: { card: 'Shuppet M5', energy: [psychic] } });
    const holder = player2.active.getPokemonCard()!;
    overridePrompt('Confirm', () => false);
    store.dispatch(new AttackAction(player1.id, 'Hang Down'));
    expect(player2.discard.cards).toContain(holder);
    expect(player1.active.getPokemonCard()?.fullName).toBe('Shuppet M5');
    expect(player1.active.damage).toBe(40);
  });

  for (const tool of [punch, spell]) {
    it(`rejects an explicit Knock Out even with stale damage markers on ${tool}`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: mew, tools: [tool] }, { attacker: moon });
      const holder = player2.active.getPokemonCard()!;
      player2.marker.addMarkerToState(player2.DAMAGE_DEALT_MARKER);
      Object.assign(player2.active.tools[0], { damageDealt: true });
      overridePrompt('Put damage', () => { throw new Error('Unexpected retaliation choice'); });
      store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
      expect(player2.discard.cards).toContain(holder);
      expect(player1.active.damage).toBe(70);
    });
  }

  for (const tool of [spell, 'Spell Tag2 LOT']) {
    it(`distributes four ${tool} counters for a Benched Psychic holder`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: arceus },
        { attacker: electivire, defenseBench: [{ card: mew, damage: 130, tools: [tool] }] });
      const holder = player2.bench[0].getPokemonCard()!;
      let prompts = 0;
      overridePrompt('Choose pokemon', () => [foeActive, foeBench(0)]);
      overridePrompt('Put damage', generic => {
        const prompt = generic as PutDamagePrompt;
        expect(prompt.playerId).toBe(player2.id);
        expect(player1.getPrizeLeft()).toBe(5);
        expect(player2.bench[0].getPokemonCard()).toBe(holder);
        overridePrompt('Put damage', () => { throw new Error('Same physical Spell Tag resolved twice'); });
        prompts++;
        return [{ target: foeActive, damage: 10 }, { target: foeBench(0), damage: 30 }];
      });
      store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
      expect(prompts).toBe(1);
      expect(player2.discard.cards).toContain(holder);
      expect(player1.active.damage).toBe(10);
      expect(player1.bench[0].damage).toBe(30);
    });
  }

  it('ignores Spell Tag on a non-Psychic holder', () => {
    const { store, player1, player2, overridePrompt } = battle({ card: 'Iron Hands ex PAR', damage: 30, tools: [spell] });
    const holder = player2.active.getPokemonCard()!;
    overridePrompt('Put damage', () => { throw new Error('A non-Psychic holder activated Spell Tag'); });
    store.dispatch(new AttackAction(player1.id, photon));
    expect(player2.discard.cards).toContain(holder);
    expect(player1.active.damage).toBe(0);
  });

  for (const [card, damage] of [[golem, 100], [qwilfish, 60], [maractus, 60]] as const) {
    it(`retaliates once after ${card} takes lethal attack damage in the Active Spot`, () => {
      const { store, player1, player2 } = battle({ card });
      const holder = player2.active.getPokemonCard()!;
      store.dispatch(new AttackAction(player1.id, photon));
      expect(player2.discard.cards).toContain(holder);
      expect(player1.active.damage).toBe(damage);
    });

    it(`does not retaliate when ${card} is Knocked Out on the Bench`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: mew },
        { attacker: electivire, defenseBench: [{ card, damage: card === golem ? 130 : card === qwilfish ? 40 : 60 }] });
      const holder = player2.bench[0].getPokemonCard()!;
      overridePrompt('Choose pokemon', () => [foeActive, foeBench(0)]);
      store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
      expect(player2.discard.cards).toContain(holder);
      expect(player1.active.damage).toBe(0);
    });
  }

  it('does not activate Bursting Needles when Qwilfish survives', () => {
    const { store, player1, player2 } = battle({ card: qwilfish }, { attacker: { card: 'Shuppet M5', energy: [psychic] } });
    const attacker = player1.active.getPokemonCard()!;
    store.dispatch(new AttackAction(player1.id, 'Hang Down'));
    expect(player2.active.damage).toBe(10);
    expect(player1.active.getPokemonCard()).toBe(attacker);
    expect(player1.active.damage).toBe(0);
  });

  it('lets Ghost Veil block Desperate Blast', () => {
    const { store, player1, player2, overridePrompt } = battle({ card: golem, damage: 110 },
      { attacker: { card: 'Banette M5', energy: [psychic] } });
    const attacker = player1.active.getPokemonCard()!;
    const holder = player2.active.getPokemonCard()!;
    overridePrompt('Confirm', () => false);
    store.dispatch(new AttackAction(player1.id, 'Doll Catch'));
    expect(player2.discard.cards).toContain(holder);
    expect(player1.active.getPokemonCard()).toBe(attacker);
    expect(player1.active.damage).toBe(0);
  });

  it('lets Flutter Mane suppress the opposing Active Ability', () => {
    const { store, player1, player2, overridePrompt } = battle({ card: qwilfish },
      { attacker: { card: 'Flutter Mane TEF', energy: [psychic, psychic, psychic] } });
    const victim = player2.active.getPokemonCard()!;
    overridePrompt('Put damage', () => [{ target: foeBench(0), damage: 20 }]);
    store.dispatch(new AttackAction(player1.id, 'Hex Hurl'));
    expect(player2.discard.cards).toContain(victim);
    expect(player1.active.damage).toBe(0);
  });

  it('finishes Draining Kiss healing before applying Desperate Blast', () => {
    const { store, player1, player2 } = battle({ card: golem, damage: 130 },
      { attacker: { card: 'Gorebyss FST 67', damage: 40, energy: [water, water] } });
    const holder = player2.active.getPokemonCard()!;
    const attacker = player1.active.getPokemonCard()!;
    const reduce = store.reduceEffect.bind(store);
    let placed = false;
    spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PlaceDamageCountersEffect && effect.source === holder) {
        placed = true;
        expect(player1.active.damage).toBe(10);
      }
      return reduce(state, effect);
    });
    store.dispatch(new AttackAction(player1.id, 'Draining Kiss'));
    expect(placed).toBe(true);
    expect(player2.discard.cards).toContain(holder);
    expect(player1.discard.cards).toContain(attacker);
  });

  it('does not retaliate for poison damage during Pokémon Checkup', () => {
    const { store, player1, player2 } = battle({ card: qwilfish, damage: 80, tools: [punch] });
    const holder = player2.active.getPokemonCard()!;
    player2.active.specialConditions = [SpecialCondition.POISONED];
    store.dispatch(new PassTurnAction(player1.id));
    expect(player2.discard.cards).toContain(holder);
    expect(player1.active.damage).toBe(0);
  });

  for (const first of ['Gift Energy', 'Rescue Energy']) {
    it(`lets the turn player resolve ${first} first across two simultaneous Knock Outs`, () => {
      const { store, player1, player2, overridePrompt } = battle(
        { card: mew, damage: 130, energy: ['Gift Energy LOR'] }, {
          attacker: electivire, defenseBench: [{ card: mew, damage: 130, energy: ['Rescue Energy TM'] }], attackPrizes: 4
        });
      const active = player2.active.getPokemonCard()!;
      const bench = player2.bench[0].getPokemonCard()!;
      let ordered = false;
      overridePrompt('Choose pokemon', () => [foeActive, foeBench(0)]);
      overridePrompt('Select', generic => {
        const select = generic as SelectPrompt;
        expect(select.playerId).toBe(player1.id);
        expect(select.message).toBe(GameMessage.CHOOSE_KNOCK_OUT_EFFECT);
        expect(player2.active.getPokemonCard()).toBe(active);
        expect(player2.bench[0].getPokemonCard()).toBe(bench);
        expect(player1.getPrizeLeft()).toBe(4);
        ordered = true;
        return select.values.findIndex(value => value.startsWith(first));
      });
      store.dispatch(new AttackAction(player1.id, 'Dual Bolt'));
      expect(ordered).toBe(true);
      expect(player2.discard.cards).toContain(active);
      expect(player2.hand.cards).toContain(bench);
      expect(player2.hand.cards.length).toBe(first === 'Gift Energy' ? 8 : 7);
      expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    });
  }

  for (const mustLose of [false, true]) {
    it(`counts retaliation before both final Prizes with mustLose = ${mustLose}`, () => {
      const { store, state, player1, player2, overridePrompt } = battle({ card: 'Cramorant LOR', tools: [punch] },
        { attacker: { ...miraidon, damage: 190 }, attackBench: [], attackPrizes: 1, defensePrizes: 1 });
      const attacker = player1.active.getPokemonCard()!;
      const defender = player2.active.getPokemonCard()!;
      if (mustLose) state.winConditions = { mustLose: true };
      overridePrompt('Choose pokemon', () => { throw new Error('Finished game asked for a replacement Active'); });
      const reduce = store.reduceEffect.bind(store);
      const drawOrder: number[] = [];
      spyOn(store, 'reduceEffect').and.callFake((current: State, effect: Effect) => {
        if (effect instanceof CheckPrizesDestinationEffect) {
          expect(player1.discard.cards).toContain(attacker);
          expect(player2.discard.cards).toContain(defender);
          drawOrder.push(effect.player.id);
        }
        return reduce(current, effect);
      });
      store.dispatch(new AttackAction(player1.id, photon));
      expect(drawOrder).toEqual([player1.id, player2.id]);
      expect(player1.getPrizeLeft()).toBe(0);
      expect(player2.getPrizeLeft()).toBe(0);
      expect(store.state.winner).toBe(mustLose ? GameWinner.PLAYER_1 : GameWinner.PLAYER_2);
    });
  }

  it('counts both Knock Outs from a single Spell Tag before calculating Prizes', () => {
    const { store, player1, player2, overridePrompt } = battle({ card: mew, tools: [spell] },
      { attacker: { ...miraidon, damage: 200 }, attackBench: [{ card: 'Shuppet M5', damage: 30 }],
        attackPrizes: 2, defensePrizes: 4 });
    const attacker = player1.active.getPokemonCard()!;
    const shuppet = player1.bench[0].getPokemonCard()!;
    overridePrompt('Put damage', () => [{ target: foeActive, damage: 20 }, { target: foeBench(0), damage: 20 }]);
    store.dispatch(new AttackAction(player1.id, photon));
    expect(player1.discard.cards).toContain(attacker);
    expect(player1.discard.cards).toContain(shuppet);
    expect(player1.getPrizeLeft()).toBe(0);
    expect(player2.getPrizeLeft()).toBe(1);
    expect(store.state.winner).toBe(GameWinner.PLAYER_2);
  });

  it('continues a tiebreaker when both players take the same number of Prizes in one attack', () => {
    const { store, state, player1, player2 } = battle({ card: 'Cramorant LOR', damage: 30 }, {
      attacker: { card: 'Zekrom BLW', damage: 90, energy: [lightning, lightning, darkness] }, attackPrizes: 6
    });
    state.isSuddenDeath = true;
    store.dispatch(new AttackAction(player1.id, 'Bolt Strike'));
    expect(player1.getPrizeLeft()).toBe(5);
    expect(player2.getPrizeLeft()).toBe(5);
    expect(store.state.phase).toBe(GamePhase.PLAYER_TURN);
    expect(store.state.winner).toBe(GameWinner.NONE);
  });
});
