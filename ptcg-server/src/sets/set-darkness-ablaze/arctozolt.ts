import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Arctozolt extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rare Fossil';
  public cardType: CardType = L;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Biting Whirlpool',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent attaches an Energy card from their hand to 1 of their Pokémon, put 2 damage counters on that Pokémon.'
  }];

  public attacks = [{
    name: 'Electro Ball',
    cost: [L, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Arctozolt';
  public fullName: string = 'Arctozolt DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: upstream db4eebfcf (opponent's attachment from hand and preventable counters).
    if (effect instanceof AfterAttachEnergyFromHandEffect) {
      const owner = StateUtils.getOpponent(state, effect.player);
      if (StateUtils.isPokemonInPlay(owner, this) && !IS_ABILITY_BLOCKED(store, state, owner, this)) {
        state = store.reduceEffect(state, new PlaceDamageCountersEffect(owner, effect.target, 20, this, this.powers[0]));
      }
    }

    return state;
  }
}