import { PokemonCard, Stage, CardType, PowerType, SpecialCondition, State, StateUtils, StoreLike } from '../../game';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED_FROM_HAND } from '../../game/store/prefabs/prefabs';

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
    if (JUST_EVOLVED_FROM_HAND(effect, state, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return CONFIRMATION_PROMPT(store, state, player, accepted => {
        if (accepted) {
          store.reduceEffect(state, new AddSpecialConditionsPowerEffect(
            player, this, opponent.active, [SpecialCondition.ASLEEP],
          ));
        }
      });
    }

    return state;
  }
}
