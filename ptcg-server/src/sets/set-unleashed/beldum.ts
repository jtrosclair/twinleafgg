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
import { optionalSelfSwitchAfterDamage } from '../round26-attack-effects';

// Upstream: ptcg-server/src/sets/05-heartgold-and-soulsilver/set-unleashed/beldum.ts
export class Round29BeldumUL44 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.PSYCHIC;
  public hp = 60;
  public weakness = [{ type: CardType.PSYCHIC }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Reaction", cost: [CardType.PSYCHIC], damage: 10, text: "You may switch Beldum with 1 of your Benched Pokémon." }
  ];
  public set: string = "UL";
  public setNumber = "44";
  public cardImage = 'assets/cardback.png';
  public name = "Beldum";
  public fullName = "Beldum UL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round29BeldumUL44.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) optionalSelfSwitchAfterDamage(state, effect);
    return state;
  }
}
