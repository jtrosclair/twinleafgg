import { GameLog } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { ChooseAttackPrompt, ChooseAttackPromptType } from '../../game/store/prompts/choose-attack-prompt';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { useAttack } from './card-test-helpers';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const psychic = 'Psychic Energy SVE';
const dark = 'Darkness Energy SVE';
const mew = 'Mew ex MEW';
const bruteBonnet = 'Brute Bonnet TWM';
const persian = "Team Rocket's Persian ex DRI";
const mimikyu = "Team Rocket's Mimikyu DRI";
const slowking = 'Slowking SCR';
const thievul = 'Thievul M5';

function board(player: PlayerConfig, opponent: PlayerConfig) {
  return setupGame({
    turn: 5,
    player1: { ...player, deck: player.deck ?? padDeck(12) },
    player2: { ...opponent, deck: opponent.deck ?? padDeck(12) },
  });
}

describe('modern copy attacks resolve the complete copied effect', () => {
  for (const [card, attack] of [
    ['Clefable TWM', 'Metronome'],
    [thievul, 'Skill Thief'],
    [mew, 'Genome Hacking'],
  ] as const) {
    it(`${attack} applies Poison Spray and retains the declared attack in history`, () => {
      const game = board({ active: { card, energy: [psychic, water, water] } }, { active: { card: bruteBonnet } });
      game.overridePrompt(ChooseAttackPromptType, () => ({ index: 0, attack: 'Poison Spray' }));
      useAttack(game.store, game.state, 0, attack);
      expect(game.player2.active.specialConditions).toContain(SpecialCondition.POISONED);
      expect(game.player2.active.damage).toBe(10);
      expect(game.store.state.playerLastAttack[game.player1.id].attack.name).toBe(attack);
    });
  }

  it('Skill Thief can copy a Benched Pokémon while still targeting the opposing Active', () => {
    const game = board({ active: { card: thievul, energy: [water, water] } }, {
      active: { card: mew }, bench: [{ card: bruteBonnet }],
    });
    game.overridePrompt(ChoosePokemonPromptType, () => [
      { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 },
    ]);
    game.overridePrompt(ChooseAttackPromptType, () => ({ index: 0, attack: 'Poison Spray' }));
    useAttack(game.store, game.state, 0, 'Skill Thief');
    expect(game.player2.active.specialConditions).toContain(SpecialCondition.POISONED);
    expect(game.player2.bench[0].specialConditions).toEqual([]);
  });

  it('Skill Thief does nothing when its owner has a card in hand', () => {
    const game = board({ active: { card: thievul, energy: [water, water] }, hand: [water] },
      { active: { card: bruteBonnet } });
    useAttack(game.store, game.state, 0, 'Skill Thief');
    expect(game.state.prompts.some(prompt => prompt.type === ChooseAttackPromptType)).toBe(false);
    expect(game.player2.active.specialConditions).toEqual([]);
  });

  it('Mimed Games gives the opponent the printed choice and resolves a Benched source', () => {
    const game = board({ active: { card: 'Mime Jr. PAF' } },
      { active: { card: mew }, bench: [{ card: bruteBonnet }] });
    game.overridePrompt(ChooseAttackPromptType, prompt => {
      const choices = prompt as ChooseAttackPrompt;
      expect(choices.playerId).toBe(game.player2.id);
      expect(choices.options.allowCancel).toBe(false);
      expect(choices.cards.map(card => card.fullName)).toEqual([mew, bruteBonnet]);
      return { index: 1, attack: 'Poison Spray' };
    });
    useAttack(game.store, game.state, 0, 'Mimed Games');
    expect(game.player2.active.specialConditions).toContain(SpecialCondition.POISONED);
    expect(game.player2.active.damage).toBe(10);
  });

  it('Gemstone Hunt resolves the Active Tera Pokémon’s attack without paying its attack cost', () => {
    const game = board({ active: { card: mimikyu, energy: [psychic, water] } },
      { active: { card: 'Charizard ex OBF' } });
    game.overridePrompt(ChooseAttackPromptType, () => ({ index: 0, attack: 'Burning Darkness' }));
    useAttack(game.store, game.state, 0, 'Gemstone Hunt');
    expect(game.player2.active.damage).toBe(180);
  });

  it('Gemstone Hunt does nothing to a non-Tera Active Pokémon', () => {
    const game = board({ active: { card: mimikyu, energy: [psychic, water] } },
      { active: { card: bruteBonnet } });
    useAttack(game.store, game.state, 0, 'Gemstone Hunt');
    expect(game.state.prompts.some(prompt => prompt.type === ChooseAttackPromptType)).toBe(false);
    expect(game.player2.active.damage).toBe(0);
  });

  it('Night Joker lists only the eligible N’s Bench and uses a copied Shred', () => {
    const game = board({ active: { card: "N's Zoroark ex JTG", energy: [dark, dark] },
      bench: [{ card: bruteBonnet }, { card: "N's Zekrom M2a" }] },
      { active: { card: 'Mimikyu PAL' } });
    game.overridePrompt(ChooseAttackPromptType, prompt => {
      expect((prompt as ChooseAttackPrompt).cards.map(card => card.fullName)).toEqual(["N's Zekrom M2a"]);
      return { index: 0, attack: 'Shred' };
    });
    useAttack(game.store, game.state, 0, 'Night Joker');
    expect(game.state.logs.some(log => log.message === GameLog.LOG_PLAYER_DEALS_DAMAGE && log.params?.damage === 70))
      .toBe(true);
  });

  it('Seek Inspiration discards the top Pokémon and runs its mandatory copied attack', () => {
    const game = board({ active: { card: slowking, energy: [psychic, water] },
      deck: [bruteBonnet, ...padDeck(9)] }, { active: { card: mew } });
    game.overridePrompt(ChooseAttackPromptType, prompt => {
      expect((prompt as ChooseAttackPrompt).options.allowCancel).toBe(false);
      expect(game.player1.discard.cards[0]?.fullName).toBe(bruteBonnet);
      return { index: 0, attack: 'Poison Spray' };
    });
    useAttack(game.store, game.state, 0, 'Seek Inspiration');
    expect(game.player2.active.specialConditions).toContain(SpecialCondition.POISONED);
    expect(game.player2.active.damage).toBe(10);
  });

  it('Seek Inspiration discards a Rule Box Pokémon without using its attacks', () => {
    const game = board({ active: { card: slowking, energy: [psychic, water] },
      deck: [mew, ...padDeck(9)] }, { active: { card: mew } });
    useAttack(game.store, game.state, 0, 'Seek Inspiration');
    expect(game.player1.discard.cards[0]?.fullName).toBe(mew);
    expect(game.state.prompts.some(prompt => prompt.type === ChooseAttackPromptType)).toBe(false);
    expect(game.player2.active.damage).toBe(0);
  });
});

