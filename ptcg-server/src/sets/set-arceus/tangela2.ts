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

export class Tangela2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 60;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Collect", cost: [CardType.COLORLESS], damage: 0, text: "Draw a card." },
    { name: "Stun Spore", cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." }
  ];
  public set = 'AR';
  public setNumber = "77";
  public cardImage = 'assets/cardback.png';
  public name = "Tangela";
  public fullName = "Tangela AR2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Tangela2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-mysterious-treasures/dunsparce.ts (draw after the attack).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (_s, next) => { DRAW_CARDS(effect.player, 1); return next; });
    // Ref: set-great-encounters/ge-attack-effects.ts (condition after damage).
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    return state;
  }
}
