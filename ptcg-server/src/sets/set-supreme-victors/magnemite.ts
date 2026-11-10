import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Magnemite extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp = 40;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Speed Ball", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Quick Attack", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 10, damageCalculation: "+", text: "Flip a coin. If heads, this attack does 10 damage plus 20 more damage." }
  ];
  public set = 'SV';
  public setNumber = "111";
  public cardImage = 'assets/cardback.png';
  public name = "Magnemite";
  public fullName = "Magnemite SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Magnemite.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 20; });
    return state;
  }
}