describe('Haughty Orders reveal and copy sequencing', () => {
  it('finishes the copied Poison Spray before shuffling a short revealed deck', () => {
    const game = board({ active: { card: persian, energy: [water, water] } },
      { active: { card: mew }, deck: [bruteBonnet, ...padDeck(3)] });
    const deck = game.player2.deck.cards.slice();
    game.overridePrompt(ChooseAttackPromptType, prompt => {
      expect((prompt as ChooseAttackPrompt).options.allowCancel).toBe(true);
      expect((prompt as ChooseAttackPrompt).cards.map(card => card.fullName)).toEqual([bruteBonnet]);
      return { index: 0, attack: 'Poison Spray' };
    });
    let poisonedAtShuffle = false;
    game.overridePrompt('Shuffle deck', () => {
      poisonedAtShuffle = game.player2.active.specialConditions.includes(SpecialCondition.POISONED);
      return deck.map((_, index) => index);
    });
    useAttack(game.store, game.state, 0, 'Haughty Orders');
    expect(poisonedAtShuffle).toBe(true);
    expect(game.player2.active.damage).toBe(10);
    expect([...game.player2.deck.cards, ...game.player2.hand.cards].map(card => card.id).sort())
      .toEqual(deck.map(card => card.id).sort());
  });

  it('can copy Haughty Orders again after shuffling the first reveal', () => {
    const game = board({ active: { card: persian, energy: [water, water] } },
      { active: { card: mew }, deck: [persian, bruteBonnet, ...padDeck(3)] });
    const observations: string[] = [];
    game.overridePrompt('Shuffle deck', prompt => {
      observations.push('shuffle');
      return game.player2.deck.cards.map((_, index) => index);
    });
    game.overridePrompt(ChooseAttackPromptType, () => {
      observations.push('first choice');
      game.overridePrompt(ChooseAttackPromptType, () => {
        observations.push('second choice');
        return { index: 1, attack: 'Poison Spray' };
      });
      return { index: 0, attack: 'Haughty Orders' };
    });
    useAttack(game.store, game.state, 0, 'Haughty Orders');
    expect(observations).toEqual(['first choice', 'shuffle', 'second choice']);
    expect(game.player2.active.specialConditions).toContain(SpecialCondition.POISONED);
  });

  it('shuffles the revealed deck even when the attacker declines the optional copy', () => {
    const game = board({ active: { card: persian, energy: [water, water] } },
      { active: { card: mew }, deck: [bruteBonnet, ...padDeck(3)] });
    game.overridePrompt(ChooseAttackPromptType, () => null);
    let shuffles = 0;
    game.overridePrompt('Shuffle deck', () => {
      shuffles++;
      return game.player2.deck.cards.map((_, index) => index);
    });
    useAttack(game.store, game.state, 0, 'Haughty Orders');
    expect(shuffles).toBe(1);
    expect(game.player2.active.damage).toBe(0);
    expect(game.player2.deck.cards.length + game.player2.hand.cards.length).toBe(4);
  });
});
