import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, DRAW_CARDS, DISCARD_TOP_X_OF_OPPONENTS_DECK, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { targetDamageAfter, coinRecoilAfter } from '../set-platinum/round24-attack-helpers';

export class BunearyRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public hp = 50;
  public cardType: CardType = CardType.COLORLESS;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public resistance = [];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Bounce", cost: [CardType.COLORLESS], damage: 0, text: "Switch Buneary with 1 of your Benched Pokémon." },
    { name: "Mini Drain", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "Remove 1 damage counter from Buneary." }
  ];
  public set = "SV";
  public setNumber = "94";
  public cardImage = "assets/cardback.png";
  public name = "Buneary";
  public fullName = "Buneary SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return BunearyRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/self-switch-after-attack.ts (switch timing).
    if (WAS_ATTACK_USED(effect, 0, this)) selfSwitchAfterAttack(state,effect);
    // Ref: set-great-encounters/ge-attack-effects.ts (after-damage effects).
    if (WAS_ATTACK_USED(effect, 1, this)) healAttackerAfterDamage(state,effect,10);
    return state;
  }
}
