import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { coinConditionAfterDamage, conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

export class Omanyte extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Helix Fossil";
  public cardType: CardType = CardType.WATER;
  public hp = 80;
  public weakness = [{ type: CardType.GRASS, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Collect", cost: [CardType.WATER], damage: 0, text: "Draw 3 cards." },
    { name: "Tickle", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." }
  ];
  public set = 'AR';
  public setNumber = "70";
  public cardImage = 'assets/cardback.png';
  public name = "Omanyte";
  public fullName = "Omanyte AR";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Omanyte.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-mysterious-treasures/dunsparce.ts (draw after the attack).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (_s, next) => { DRAW_CARDS(effect.player, 3); return next; });
    // Ref: set-great-encounters/ge-attack-effects.ts (condition after damage).
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    return state;
  }
}
