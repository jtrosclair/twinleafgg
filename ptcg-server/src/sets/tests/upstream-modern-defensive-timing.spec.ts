import { ChooseAttackPromptType } from '../../game/store/prompts/choose-attack-prompt';
import { endTurn, useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const fire = 'Fire Energy SVE';
const water = 'Water Energy SVE';
const lightning = 'Lightning Energy SVE';
const metal = 'Metal Energy SVE';
const fighting = 'Fighting Energy SVE';
const psychic = 'Psychic Energy SVE';
const mew = 'Mew ex MEW';
const heatran = 'Mega Heatran ex M-P';
const charizard = 'Charizard ex MEW';
const drednaw = 'Drednaw SCR';
const charm = 'Sacred Charm M2';
const bastiodon = 'Bastiodon M5';

function game(p1: PlayerConfig, p2: PlayerConfig) {
  const board = setupGame({ turn: 5,
    player1: { deck: padDeck(12), ...p1 },
    player2: { deck: padDeck(12), ...p2 },
  });
  // Keep test Pokémon on the board for inspection even when the attack is lethal.
  board.player1.active.getPokemonCard()!.hp = 900;
  board.player2.active.getPokemonCard()!.hp = 900;
  return board;
}

describe('Defending damage reductions', () => {
  for (const [damage, expected] of [[0, 60], [10, 130]]) {
    it(`applies High Density Armor after Weakness with ${damage} damage already on Heatran`, () => {
      const board = game({ active: { card: charizard, energy: [fire] } }, { active: { card: heatran, damage } });
      useAttack(board.store, board.state, 0, 'Brave Wing');
      expect(board.player2.active.damage).toBe(expected);
    });
  }

  it('lets a Shred attack ignore High Density Armor', () => {
    const board = game({ active: { card: 'Koraidon TEF', energy: [fire, fighting, water] } }, { active: { card: heatran } });
    useAttack(board.store, board.state, 0, 'Shred');
    expect(board.player2.active.damage).toBe(130);
  });

  for (const alias of ['Kakuna M4', 'Kakuna M4 2']) {
    it(`applies Exoskeleton after Weakness for ${alias}`, () => {
      const board = game({ active: { card: charizard, energy: [fire] } }, { active: { card: alias } });
      useAttack(board.store, board.state, 0, 'Brave Wing');
      expect(board.player2.active.damage).toBe(100);
    });
  }

  it('applies Crimson Armor to actual opposing damage and respects Shred', () => {
    const board = game({ active: { card: 'Koraidon TEF', energy: [fire, fighting, water] } },
      { active: { card: 'Armarouge ex PAR' } });
    useAttack(board.store, board.state, 0, 'Shred');
    expect(board.player2.active.damage).toBe(130);
  });

  it('continues to apply Crimson Armor after a regular attack’s Weakness', () => {
    const board = game({ active: { card: 'Feraligatr TEF', energy: [water, water] } }, { active: { card: 'Armarouge ex PAR' } });
    useAttack(board.store, board.state, 0, 'Giant Wave');
    expect(board.player2.active.damage).toBe(240);
  });

  it('attaches Sacred Charm’s reduction to the defender after applying Weakness', () => {
    const board = game({ active: { card: 'Feraligatr TEF', energy: [water, water] } },
      { active: { card: 'Charmander OBF', tools: [charm] } });
    useAttack(board.store, board.state, 0, 'Giant Wave');
    expect(board.player2.active.damage).toBe(290);
  });

  it('disables Sacred Charm under Jamming Tower', () => {
    const board = game({ active: { card: 'Feraligatr TEF', energy: [water, water] } },
      { active: { card: 'Charmander OBF', tools: [charm] } });
    board.player1.stadium.cards.push(getCardByName('Jamming Tower TWM'));
    useAttack(board.store, board.state, 0, 'Giant Wave');
    expect(board.player2.active.damage).toBe(320);
  });

  for (const watchtower of [false, true]) {
    it(`uses Mega Kangaskhan’s current Abilities under Watchtower = ${watchtower}`, () => {
      const board = game({ active: { card: 'Mega Kangaskhan ex M1S', energy: [water, water, water] } },
        { active: { card: mew, tools: [charm] } });
      if (watchtower) board.player1.stadium.cards.push(getCardByName("Team Rocket's Watchtower DRI"));
      board.overridePrompt('Coin flip', () => false);
      useAttack(board.store, board.state, 0, 'Rapid-Fire Combo');
      expect(board.player2.active.damage).toBe(watchtower ? 200 : 170);
    });
  }

  it('applies Rigid Band once per physical Tool on Revavroom ex', () => {
    const board = game({ active: { card: charizard, energy: [fire] } },
      { active: { card: 'Revavroom ex OBF', tools: ['Rigid Band MEW', 'Rigid Band MEW'] } });
    useAttack(board.store, board.state, 0, 'Brave Wing');
    expect(board.player2.active.damage).toBe(60);
  });

  it('does not apply Sacred Charm against an attacker without an Ability', () => {
    const board = game({ active: { card: charizard, energy: [fire] } }, { active: { card: heatran, damage: 10, tools: [charm] } });
    useAttack(board.store, board.state, 0, 'Brave Wing');
    expect(board.player2.active.damage).toBe(130);
  });
});

describe('Impervious Shell and Ancient Bulwark', () => {
  it('checks Impervious Shell after Weakness raises the damage above the threshold', () => {
    const board = game({ active: { card: 'Electivire TEF', energy: [lightning, lightning, water, water] } }, { active: { card: drednaw } });
    useAttack(board.store, board.state, 0, 'Electroslug');
    expect(board.player2.active.damage).toBe(0);
  });

  for (const rigid of [false, true]) {
    it(`uses the reduced Wild Impact total ${rigid ? 'with' : 'without'} Rigid Band`, () => {
      const board = game({ active: { card: 'Koraidon ex SVI', energy: [fighting, fighting, water] } },
        { active: { card: drednaw, tools: rigid ? ['Rigid Band MEW'] : [] } });
      useAttack(board.store, board.state, 0, 'Wild Impact');
      expect(board.player2.active.damage).toBe(rigid ? 190 : 0);
    });
  }

  it('lets the official Double Turbo Energy and Trinity Nova combination deal 180', () => {
    const board = game({ active: { card: 'Arceus VSTAR BRS', energy: ['Double Turbo Energy BRS', water] } },
      { active: { card: drednaw } });
    useAttack(board.store, board.state, 0, 'Trinity Nova');
    expect(board.player2.active.damage).toBe(180);
  });

  it('lets Shred through even when Weakness produces exactly 200 damage', () => {
    const board = game({ active: { card: 'Bellibolt OBF', energy: [lightning, water, water] } }, { active: { card: drednaw } });
    useAttack(board.store, board.state, 0, 'Thunderous Edge');
    expect(board.player2.active.damage).toBe(200);
  });

  for (const units of [1, 3]) {
    it(`counts Luminous Energy as one unit when the attacker has ${units} Energy`, () => {
      const board = game({ active: { card: 'Rellor TEF', energy: units === 1 ? ['Luminous Energy PAL'] : ['Luminous Energy PAL', water, water] } },
        { active: { card: mew }, bench: [{ card: bastiodon }] });
      useAttack(board.store, board.state, 0, 'Slight Intrusion');
      expect(board.player2.active.damage).toBe(units === 1 ? 0 : 30);
    });
  }
});

describe('Next-turn attack shields', () => {
  it('Metal Block judges Bench Alakazam as evolved despite the Basic Active', () => {
    const board = game({ active: { card: 'Bronzong M5', energy: [metal, metal, water] } },
      { active: { card: mew }, bench: [{ card: 'Alakazam ex MEW', energy: [psychic, psychic] }] });
    useAttack(board.store, board.state, 0, 'Metal Block');
    useAttack(board.store, board.state, 1, 'Dimensional Manipulation');
    expect(board.player1.active.damage).toBe(20);
  });

  it('Metal Block reduces an Evolution hit after Fire Weakness', () => {
    const board = game({ active: { card: 'Bronzong M5', energy: [metal, metal, water] } },
      { active: { card: charizard, energy: [fire] } });
    // Heal the attack damage so Brave Wing stays at its base amount.
    useAttack(board.store, board.state, 0, 'Metal Block');
    board.player2.active.damage = 0;
    useAttack(board.store, board.state, 1, 'Brave Wing');
    expect(board.player1.active.damage).toBe(20);
  });

  it('continues to apply a saved Metal Block marker after Weakness', () => {
    const board = game({ active: { card: charizard, energy: [fire] } }, { active: { card: 'Bronzong M5' } });
    board.player2.active.marker.addMarker('M5_BRONZONG_METALBLOCK', board.player2.active.getPokemonCard()!);
    useAttack(board.store, board.state, 0, 'Brave Wing');
    expect(board.player2.active.damage).toBe(20);
  });

  it('Shell Press reduces damage after Lightning Weakness', () => {
    const board = game({ active: { card: 'Clamperl DRI', energy: [water] } },
      { active: { card: 'Electabuzz TEF', energy: [lightning] } });
    useAttack(board.store, board.state, 0, 'Shell Press');
    useAttack(board.store, board.state, 1, 'Chop');
    expect(board.player1.active.damage).toBe(30);
  });

  it('Shell Press protects the actual Memory Helix attacker', () => {
    const board = game({ active: { card: 'Mew ex 30C', energy: [water] }, bench: [{ card: 'Clamperl DRI' }] },
      { active: { card: 'Electabuzz TEF', energy: [lightning] } });
    board.overridePrompt(ChooseAttackPromptType, () => ({ index: 0, attack: 'Shell Press' }));
    useAbility(board.store, board.state, 0, 'Memory Helix');
    useAttack(board.store, board.state, 1, 'Chop');
    expect(board.player1.active.damage).toBe(10);
  });

  it('Guard Press applies once even when two Shelgon are in play', () => {
    const board = game({ active: { card: 'Shelgon JTG', energy: [water, water] }, bench: [{ card: 'Shelgon JTG' }] },
      { active: { card: charizard, energy: [fire] } });
    useAttack(board.store, board.state, 0, 'Guard Press');
    board.player2.active.damage = 0;
    useAttack(board.store, board.state, 1, 'Brave Wing');
    expect(board.player1.active.damage).toBe(30);
  });

  it('Guard Press expires after the opponent’s turn', () => {
    const board = game({ active: { card: 'Shelgon JTG', energy: [water, water] } },
      { active: { card: charizard, energy: [fire] } });
    useAttack(board.store, board.state, 0, 'Guard Press');
    endTurn(board.store, board.store.state);
    endTurn(board.store, board.store.state);
    board.player2.active.damage = 0;
    useAttack(board.store, board.state, 1, 'Brave Wing');
    expect(board.player1.active.damage).toBe(60);
  });
});
