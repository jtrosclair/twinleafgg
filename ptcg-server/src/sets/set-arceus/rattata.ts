import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-arceus/rattata.ts
export class Round27RattataAR73 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.COLORLESS;
  public hp = 30;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public resistance = [];
  public retreat = [];
  public attacks = [
    { name: "Lunge", cost: [CardType.COLORLESS], damage: 30, text: "Flip a coin. If tails, this attack does nothing." }
  ];
  public set: string = "AR";
  public setNumber = "73";
  public cardImage = 'assets/cardback.png';
  public name = "Rattata";
  public fullName = "Rattata AR";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27RattataAR73.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (!heads) effect.damage = 0; });
    return state;
  }
}
