import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Drednaw extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.WATER;
  public hp: number = 140;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Chewtle';

  public powers = [{
    name: 'Impervious Shell',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon if that damage is 200 or more.'
  }];

  public attacks = [{
    name: 'Hard Crunch',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 80 more damage.'
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public name: string = 'Drednaw';
  public fullName: string = 'Drednaw SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this) && effect.damage >= 200) {
      // Ref: set-stellar-crown/bouffalant.ts (passive ability permission).
      const owner = StateUtils.findOwner(state, effect.target);
      if (!IS_ABILITY_BLOCKED(store, state, owner, this)) {
        effect.damage = 0;
      }
    }

    return Drednaw.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active;

      if (opponentActive.damage > 0) {
        effect.damage += 80;
      }
    }
    return state;
  }
}
