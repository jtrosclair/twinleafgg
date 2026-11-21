import { CardType, PokemonCard, PowerType, Stage, State, StoreLike } from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { afterAttackDamage } from '../../../game/store/prefabs/attack-after-damage';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Machamp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Machoke';
  public hp: number = 180;
  public cardType: CardType = F;
  public weakness = [{ type: P }];
  public resistance = [];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Trained Arms',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon\'s attacks aren\'t affected by Resistance or any effects on your opponent\'s Active Pokémon.'
  }];

  public attacks = [{
    name: 'Guts Fight',
    cost: [F, C, C, C],
    damage: 250,
    text: 'This Pokémon also does 20 damage to itself.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Machamp';
  public fullName: string = 'Machamp FLO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.source.getPokemonCard() === this
      && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      effect.ignoreResistance = true;
      effect.ignoreDefendingDamageEffects = true;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamage(state, effect, (store, next) => {
        const recoil = new PutDamageEffect(effect, 20);
        recoil.target = effect.source;
        return store.reduceEffect(next, recoil);
      });
    }

    return state;
  }
}
