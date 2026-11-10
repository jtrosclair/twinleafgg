import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Chimchar extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp = 50;
  public weakness = [{ type: CardType.WATER, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Chop", cost: [CardType.FIRE], damage: 10, text: "" },
    { name: "Jump On", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 10, damageCalculation: "+", text: "Flip a coin. If heads, this attack does 10 damage plus 20 more damage." }
  ];
  public set = 'SV';
  public setNumber = "97";
  public cardImage = 'assets/cardback.png';
  public name = "Chimchar";
  public fullName = "Chimchar SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Chimchar.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 20; });
    return state;
  }
}
