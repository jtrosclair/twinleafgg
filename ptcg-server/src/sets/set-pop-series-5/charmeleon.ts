import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/set-pop-series-5/charmeleon.ts
export class Round27CharmeleonDeltaP55 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.STAGE_1;
  public cardType = CardType.LIGHTNING;
  public hp = 70;
  public weakness = [{ type: CardType.WATER }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = "Charmander";
  public tags = [CardTag.DELTA_SPECIES];
  public attacks = [
    { name: "Slash", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "" },
    { name: "Thunder Jolt", cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS], damage: 50, text: "Flip a coin. If tails, Charmeleon does 10 damage to itself." }
  ];
  public set: string = "P5";
  public setNumber = "5";
  public cardImage = 'assets/cardback.png';
  public name = "Charmeleon";
  public fullName = "Charmeleon δ P5";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27CharmeleonDeltaP55.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) coinRecoilAfterDamage(state, effect, 10);
    return state;
  }
}
