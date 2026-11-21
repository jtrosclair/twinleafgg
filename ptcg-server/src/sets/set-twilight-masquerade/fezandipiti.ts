import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Fezandipiti extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Adrena-Pheromone',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon has any [D] Energy attached and is damaged by an attack, flip a coin. If heads, prevent that damage.',
  }];

  public attacks = [
    {
      name: 'Energy Feather',
      cost: [CardType.PSYCHIC],
      damage: 30,
      text: 'This attack does 30 damage for each Energy attached to this Pokemon.'
    },
  ];

  public set: string = 'TWM';

  public setNumber = '96';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Fezandipiti';

  public fullName: string = 'Fezandipiti TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Adrena-Pheromone uses the Energy in effect when damage would be dealt.
    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      effect.damagePreventionCoin = { source: this, requiredEnergy: CardType.DARK };
    }

    // Energy Feather counts the Energy on the Pokémon using this attack.
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const provided = new CheckProvidedEnergyEffect(effect.player, effect.source);
      state = store.reduceEffect(state, provided);
      const energyCount = provided.energyMap.reduce((sum, entry) => sum + entry.provides.length, 0);
      effect.damage = 30 * energyCount;
    }
    return state;
  }
}
