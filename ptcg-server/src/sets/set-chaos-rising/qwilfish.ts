import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, PowerType } from '../../game';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Qwilfish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Poison Point',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Poisoned.'
  }];

  public attacks = [{
    name: 'Venoshock',
    cost: [D],
    damage: 30,
    damageCalculation: '+' as '+',
    text: 'If your opponent\'s Active Pokemon is Poisoned, this attack does 50 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public usSetNumber = 'CRI 52';
  public name: string = 'Qwilfish';
  public fullName: string = 'Qwilfish M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-twilight-masquerade/heatran.ts (Incandescent Body).
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })
      && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (!IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
          store, state, owner, this.powers[0], this, effect.source, [SpecialCondition.POISONED]);
      }
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        effect.damage += 50;
      }
    }
    return state;
  }
}
