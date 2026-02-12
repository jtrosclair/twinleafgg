import { PokemonCard, Stage, CardType, PowerType, SpecialCondition, State, StateUtils, StoreLike } from '../../game';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Hypno extends PokemonCard {

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Drowzee';

  public cardType = CardType.PSYCHIC;

  public hp = 110;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Here for Hypnosis',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may make your opponent\'s Active Pokémon Asleep.'
  }];

  public attacks = [{
    name: 'Super Psy Bolt',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
    damage: 110,
    text: ''
  }];

  public set: string = 'MEW';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public name: string = 'Hypno';

  public fullName: string = 'Hypno MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Here for Hypnosis ability - when evolving, may make opponent's Active Pokémon Asleep
    if (effect instanceof EvolveEffect && effect.pokemonCard === this) {

      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this))
        return state;

      // Apply Asleep condition to opponent's Active Pokémon
      const opponent = StateUtils.getOpponent(state, player);
      const specialConditionEffect = new AddSpecialConditionsPowerEffect(player, this, opponent.active, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);

      return state;
    }

    return state;
  }
}
