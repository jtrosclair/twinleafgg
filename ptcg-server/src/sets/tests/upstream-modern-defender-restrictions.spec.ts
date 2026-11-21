import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardType } from '../../game/store/card/card-types';
import { ChooseAttackPromptType } from '../../game/store/prompts/choose-attack-prompt';
import { ChooseEnergyPrompt, ChooseEnergyPromptType } from '../../game/store/prompts/choose-energy-prompt';
import { endTurn, playTrainerCard, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PokemonSlotConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const darkness = 'Darkness Energy SVE';
const fighting = 'Fighting Energy SVE';
const fire = 'Fire Energy SVE';
const grass = 'Grass Energy SVE';
const mist = 'Mist Energy TEF';
const mew = 'Mew ex MEW';

const restrictions = [
  { card: 'Eiscue ex OBF', energy: [water, water, water], attack: 'Scalding Block', damage: 160 },
  { card: "N's Vanillish M2a", energy: [water, water, water], attack: 'Sheer Cold', damage: 60 },
  { card: 'Iron Bundle PAR', energy: [water, water, water], attack: 'Refrigerated Stream', damage: 80 },
  { card: 'Masquerain M6', energy: [water], attack: 'Frightening Patterns', damage: 30 },
];

function lockBoard(attacker: PokemonSlotConfig, defender: PokemonSlotConfig = {
  card: 'Feraligatr TEF', energy: [water, water],
}) {
  const game = setupGame({
    turn: 5,
    player1: { active: attacker, bench: [{ card: mew }], deck: padDeck(8) },
    player2: {
      active: defender,
      bench: [{ card: mew }],
      hand: ['Switch SVI', 'Switch SVI'],
      deck: padDeck(8),
    },
  });
  game.player1.active.getPokemonCard()!.hp = 500;
  game.player2.active.getPokemonCard()!.hp = 500;
  return game;
}

describe('modern attacks that restrict the original defender', () => {
  for (const entry of restrictions) {
    it(`${entry.attack} blocks the upcoming turn and expires when that turn ends`, () => {
      const { store, state, player2 } = lockBoard(entry);
      useAttack(store, state, 0, entry.attack);
      expect(player2.active.damage).toBe(entry.damage);
      expect(() => useAttack(store, state, 1, 'Giant Wave'))
        .toThrow(new GameError(GameMessage.BLOCKED_BY_EFFECT));
      endTurn(store, store.state);
      endTurn(store, store.state);
      expect(() => useAttack(store, store.state, 1, 'Giant Wave')).not.toThrow();
    });

    it(`${entry.attack} deals damage through Mist Energy and leaves the defender free to attack`, () => {
      const { store, state, player2 } = lockBoard(entry, { card: 'Feraligatr TEF', energy: [water, water, mist] });
      useAttack(store, state, 0, entry.attack);
      expect(player2.active.damage).toBe(entry.damage);
      expect(() => useAttack(store, state, 1, 'Giant Wave')).not.toThrow();
    });

    it(`${entry.attack} still blocks the right Pokémon after the original attacker is removed`, () => {
      const { store, state, player1, player2 } = lockBoard(entry);
      useAttack(store, state, 0, entry.attack);
      player1.active.moveTo(player1.lostzone);
      player1.switchPokemon(player1.bench[0], store, state);
      expect(() => useAttack(store, state, 1, 'Giant Wave'))
        .toThrow(new GameError(GameMessage.BLOCKED_BY_EFFECT));
      const defender = player2.active.getPokemonCard();
      playTrainerCard(store, store.state, 1, 'Switch SVI');
      expect(store.state.players[1].active.getPokemonCard()?.fullName).toBe(mew);
      playTrainerCard(store, store.state, 1, 'Switch SVI');
      expect(store.state.players[1].active.getPokemonCard()).toBe(defender);
      expect(() => useAttack(store, store.state, 1, 'Giant Wave')).not.toThrow();
    });
  }

  it('Refrigerated Stream leaves a Basic defender free to attack', () => {
    const { store, state, player2 } = lockBoard(restrictions[2], { card: 'Koraidon TEF', energy: [fighting, fire] });
    useAttack(store, state, 0, 'Refrigerated Stream');
    expect(player2.active.damage).toBe(80);
    expect(() => useAttack(store, state, 1, 'Primordial Beatdown')).not.toThrow();
  });

  it('Scalding Block deals damage before discarding one Energy even through Mist Energy', () => {
    const { store, state, player1, player2, overridePrompt } = lockBoard(
      restrictions[0], { card: 'Feraligatr TEF', energy: [water, water, mist] },
    );
    let damageWhenSelectingEnergy: number | undefined;
    const discarded = player1.active.energies.cards[1];
    overridePrompt(ChooseEnergyPromptType, prompt => {
      damageWhenSelectingEnergy = player2.active.damage;
      return [(prompt as ChooseEnergyPrompt).energy.findIndex(entry => entry.card === discarded)];
    });
    // Older puzzle snapshots can keep an Energy solely in the attachment list.
    player1.active.cards.splice(player1.active.cards.indexOf(discarded), 1);
    useAttack(store, state, 0, 'Scalding Block');
    expect(damageWhenSelectingEnergy).toBe(160);
    expect(player1.discard.cards).toContain(discarded);
    expect(player1.active.energies.cards).not.toContain(discarded);
    expect(player1.active.energies.cards.length).toBe(2);
  });

  it('Scalding Block restores the lock markers from an older snapshot', () => {
    const { store, state, player1, player2 } = lockBoard(restrictions[0]);
    endTurn(store, state);
    const eiscue = player1.active.getPokemonCard()!;
    player2.active.marker.addMarker('SCALDING_BLOCK_MARKER', eiscue);
    player2.marker.addMarker('SCALDING_BLOCK_MARKER', eiscue);
    expect(() => useAttack(store, state, 1, 'Giant Wave'))
      .toThrow(new GameError(GameMessage.BLOCKED_BY_EFFECT));
    endTurn(store, store.state);
    expect(store.state.players[1].active.marker.hasMarker('SCALDING_BLOCK_MARKER', eiscue)).toBe(false);
  });
});

describe('modern self protection and increased damage', () => {
  function headbuttBoard(foe: PokemonSlotConfig = { card: 'Bramblin PAL', energy: [grass] }) {
    return lockBoard({ card: 'Mabosstiff M5', energy: [darkness, darkness, darkness] }, foe);
  }

  it('Diving Headbutt adds 100 once after Weakness and expires after the opposing turn', () => {
    const { store, state, player1 } = headbuttBoard();
    useAttack(store, state, 0, 'Diving Headbutt');
    useAttack(store, state, 1, 'Blot');
    expect(player1.active.damage).toBe(120);
    endTurn(store, state);
    useAttack(store, state, 1, 'Blot');
    expect(player1.active.damage).toBe(140);
  });

  it('Diving Headbutt leaves damage at zero if Resistance reduced it to zero', () => {
    const { store, state, player1 } = headbuttBoard();
    player1.active.getPokemonCard()!.resistance = [{ type: CardType.GRASS, value: -30 }];
    useAttack(store, state, 0, 'Diving Headbutt');
    useAttack(store, state, 1, 'Blot');
    expect(player1.active.damage).toBe(0);
  });

  it('Diving Headbutt does not raise Shred damage', () => {
    const { store, state, player1 } = headbuttBoard({ card: 'Koraidon TEF', energy: [fire, fighting, water] });
    useAttack(store, state, 0, 'Diving Headbutt');
    useAttack(store, state, 1, 'Shred');
    expect(player1.active.damage).toBe(130);
  });

  it('copied Diving Headbutt stays active when the printed card goes to the Lost Zone', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: mew, energy: [water, water, water] }, deck: padDeck(8) },
      player2: { active: { card: 'Mabosstiff M5' },
        bench: [{ card: 'Bramblin PAL', energy: [grass] }], deck: padDeck(8) },
    });
    const { store, state, player1, player2, overridePrompt } = game;
    player1.stadium.cards.push(getCardByName('Lost City LOR'));
    overridePrompt(ChooseAttackPromptType, () => ({ index: 0, attack: 'Diving Headbutt' }));
    useAttack(store, state, 0, 'Genome Hacking');
    expect(player2.lostzone.cards.map(card => card.name)).toContain('Mabosstiff');
    useAttack(store, state, 1, 'Blot');
    expect(player1.active.damage).toBe(110);
    expect(player1.active.marker.hasMarker('M5_MABOSTIFF_DIVING')).toBe(false);
  });

  it('Diving Headbutt still reads the older damage marker', () => {
    const { store, state, player1, player2 } = headbuttBoard();
    endTurn(store, state);
    const mabosstiff = player1.active.getPokemonCard()!;
    player1.active.marker.addMarker('M5_MABOSTIFF_DIVING', mabosstiff);
    player2.marker.addMarker('M5_MABOSTIFF_CLEAR_DIVING', mabosstiff);
    useAttack(store, state, 1, 'Blot');
    expect(player1.active.damage).toBe(120);
    expect(player1.active.marker.hasMarker('M5_MABOSTIFF_DIVING', mabosstiff)).toBe(false);
  });

  it('Splashing Dodge prevents direct Knock Out effects and still lets Shred bypass damage protection', () => {
    spyOn(Math, 'random').and.returnValue(0.1);
    const joltik = { card: 'Joltik SFA', energy: [grass] };
    const gouging = lockBoard(joltik, { card: 'Roaring Moon ex PAR', energy: [darkness, darkness, fire] });
    const joltikCard = gouging.player1.active.getPokemonCard();
    useAttack(gouging.store, gouging.state, 0, 'Splashing Dodge');
    useAttack(gouging.store, gouging.state, 1, 'Frenzied Gouging');
    expect(gouging.player1.active.getPokemonCard()).toBe(joltikCard);
    expect(gouging.player2.active.damage).toBe(20);

    const shred = lockBoard(joltik, { card: 'Koraidon TEF', energy: [fire, fighting, water] });
    useAttack(shred.store, shred.state, 0, 'Splashing Dodge');
    useAttack(shred.store, shred.state, 1, 'Shred');
    expect(shred.player1.active.damage).toBe(130);
  });
});
