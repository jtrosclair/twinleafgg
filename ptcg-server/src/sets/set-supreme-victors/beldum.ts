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

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-supreme-victors/beldum.ts
export class Round28BeldumSV90 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.METAL;
  public hp = 50;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Pit Search", cost: [CardType.COLORLESS], damage: 0, text: "Search your deck for a Stadium card, show it to your opponent, and put it into your hand. Shuffle your deck afterward." },
    { name: "Ram", cost: [CardType.METAL], damage: 10, text: "" }
  ];
  public set: string = "SV";
  public setNumber = "90";
  public cardImage = 'assets/cardback.png';
  public name = "Beldum";
  public fullName = "Beldum SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28BeldumSV90.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => SEARCH_DECK_REVEAL_AND_MOVE(s, next, effect, this, { superType: SuperType.TRAINER, trainerType: TrainerType.STADIUM }, 1));
    return state;
  }
}
