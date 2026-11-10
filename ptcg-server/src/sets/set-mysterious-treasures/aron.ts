import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Aron extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = M;
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Steel Tackle',
    cost: [M, C],
    damage: 30,
    text: 'Aron does 10 damage to itself.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Aron';
  public fullName: string = 'Aron MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/goldeen.ts (post-damage Take Down recoil).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source = effect.source;
      const attacker = source.getPokemonCard();
      afterAttackDamage(state, effect, (effectStore, effectState) => {
        const inPlay = effectState.players.some(player => player.active === source || player.bench.includes(source));
        if (!attacker || !inPlay || !source.cards.includes(attacker)) return effectState;
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
