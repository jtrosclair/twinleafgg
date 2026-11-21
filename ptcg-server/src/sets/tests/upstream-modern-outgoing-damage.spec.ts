import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ChooseAttackPromptType } from '../../game/store/prompts/choose-attack-prompt';
import { endTurn, useAbility, useAttack } from './card-test-helpers';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const fire = 'Fire Energy SVE';
const water = 'Water Energy SVE';
const psychic = 'Psychic Energy SVE';
const lightning = 'Lightning Energy SVE';
const rookidee = "Hop's Rookidee JTG";
const houndoom = 'Houndoom SFA';
const electivire = 'Electivire TEF';
const charizard = 'Charizard ex MEW';
const salamence = 'Salamence ex JTG';
const mew = 'Mew ex MEW';

function game(first: PlayerConfig, second: PlayerConfig) {
  const board = setupGame({ turn: 5,
    player1: { deck: padDeck(10), ...first }, player2: { deck: padDeck(10), ...second },
  });
  board.player1.active.getPokemonCard()!.hp = 900;
  board.player2.active.getPokemonCard()!.hp = 900;
  return board;
}

const cases = [
  { card: rookidee, attack: 'Intimidating Stare', hit: electivire, move: 'Electroslug',
    energy: [water], retaliation: [lightning, lightning, water, water], expected: 240 },
  { card: 'Chikorita MC', attack: 'Growl', hit: charizard, move: 'Brave Wing',
    energy: [water], retaliation: [fire], expected: 80 },
  { card: 'Buneary M1L', attack: 'Charm', hit: 'Koraidon ex SVI', move: 'Wild Impact',
    energy: [water], retaliation: ['Fighting Energy SVE', 'Fighting Energy SVE', water], expected: 400 },
  ...['Mega Pyroar ex M4', 'Mega Pyroar ex M4 15'].map(card => ({ card,
    attack: 'Ferocious Bellow', hit: 'Feraligatr TEF', move: 'Giant Wave',
    energy: [fire, water], retaliation: [water, water], expected: 220,
  })),
];

describe('Damage reduction on the Defending Pokémon', () => {
  for (const test of cases) {
    it(`${test.card} lowers the affected attacker’s damage before Weakness`, () => {
      const board = game({ active: { card: test.card, energy: test.energy } },
        { active: { card: test.hit, energy: test.retaliation } });
      useAttack(board.store, board.state, 0, test.attack);
      useAttack(board.store, board.store.state, 1, test.move);
      expect(board.player1.active.damage).toBe(test.expected);
    });
  }

  for (const [card, attack, energy] of [
    [houndoom, 'Snarl', [fire, water, water]],
    ['Sylveon ex SSP', 'Magical Charm', [psychic, water, water]],
    ['Sylveon exSAR PRE', 'Magical Charm', [psychic, water, water]],
  ] as const) {
    it(`${card} reduces the affected attacker’s Bench damage to zero`, () => {
      const board = game({ active: { card, energy: [...energy] }, bench: [{ card: mew }] },
        { active: { card: salamence, energy: [fire, water, water] } });
      useAttack(board.store, board.state, 0, attack);
      useAttack(board.store, board.store.state, 1, 'Wide Blast');
      expect(board.player1.bench[0].damage).toBe(0);
    });
  }

  it('honors Mist Energy on a Defending Pokémon even when the attack deals zero', () => {
    const board = game({ active: { card: rookidee, energy: [water] } },
      { active: { card: electivire, energy: [lightning, lightning, water, 'Mist Energy TEF'] } });
    useAttack(board.store, board.state, 0, 'Intimidating Stare');
    useAttack(board.store, board.store.state, 1, 'Electroslug');
    expect(board.player1.active.damage).toBe(280);
  });

  it('does not arm Snarl when its recipient has Mist Energy', () => {
    const board = game({ active: { card: houndoom, energy: [fire, water, water] }, bench: [{ card: mew }] },
      { active: { card: salamence, energy: [fire, water, 'Mist Energy TEF'] } });
    useAttack(board.store, board.state, 0, 'Snarl');
    expect(board.player2.active.damage).toBe(100);
    useAttack(board.store, board.store.state, 1, 'Wide Blast');
    expect(board.player1.bench[0].damage).toBe(50);
  });

  it('keeps the reduction on the recipient when the original attacker moves to the Lost Zone', () => {
    const board = game({ active: { card: rookidee, energy: [water] }, bench: [{ card: mew }] },
      { active: { card: charizard, energy: [fire] } });
    useAttack(board.store, board.state, 0, 'Intimidating Stare');
    board.player1.switchPokemon(board.player1.bench[0]);
    board.player1.bench[0].moveTo(board.player1.lostzone);
    useAttack(board.store, board.store.state, 1, 'Brave Wing');
    expect(board.player1.active.damage).toBe(40);
  });

  it('expires after the affected turn and clears when the recipient switches out', () => {
    const board = game({ active: { card: rookidee, energy: [water] } },
      { active: { card: electivire, energy: [lightning, lightning, water, water] }, bench: [{ card: mew }] });
    useAttack(board.store, board.state, 0, 'Intimidating Stare');
    endTurn(board.store, board.store.state);
    expect(board.player2.active.attackDamageReductionNextTurn).toBe(0);
    useAttack(board.store, board.store.state, 0, 'Intimidating Stare');
    board.player2.switchPokemon(board.player2.bench[0]);
    board.player2.switchPokemon(board.player2.bench[0]);
    useAttack(board.store, board.store.state, 1, 'Electroslug');
    expect(board.player1.active.damage).toBe(280);
  });

  it('Memory Helix can copy Snarl and reduce the affected attacker’s damage', () => {
    const board = game({ active: { card: 'Mew ex 30C', energy: [fire, water, water] }, bench: [{ card: houndoom }, { card: mew }] },
      { active: { card: salamence, energy: [fire, water, water] } });
    board.overridePrompt(ChooseAttackPromptType, () => ({ index: 0, attack: 'Snarl' }));
    useAbility(board.store, board.state, 0, 'Memory Helix');
    useAttack(board.store, board.store.state, 1, 'Wide Blast');
    expect(board.player1.bench[1].damage).toBe(0);
  });

  it('applies a saved Magical Charm marker to direct damage before Weakness', () => {
    const board = game({ active: { card: mew }, bench: [{ card: 'Sylveon ex SSP' }] },
      { active: { card: 'Mega Darkrai ex M5' } });
    const sylveon = board.player1.bench[0].getPokemonCard()!;
    board.player2.marker.addMarker('CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER', sylveon);
    board.player2.active.marker.addMarker('DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER', sylveon);
    const hit = new AttackEffect(board.player2, board.player1, { name: 'Hit', cost: [], damage: 150, text: '' });
    board.store.reduceEffect(board.state, new PutDamageEffect(hit, 150));
    expect(board.player1.active.damage).toBe(100);
  });
});
