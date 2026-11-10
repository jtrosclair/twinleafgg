import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { gustAfterAttack } from '../../game/store/prefabs/gust-after-attack';

export class Glameow extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 50;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Captivate", cost: [CardType.COLORLESS], damage: 0, text: "Switch 1 of your opponent's Benched Pokémon with 1 of the Defending Pokémon." },
    { name: "Slash", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = "GE";
  public setNumber = "68";
  public cardImage = 'assets/cardback.png';
  public name = "Glameow";
  public fullName = "Glameow GE";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Glameow.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/gust-after-attack.ts (attacker chooses replacement).
    if (WAS_ATTACK_USED(effect, 0, this)) gustAfterAttack(state, effect, effect.source.getPokemonCard() || this);
    return state;
  }
}
