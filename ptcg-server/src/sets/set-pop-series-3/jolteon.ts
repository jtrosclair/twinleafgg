import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/set-pop-series-3/jolteon.ts
export class Round27JolteonP33 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.STAGE_1;
  public cardType = CardType.LIGHTNING;
  public hp = 70;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -30 }];
  public retreat = [];
  public evolvesFrom = "Eevee";
  public attacks = [
    { name: "Thundershock", cost: [CardType.LIGHTNING, CardType.COLORLESS], damage: 20, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." },
    { name: "Pin Missile", cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS], damage: 20, damageCalculation: "x" as "x", text: "Flip 4 coins. This attack does 20 damage times the number of heads." }
  ];
  public set: string = "P3";
  public setNumber = "3";
  public cardImage = 'assets/cardback.png';
  public name = "Jolteon";
  public fullName = "Jolteon P3";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27JolteonP33.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => { const base = results.filter(Boolean).length * 20; effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; });
    return state;
  }
}
