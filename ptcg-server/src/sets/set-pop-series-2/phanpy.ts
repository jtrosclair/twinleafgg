import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/set-pop-series-2/phanpy.ts
export class Round27PhanpyP215 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.FIGHTING;
  public hp = 50;
  public weakness = [{ type: CardType.GRASS }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Double Spin", cost: [CardType.FIGHTING], damage: 10, damageCalculation: "x" as "x", text: "Flip 2 coins. This attack does 10 damage times the number of heads." },
    { name: "Body Slam", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 10, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." }
  ];
  public set: string = "P2";
  public setNumber = "15";
  public cardImage = 'assets/cardback.png';
  public name = "Phanpy";
  public fullName = "Phanpy P2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27PhanpyP215.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => { const base = results.filter(Boolean).length * 10; effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; });
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    return state;
  }
}
