import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameError, GameMessage, StateUtils } from '../../game';
import { RetreatEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Snorlax extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 150;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Block',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Active Pokémon can\'t retreat.'
  }];

  public attacks = [
    {
      name: 'Collapse',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 150,
      text: 'This Pokemon is now Asleep.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'PGO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '55';

  public name: string = 'Snorlax';

  public fullName: string = 'Snorlax PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Block
    if (effect instanceof RetreatEffect) {
      const owner = StateUtils.getOpponent(state, effect.player);
      if (owner.active.getPokemonCard() === this && !IS_ABILITY_BLOCKED(store, state, owner, this)
        && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, this.powers[0], this, effect.player.active)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Collapse
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.addSpecialCondition(SpecialCondition.ASLEEP);
      return state;
    }

    return state;
  }
}
