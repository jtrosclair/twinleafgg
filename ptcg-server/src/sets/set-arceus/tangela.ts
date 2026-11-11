import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-arceus/tangela.ts
export class Round27TangelaAR76 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.GRASS;
  public hp = 70;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Absorb", cost: [CardType.COLORLESS], damage: 10, text: "Remove 1 damage counter from Tangela." },
    { name: "Sleep Powder", cost: [CardType.GRASS, CardType.COLORLESS], damage: 20, text: "The Defending Pokémon is now Asleep." }
  ];
  public set: string = "AR";
  public setNumber = "76";
  public cardImage = 'assets/cardback.png';
  public name = "Tangela";
  public fullName = "Tangela AR 76";
  public legacyFullName = 'Tangela AR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27TangelaAR76.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) healAttackerAfterDamage(state, effect, 10);
    if (WAS_ATTACK_USED(effect, 1, this)) conditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    return state;
  }
}
