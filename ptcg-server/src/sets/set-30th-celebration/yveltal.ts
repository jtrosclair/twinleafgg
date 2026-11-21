import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Yveltal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 120;
  public cardType: CardType = CardType.DARK;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Life-Locked',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Active Pokémon can\'t be healed.'
  }];

  public attacks = [{
    name: 'Dark Cutter',
    cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Yveltal';
  public fullName: string = 'Yveltal 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // HealTargetEffect also delegates here through the engine's HealEffect.
    if (effect instanceof HealEffect && effect.damage > 0) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      const owner = StateUtils.getOpponent(state, targetOwner);
      if (effect.target === targetOwner.active && StateUtils.isPokemonInPlay(owner, this)
        && !IS_ABILITY_BLOCKED(store, state, owner, this)
        && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, this.powers[0], this, effect.target)) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}
