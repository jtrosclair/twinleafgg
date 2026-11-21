import { opponentSwitchAfterAttack } from '../../../game/store/prefabs/opponent-switch-after-attack';
import { afterAttackDamage } from '../../../game/store/prefabs/attack-after-damage';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Throh extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType = F;
  public weakness = [{ type: P }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Circle Throw',
    cost: [F],
    damage: 20,
    text: 'Switch your opponent\'s Active Pokémon with 1 of their Benched Pokémon. (Your opponent chooses the Pokémon to switch in.)'
  },
  {
    name: 'Guts Fight',
    cost: [C, C, C],
    damage: 110,
    text: 'This Pokémon also does 20 damage to itself.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Throh';
  public fullName: string = 'Throh FLO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      opponentSwitchAfterAttack(state, effect, this);
    }

    // Guts Fight
    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamage(state, effect, (store, next) => {
        const recoil = new DealDamageEffect(effect, 20);
        recoil.target = effect.source;
        return store.reduceEffect(next, recoil);
      });
    }

    return state;
  }
}
