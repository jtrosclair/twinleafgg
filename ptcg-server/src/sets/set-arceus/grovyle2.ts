import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Grovyle2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Treecko";
  public cardType: CardType = CardType.GRASS;
  public hp = 80;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Quick Attack", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, damageCalculation: "+", text: "Flip a coin. If heads, this attack does 20 damage plus 10 more damage." },
    { name: "Cut", cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS], damage: 50, text: "" }
  ];
  public set = 'AR';
  public setNumber = "39";
  public cardImage = 'assets/cardback.png';
  public name = "Grovyle";
  public fullName = "Grovyle AR2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Grovyle2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-diamond-and-pearl/cherrim.ts (additive coin bonus).
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
      if (heads) effect.damage += 10;
    });
    return state;
  }
}
