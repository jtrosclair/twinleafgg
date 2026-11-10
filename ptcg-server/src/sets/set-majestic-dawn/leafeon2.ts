import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Leafeon2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Eevee";
  public cardType: CardType = CardType.GRASS;
  public hp = 90;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Spiral Drain", cost: [CardType.GRASS, CardType.COLORLESS], damage: 40, text: "Remove 1 damage counter from Leafeon." },
    { name: "Leaf Blade", cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS], damage: 50, damageCalculation: "+", text: "Flip a coin. If heads, this attack does 50 damage plus 20 more damage." }
  ];
  public set = "MD";
  public setNumber = "24";
  public cardImage = 'assets/cardback.png';
  public name = "Leafeon";
  public fullName = "Leafeon MD2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Leafeon2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) healAttackerAfterDamage(state, effect, 10);
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 20; });
    return state;
  }
}
