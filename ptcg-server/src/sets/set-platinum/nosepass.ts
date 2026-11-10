import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { gustAfterAttack } from '../../game/store/prefabs/gust-after-attack';

export class Nosepass extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp = 60;
  public weakness = [{ type: CardType.WATER, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Pull", cost: [CardType.COLORLESS], damage: 0, text: "Switch the Defending Pokémon with 1 of your opponent's Benched Pokémon." },
    { name: "Rollout", cost: [CardType.FIGHTING, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'PL';
  public setNumber = "84";
  public cardImage = 'assets/cardback.png';
  public name = "Nosepass";
  public fullName = "Nosepass PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Nosepass.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) gustAfterAttack(state,effect,effect.source.getPokemonCard()||this);
    return state;
  }
}
