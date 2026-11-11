import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/05-heartgold-and-soulsilver/set-heartgold-and-soulsilver-promos/plusle.ts
export class Round27PlusleHSP16 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.LIGHTNING;
  public hp = 60;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Collect", cost: [CardType.COLORLESS], damage: 0, text: "Draw 2 cards." },
    { name: "Thunder Jolt", cost: [CardType.LIGHTNING], damage: 20, text: "Flip a coin. If tails, Plusle does 10 damage to itself." }
  ];
  public set: string = "HSP";
  public setNumber = "16";
  public cardImage = 'assets/cardback.png';
  public name = "Plusle";
  public fullName = "Plusle HSP";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27PlusleHSP16.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (_store, next) => { DRAW_CARDS(effect.player, 2); return next; });
    if (WAS_ATTACK_USED(effect, 1, this)) coinRecoilAfterDamage(state, effect, 10);
    return state;
  }
}
