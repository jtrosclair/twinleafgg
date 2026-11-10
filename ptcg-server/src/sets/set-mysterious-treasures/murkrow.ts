import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';

export class Murkrow extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp = 60;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Swarm", cost: [], damage: 0, text: "Search your deck for Murkrow and put it onto your Bench. Shuffle your deck afterward." },
    { name: "Hide Crowd", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "Switch Murkrow with 1 of your Benched Pokémon." }
  ];
  public set = "MT";
  public setNumber = "90";
  public cardImage = 'assets/cardback.png';
  public name = "Murkrow";
  public fullName = "Murkrow MT";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Murkrow.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-secret-wonders/shellos-east-sea.ts (named Basic search).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => searchBasicsToBench(s, next, effect, 1, ['Murkrow']));
    // Ref: game/store/prefabs/self-switch-after-attack.ts (original attacker).
    if (WAS_ATTACK_USED(effect, 1, this)) selfSwitchAfterAttack(state, effect);
    return state;
  }
}
