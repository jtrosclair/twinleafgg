import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition, SuperType, TrainerType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { targetedDamageAfterAttack } from '../set-upstream-round28/targeted-damage';
import { coinSelfProtectionAfterDamage } from '../set-upstream-round28/self-protection';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';
import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';

// Upstream: ptcg-server/src/sets/05-heartgold-and-soulsilver/set-unleashed/poliwag.ts
export class Round28PoliwagUL58 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.WATER;
  public hp = 50;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Call for Family", cost: [CardType.COLORLESS], damage: 0, text: "Search your deck for a Basic Pokémon and put it onto your Bench. Shuffle your deck afterward." },
    { name: "Razor Fin", cost: [CardType.WATER, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set: string = "UL";
  public setNumber = "58";
  public cardImage = 'assets/cardback.png';
  public name = "Poliwag";
  public fullName = "Poliwag UL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28PoliwagUL58.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => searchBasicsToBench(s, next, effect, 1));
    return state;
  }
}
