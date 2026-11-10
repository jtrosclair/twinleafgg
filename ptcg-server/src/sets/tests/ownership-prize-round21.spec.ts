import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { GamePhase } from '../../game/store/state/state';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

type Entry = {name: string; attack: string; energy: string[]; damage: number};
const entries: Entry[] = [
  {name: 'Articuno ROS', attack: 'Chilling Sigh', energy: ['Water Energy SVE'], damage: 0},
  {name: 'Natu ROS', attack: 'Psywave', energy: ['Psychic Energy SVE', 'Psychic Energy SVE'], damage: 0},
  {name: 'Dustox ROS', attack: 'Flap', energy: ['Grass Energy SVE'], damage: 20},
  {name: 'Swellow ROS', attack: 'Peck', energy: ['Psychic Energy SVE', 'Psychic Energy SVE'], damage: 30},
];
function battle(entry: Entry, copied: boolean, opponentBench = false, opponentEnergy: string[] = []) {
  const g = setupGame({turn: 3,
    player1: {active: {card: copied ? 'Mew TM' : entry.name, energy: entry.energy}, bench: [{card:'Charmander BS'}], deck: padDeck(10)},
    player2: {active: {card:'Squirtle BS', energy: opponentEnergy}, bench: opponentBench ? [{card:'Charmander BS'}] : [], deck:padDeck(10)}});
  g.player1.active.getPokemonCard()!.hp = 1000;
  const target = g.player2.active.getPokemonCard()!;
  target.hp = 1000; target.weakness = []; target.resistance = [];
  if (opponentBench) { g.player2.bench[0].getPokemonCard()!.hp = 1000; }
  let sleepApplied = false;
  const reduce = g.store.reduceEffect.bind(g.store);
  spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    const result = reduce(state, effect);
    if (effect instanceof AddSpecialConditionsEffect && effect.specialConditions.includes(SpecialCondition.ASLEEP) && effect.target.specialConditions.includes(SpecialCondition.ASLEEP)) sleepApplied = true;
    return result;
  });
  if (copied) {
    g.player1.lostzone.cards.push(getCardByName(entry.name));
    g.overridePrompt('Choose attack', () => ({index:0, attack:entry.attack}));
    useAbility(g.store, g.state, 0, 'Lost Link');
  } else {
    useAttack(g.store, g.state, 0, entry.attack);
  }
  return {...g, sleepApplied};
}
function resultingPrizes(g: ReturnType<typeof battle>, phase = GamePhase.ATTACK, activePlayer = 0) {
  g.state.activePlayer = activePlayer; g.state.phase = phase;
  const ko = new KnockOutEffect(g.player2, g.player2.active);
  g.store.reduceEffect(g.state, ko);
  return ko.prizeCount;
}
describe('Delta Plus copied-attack ownership', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  for (const entry of entries) {
    it('keeps '+entry.name+' attack and printed trait', () => {
      const g = battle(entry, false);
      expect(g.player2.active.damage).toBe(entry.damage);
      if (entry.name === 'Articuno ROS') expect(g.sleepApplied).toBe(true);
      expect(resultingPrizes(g)).toBe(2);
    });
    it('copies '+entry.name+' attack but does not copy Delta Plus', () => {
      const g = battle(entry, true);
      expect(g.player2.active.damage).toBe(entry.damage);
      if (entry.name === 'Articuno ROS') expect(g.sleepApplied).toBe(true);
      expect(resultingPrizes(g)).toBe(1);
    });
    it('does not award '+entry.name+' Delta Plus outside its attacker turn', () => {
      const g = battle(entry, false);
      expect(resultingPrizes(g, GamePhase.ATTACK, 1)).toBe(1);
    });
  }
  for (const copied of [false, true]) {
    it('preserves Tri Edge coin damage, copied '+copied, () => {
      const entry = {...entries[0], attack:'Tri Edge', energy:['Water Energy SVE', 'Water Energy SVE', 'Water Energy SVE']};
      const g = battle(entry, copied);
      expect(g.player2.active.damage).toBe(140);
    });
    it('preserves Wind Shard Bench damage, copied '+copied, () => {
      const entry = {...entries[2], attack:'Wind Shard', energy:['Grass Energy SVE', 'Grass Energy SVE', 'Grass Energy SVE']};
      const g = battle(entry, copied, true);
      expect(g.player2.bench[0].damage).toBe(50);
      expect(g.player2.active.damage).toBe(0);
    });
    it('preserves Psywave damage per opposing Energy, copied '+copied, () => {
      const g = battle(entries[1], copied, false, ['Water Energy SVE', 'Water Energy SVE']);
      expect(g.player2.active.damage).toBe(20);
    });
  }
  for (const copied of [false, true]) {
    for (const item of [
      {name:'Articuno ROS', attack:'Tri Edge', energy:['Water Energy SVE', 'Water Energy SVE', 'Water Energy SVE'], defenderEnergy:[]},
      {name:'Natu ROS', attack:'Psywave', energy:['Psychic Energy SVE', 'Psychic Energy SVE'], defenderEnergy:['Water Energy SVE']},
      {name:'Dustox ROS', attack:'Flap', energy:['Grass Energy SVE'], defenderEnergy:[]},
      {name:'Swellow ROS', attack:'Peck', energy:['Psychic Energy SVE', 'Psychic Energy SVE'], defenderEnergy:[]},
    ]) {
      it('resolves lethal '+item.name+' attack and real Prize selection, copied '+copied, () => {
        const g = setupGame({turn:3,
          player1:{active:{card:copied ? 'Mew TM' : item.name, energy:item.energy}, deck:padDeck(10)},
          player2:{active:{card:'Squirtle BS', energy:item.defenderEnergy}, bench:[{card:'Charmander BS'}], deck:padDeck(10)}});
        g.player2.active.getPokemonCard()!.hp = 10;
        g.player2.active.getPokemonCard()!.weakness = [];
        g.player2.active.getPokemonCard()!.resistance = [];
        if (copied) {
          g.player1.lostzone.cards.push(getCardByName(item.name));
          g.overridePrompt('Choose attack', () => ({index:0, attack:item.attack}));
          useAbility(g.store, g.state, 0, 'Lost Link');
        } else useAttack(g.store, g.state, 0, item.attack);
        const remaining = g.player1.prizes.filter(prize => prize.cards.length > 0).length;
        expect(remaining).toBe(copied ? 5 : 4);
      });
    }
  }
});
