import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { targetedDamageAfterAttack } from '../set-upstream-round28/targeted-damage';
import { discardOpponentEnergyAfterDamage } from '../set-upstream-round29/discard-opponent-energy';
import { optionalSelfSwitchAfterDamage } from '../round26-attack-effects';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-arceus/shinx.ts
export class Round29ShinxAR74 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.LIGHTNING;
  public hp = 60;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Gnaw", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Swagger", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "Flip a coin. If heads, discard an Energy card attached to the Defending Pokémon." }
  ];
  public set: string = "AR";
  public setNumber = "74";
  public cardImage = 'assets/cardback.png';
  public name = "Shinx";
  public fullName = "Shinx AR";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round29ShinxAR74.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) discardOpponentEnergyAfterDamage(state, effect, true);
    return state;
  }
}
