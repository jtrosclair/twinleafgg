import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/set-pop-series-4/grovyle.ts
export class Round27GrovyleP47 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.STAGE_1;
  public cardType = CardType.GRASS;
  public hp = 70;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.WATER, value: -30 }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = "Treecko";
  public attacks = [
    { name: "Quick Attack", cost: [CardType.COLORLESS], damage: 10, damageCalculation: "+" as "+", text: "Flip a coin. If heads, this attack does 10 damage plus 10 more damage." },
    { name: "Blot", cost: [CardType.GRASS, CardType.COLORLESS], damage: 20, text: "Remove 2 damage counters from Grovyle." }
  ];
  public set: string = "P4";
  public setNumber = "7";
  public cardImage = 'assets/cardback.png';
  public name = "Grovyle";
  public fullName = "Grovyle P4";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27GrovyleP47.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 10; });
    if (WAS_ATTACK_USED(effect, 1, this)) healAttackerAfterDamage(state, effect, 20);
    return state;
  }
}
