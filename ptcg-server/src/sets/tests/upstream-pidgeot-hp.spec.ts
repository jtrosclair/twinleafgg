import { CardManager } from '../../game/cards/card-manager';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { getCardByName, padDeck, setupGame } from './test-helpers';

class ProbePokemon extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = CardType.COLORLESS;
  public hp = 60;
  public name = 'Probe';
  public set = 'TST';
  public fullName = 'Probe TST';
  public powers = [{ name: 'Probe Power', powerType: PowerType.POKEPOWER, text: '' }];
}

class DeltaProbePokemon extends ProbePokemon {
  public name = 'Delta Probe';
  public tags = [CardTag.DELTA_SPECIES];
  public fullName = 'Delta Probe TST';
}

describe('Pidgeot HP Delta Reserve', () => {
  beforeAll(() => CardManager.getInstance().defineSet([new ProbePokemon(), new DeltaProbePokemon()]));

  it('registers Pidgeot HP with both printed types and the upstream number', () => {
    const pidgeot = getCardByName('Pidgeot HP') as PokemonCard;
    expect(pidgeot.setNumber).toBe('14');
    expect(pidgeot.cardType).toBe(CardType.LIGHTNING);
    expect(pidgeot.additionalCardTypes).toContain(CardType.METAL);
  });

  it('blocks non-Delta Poké-Powers while Holon Energy is attached', () => {
    const game = setupGame({
      turn: 3,
      player1: {
        active: { card: 'Pidgeot HP', energy: ['Holon Energy FF DS'] },
        deck: padDeck(12),
      },
      player2: {
        active: { card: 'Probe TST' },
        bench: [{ card: 'Delta Probe TST' }],
        deck: padDeck(12),
      },
    });
    const ordinaryPokemon = game.player2.active.getPokemonCard()!;
    const deltaPokemon = game.player2.bench[0].getPokemonCard()!;
    const ordinaryPowers = new CheckPokemonPowersEffect(game.player2, ordinaryPokemon);
    const deltaPowers = new CheckPokemonPowersEffect(game.player2, deltaPokemon);

    game.store.reduceEffect(game.state, ordinaryPowers);
    game.store.reduceEffect(game.state, deltaPowers);

    expect(ordinaryPowers.powers.some(power => power.powerType === PowerType.POKEPOWER)).toBe(false);
    expect(deltaPowers.powers.some(power => power.powerType === PowerType.POKEPOWER)).toBe(true);
    expect(() => game.store.reduceEffect(game.state,
      new PowerEffect(game.player2, ordinaryPokemon.powers[0], ordinaryPokemon),
    )).toThrow();
    expect(() => game.store.reduceEffect(game.state,
      new PowerEffect(game.player2, deltaPokemon.powers[0], deltaPokemon),
    )).not.toThrow();
  });

  it('stops blocking Poké-Powers when Holon Energy leaves Pidgeot', () => {
    const game = setupGame({
      turn: 3,
      player1: { active: { card: 'Pidgeot HP', energy: ['Holon Energy FF DS'] }, deck: padDeck(12) },
      player2: { active: { card: 'Probe TST' }, deck: padDeck(12) },
    });
    const probe = game.player2.active.getPokemonCard()!;
    game.player1.active.cards = game.player1.active.cards.filter(card => !card.name.includes('Holon Energy'));
    const powers = new CheckPokemonPowersEffect(game.player2, probe);

    game.store.reduceEffect(game.state, powers);

    expect(powers.powers.some(power => power.powerType === PowerType.POKEPOWER)).toBe(true);
    expect(() => game.store.reduceEffect(game.state,
      new PowerEffect(game.player2, probe.powers[0], probe),
    )).not.toThrow();
  });
});
