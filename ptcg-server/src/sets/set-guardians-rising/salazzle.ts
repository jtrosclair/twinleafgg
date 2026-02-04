import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, JUST_EVOLVED, IS_ABILITY_BLOCKED, CONFIRMATION_PROMPT } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Salazzle extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Salandit';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 110;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Hot Poison',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may leave your opponent\'s Active Pokémon Burned and Poisoned.'
  }];

  public attacks = [
    {
      name: 'Flamethrower',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      text: 'Discard an Energy from this Pokémon.',
    }
  ];

  public set: string = 'GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';

  public name: string = 'Salazzle';

  public fullName: string = 'Salazzle GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Hot Poison ability
    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          opponent.active.addSpecialCondition(SpecialCondition.BURNED);
          opponent.active.addSpecialCondition(SpecialCondition.POISONED);
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Flamethrower attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
