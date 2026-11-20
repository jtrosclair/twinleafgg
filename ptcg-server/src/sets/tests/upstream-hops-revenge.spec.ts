import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PutDamagePromptType } from '../../game/store/prompts/put-damage-prompt';
import { CardTag } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { endTurn, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const phantump = "Hop's Phantump ASC";
const trevenant = "Hop's Trevenant ASC";
const psychic = 'Psychic Energy SVE';

describe("Hop's Trevenant ASC", () => {
  for (const name of [phantump, trevenant]) {
    it(`registers ${name} as a Hop's Pokémon`, () => {
      expect((getCardByName(name) as PokemonCard).tags).toContain(CardTag.HOPS);
    });
  }

  for (const [victim, expectedDamage] of [[phantump, 130], ['Cleffa OBF', 30]] as const) {
    it(`does ${expectedDamage} damage after an opposing attack KOs ${victim}`, () => {
      const game = setupGame({ turn: 3,
        player1: { active: { card: 'Dragapult ex TWM', energy: [psychic] }, deck: padDeck(10) },
        player2: { active: { card: victim }, bench: [{ card: trevenant, energy: [psychic] }], deck: padDeck(10) }
      });

      useAttack(game.store, game.state, 0, 'Jet Headbutt');
      expect(game.player2.active.getPokemonCard()?.fullName).toBe(trevenant);
      expect(game.player2.pokemonKnockedOutByAttackDuringOpponentsLastTurn).toBe(true);

      useAttack(game.store, game.state, 1, 'Horrifying Revenge');
      expect(game.player1.active.damage).toBe(expectedDamage);

      endTurn(game.store, game.state);
      useAttack(game.store, game.state, 1, 'Horrifying Revenge');
      expect(game.player1.active.damage).toBe(expectedDamage + 30);
    });
  }

  it('does 30 damage after Phantom Dive counters KO a Benched Hop Pokémon', () => {
    const game = setupGame({ turn: 3,
      player1: { active: { card: 'Dragapult ex TWM', energy: [psychic, 'Fire Energy SVE'] }, deck: padDeck(10) },
      player2: {
        active: { card: trevenant, energy: [psychic] },
        bench: [{ card: phantump, damage: 10 }],
        deck: padDeck(10)
      }
    });
    // Keep the Active out of Phantom Dive KO range to isolate counter placement.
    game.player2.active.getPokemonCard()!.hp = 240;
    game.overridePrompt(PutDamagePromptType, () => [
      { target: { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }, damage: 60 }
    ]);
    useAttack(game.store, game.state, 0, 'Phantom Dive');
    expect(game.player2.discard.cards.some(card => card.fullName === phantump)).toBe(true);
    expect(game.player2.pokemonKnockedOutByAttackDuringOpponentsLastTurn).toBe(false);

    useAttack(game.store, game.state, 1, 'Horrifying Revenge');
    expect(game.player1.active.damage).toBe(30);
  });
});
