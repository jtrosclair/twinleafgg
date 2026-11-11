import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/set-pop-series-4/treecko.ts
export class Round27TreeckoDeltaP415 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.PSYCHIC;
  public hp = 40;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.WATER, value: -30 }];
  public retreat = [CardType.COLORLESS];
  public tags = [CardTag.DELTA_SPECIES];
  public attacks = [
    { name: "Pound", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Shining Claws", cost: [CardType.PSYCHIC], damage: 10, text: "Flip a coin. If heads, the Defending Pokémon is now Confused." }
  ];
  public set: string = "P4";
  public setNumber = "15";
  public cardImage = 'assets/cardback.png';
  public name = "Treecko";
  public fullName = "Treecko δ P4";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27TreeckoDeltaP415.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.CONFUSED);
    return state;
  }
}
