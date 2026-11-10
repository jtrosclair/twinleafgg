import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Goldeen extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = W;
  public weakness = [{ type: L, value: 10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Horn Attack',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Take Down',
    cost: [W, C],
    damage: 30,
    text: 'Goldeen does 10 damage to itself.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Goldeen';
  public fullName: string = 'Goldeen DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Take Down
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const source = effect.source;
      const attacker = source.getPokemonCard();
      afterAttackDamage(state, effect, (effectStore, effectState) => {
        // Slots move with switched Pokémon, but may also be reused after one
        // leaves play. Never damage a replacement occupying the old slot.
        const sourceStillInPlay = effectState.players.some(player =>
          player.active === source || player.bench.includes(source)
        );
        if (!attacker || !sourceStillInPlay || !source.cards.includes(attacker)) return effectState;
        const selfAttack = new AttackEffect(effect.player, effect.opponent, effect.attack);
        selfAttack.source = source;
        selfAttack.ignoreWeakness = true;
        selfAttack.ignoreResistance = true;
        const selfDamage = new DealDamageEffect(selfAttack, 10);
        selfDamage.target = source;
        return effectStore.reduceEffect(effectState, selfDamage);
      });
    }

    return state;
  }
}
