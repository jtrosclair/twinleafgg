import { ActiveAbilityLock, applyActiveAbilityLock } from '../../game/store/prefabs/active-ability-lock';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GalarianWeezing extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'D';

  public cardType: CardType = CardType.DARK;

  public evolvesFrom = 'Koffing';

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Neutralizing Gas',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Pokémon in play have no Abilities, except for Neutralizing Gas.'
  }];

  public attacks = [{
    name: 'Severe Poison',
    cost: [CardType.DARK],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 4 damage counters instead of 1 on that Pokémon during Pokémon Checkup.'
  }];

  public set: string = 'SHF';

  public name: string = 'Galarian Weezing';

  public fullName: string = 'Galarian Weezing SHF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '42';

  public activeAbilityLock(): ActiveAbilityLock {
    return {
      power: this.powers[0],
      exemptAbility: 'Neutralizing Gas',
      affects: (_store, _state, owner, { player, slot, enteringBench }) => player !== owner && (!!slot || !!enteringBench)
    };
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 40;
      store.reduceEffect(state, specialCondition);
    }

    applyActiveAbilityLock(store, state, effect, this);
    return state;
  }
}
