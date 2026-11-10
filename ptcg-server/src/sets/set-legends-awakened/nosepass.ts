import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Nosepass extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp = 70;
  public weakness = [{ type: CardType.WATER, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Sharpen", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Nose Poke", cost: [CardType.FIGHTING, CardType.COLORLESS], damage: 20, damageCalculation: "+", text: "If Probopass is on your Bench, this attack does 20 damage plus 20 more damage." }
  ];
  public set = "LA";
  public setNumber = "109";
  public cardImage = 'assets/cardback.png';
  public name = "Nosepass";
  public fullName = "Nosepass LA";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Nosepass.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this) && effect.player.bench.some(slot => slot.getPokemonCard()?.name === 'Probopass')) effect.damage += 20;
    return state;
  }
}
