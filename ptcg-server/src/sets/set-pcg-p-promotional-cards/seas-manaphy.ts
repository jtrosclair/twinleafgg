import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { HealTargetEffect, RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
export class SeasManaphy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Hypnosplash',
    cost: [W],
    damage: 10,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Miraculous Light',
    cost: [W, C],
    damage: 20,
    text: 'Remove 1 damage counter and all Special Conditions from Sea\'s Manaphy.'
  }];

  public set: string = 'PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'Sea\'s Manaphy';
  public fullName: string = 'Sea\'s Manaphy PCGP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamage(state, effect, (currentStore, next) => {
        const heal = new HealTargetEffect(effect, 10);
        heal.target = effect.source;
        next = currentStore.reduceEffect(next, heal);
        const cure = new RemoveSpecialConditionsEffect(effect, undefined);
        cure.target = effect.source;
        return currentStore.reduceEffect(next, cure);
      });
    }

    return state;
  }
}

