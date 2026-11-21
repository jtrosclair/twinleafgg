import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { attachedEnergyProvides, queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Magmortar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magmar';
  public hp: number = 110;
  public cardType: CardType = R;
  public weakness = [{ type: W, value: +30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Flame Body',
    powerType: PowerType.POKEBODY,
    text: 'When you attach a Fire Energy card from your hand to Magmortar, remove 2 damage counters from Magmortar.'
  }];

  public attacks = [{
    name: 'Flame Blast',
    cost: [R],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the number of Fire Energy attached to Magmortar.'
  },
  {
    name: 'Fireball Bazooka',
    cost: [R, C, C],
    damage: 40,
    text: 'Does 20 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Magmortar';
  public fullName: string = 'Magmortar SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flame Body
    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.target.getPokemonCard() === this) {
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        store.reduceEffect(state, new HealEffect(effect.player, effect.target, 20));
      }, () => attachedEnergyProvides(store, state, effect, CardType.FIRE));
    }

    // Flame Blast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);

      let fireCount = 0;
      checkEnergy.energyMap.forEach(em => {
        fireCount += em.provides.filter(c => c === CardType.FIRE || c === CardType.ANY).length;
      });
      effect.damage = 20 * fireCount;
    }

    // Fireball Bazooka
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const benched = opponent.bench.filter(b => b.cards.length > 0).length;
      if (benched === 0) {
        return state;
      }
      const max = Math.min(2, benched);
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(20, effect, store, state, max, max);
    }

    return state;
  }
}
