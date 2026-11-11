import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-arceus/geodude.ts
export class Round27GeodudeAR65 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.FIGHTING;
  public hp = 60;
  public weakness = [{ type: CardType.GRASS, value: 10 }];
  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Stone Barrage", cost: [CardType.FIGHTING], damage: 10, damageCalculation: "x" as "x", text: "Flip a coin until you get tails. This attack does 10 damage times the number of heads." }
  ];
  public set: string = "AR";
  public setNumber = "65";
  public cardImage = 'assets/cardback.png';
  public name = "Geodude";
  public fullName = "Geodude AR";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27GeodudeAR65.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, heads => { const base = heads * 10; effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; });
    return state;
  }
}
