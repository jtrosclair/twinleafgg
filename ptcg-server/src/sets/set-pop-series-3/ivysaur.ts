import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

// Upstream: ptcg-server/src/sets/set-pop-series-3/ivysaur.ts
export class Round27IvysaurP314 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.STAGE_1;
  public cardType = CardType.GRASS;
  public hp = 70;
  public weakness = [{ type: CardType.PSYCHIC }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = "Bulbasaur";
  public attacks = [
    { name: "Gouge", cost: [CardType.COLORLESS], damage: 10, damageCalculation: "+" as "+", text: "Flip a coin. If heads, this attack does 10 damage plus 10 more damage." },
    { name: "Poisonpowder", cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS], damage: 40, text: "The Defending Pokémon is now Poisoned." }
  ];
  public set: string = "P3";
  public setNumber = "14";
  public cardImage = 'assets/cardback.png';
  public name = "Ivysaur";
  public fullName = "Ivysaur P3";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round27IvysaurP314.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 10; });
    if (WAS_ATTACK_USED(effect, 1, this)) conditionAfterDamage(state, effect, SpecialCondition.POISONED);
    return state;
  }
}
