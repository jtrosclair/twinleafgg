import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { targetedDamageAfterAttack } from '../set-upstream-round28/targeted-damage';
import { coinSelfProtectionAfterDamage } from '../set-upstream-round28/self-protection';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-stormfront/snover.ts
export class Round28SnoverSF74 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.WATER;
  public hp = 50;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Hide", cost: [CardType.COLORLESS], damage: 0, text: "Flip a coin. If heads, prevent all effects of an attack, including damage, done to Snover during your opponent's next turn." },
    { name: "Powder Snow", cost: [CardType.WATER], damage: 10, text: "The Defending Pokémon is now Asleep." }
  ];
  public set: string = "SF";
  public setNumber = "74";
  public cardImage = 'assets/cardback.png';
  public name = "Snover";
  public fullName = "Snover SF";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round28SnoverSF74.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinSelfProtectionAfterDamage(state, effect, true);
    if (WAS_ATTACK_USED(effect, 1, this)) conditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    return state;
  }
}
