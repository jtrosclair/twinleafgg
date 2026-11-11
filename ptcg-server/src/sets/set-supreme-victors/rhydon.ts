import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-supreme-victors/rhydon.ts
export class Round27RhydonSV80 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.STAGE_1;
  public cardType = CardType.FIGHTING;
  public hp = 90;
  public weakness = [{ type: CardType.WATER, value: 20 }];
  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = "Rhyhorn";
  public attacks = [
    { name: "Fury Attack", cost: [CardType.FIGHTING], damage: 20, damageCalculation: "x" as "x", text: "Flip 3 coins. This attack does 20 damage times the number of heads." },
    { name: "Rock Tumble", cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS], damage: 60, text: "This attack's damage isn't affected by Resistance." }
  ];
  public set: string = "SV";
  public setNumber = "80";
  public cardImage = 'assets/cardback.png';
  public name = "Rhydon";
  public fullName = "Rhydon SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27RhydonSV80.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => { const base = results.filter(Boolean).length * 20; effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; });
    if (WAS_ATTACK_USED(effect, 1, this)) effect.ignoreResistance = true;
    return state;
  }
}
