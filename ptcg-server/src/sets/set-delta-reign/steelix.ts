import { CardType, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Steelix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Onix';
  public cardType: CardType = F;
  public hp: number = 190;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'High Density Armor',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP, it takes 60 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Tough Swing',
    cost: [F, F, C, C],
    damage: 150,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'DLR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Steelix';
  public fullName: string = 'Steelix M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // High Density Armor
    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      const targetPlayer = StateUtils.findOwner(state, effect.target);
      // Only an opposing Pokémon's attack is reduced, not self-damage.
      if (effect.player !== targetPlayer && effect.source.getPokemonCard()
        && effect.target.damage === 0 && !IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        effect.reduceDamageAfterWeakness(60, 'STEELIX_DLR_HIGH_DENSITY_ARMOR_' + this.id);
      }
    }

    // Hard Swing
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}
