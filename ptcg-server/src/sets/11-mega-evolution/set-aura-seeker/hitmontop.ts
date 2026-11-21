import { afterAttackDamage } from '../../../game/store/prefabs/attack-after-damage';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Hitmontop extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType = F;
  public weakness = [{ type: P }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Triple Kick',
    cost: [F],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 10 damage for each heads.'
  },
  {
    name: 'Guts Fight',
    cost: [C, C],
    damage: 60,
    text: 'This Pokémon also does 20 damage to itself.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Hitmontop';
  public fullName: string = 'Hitmontop FLO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Triple Kick
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        effect.damage = heads ? effect.damage + 10 * heads - effect.attack.damage : 0;
      });
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
