import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Armarougeex extends PokemonCard implements CopiedAttackOwnershipContract {

  public tags = [CardTag.POKEMON_ex];

  public evolvesFrom = 'Charcadet';

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 260;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Crimson Armor',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP, it takes 80 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Scorching Bazooka',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 40,
      text: 'This attack does 40 more damage for each [R] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'PAR';

  public setNumber = '27';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'G';

  public name: string = 'Armarouge ex';

  public fullName: string = 'Armarouge ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crimson Armor
    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this && effect.target.damage === 0) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (effect.player !== owner && effect.source.getPokemonCard()
        && !IS_ABILITY_BLOCKED(store, state, owner, this)) {
        effect.reduceDamageAfterWeakness(80, this.fullName);
      }
    }

    return Armarougeex.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.FIRE || cardType === CardType.ANY;
        }).length;
      });

      effect.damage += energyCount * 40;
    }

    return state;
  }
}