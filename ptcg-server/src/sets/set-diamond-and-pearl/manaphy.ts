import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';

export class Manaphy extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 70;
  public weakness = [{ type: CardType.LIGHTNING, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Call for Family", cost: [CardType.COLORLESS], damage: 0, text: "Search your deck for a Basic Pokémon and put it onto your Bench. Shuffle your deck afterward." },
    { name: "Aqua Ring", cost: [CardType.WATER, CardType.WATER], damage: 30, text: "Switch Manaphy with 1 of your Benched Pokémon." }
  ];
  public set = "DP";
  public setNumber = "9";
  public cardImage = 'assets/cardback.png';
  public name = "Manaphy";
  public fullName = "Manaphy DP";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Manaphy.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-mysterious-treasures/kricketot.ts (private deck search and Bench play).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => searchBasicsToBench(s, next, effect, 1));
    // Ref: game/store/prefabs/self-switch-after-attack.ts (original attacker).
    if (WAS_ATTACK_USED(effect, 1, this)) selfSwitchAfterAttack(state, effect);
    return state;
  }
}
