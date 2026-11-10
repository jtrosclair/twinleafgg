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

export class LucarioCRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SP];
  public hp = 90;
  public cardType: CardType = CardType.FIGHTING;
  public weakness = [{ type: CardType.PSYCHIC }];
  public resistance = [];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Metal Claw", cost: [CardType.COLORLESS], damage: 20, text: "" },
    { name: "Mid-air Strike", cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS], damage: 30, damageCalculation: "+" as const, text: "Flip a coin. If heads, this attack does 30 damage plus 30 more damage." }
  ];
  public set = "SV";
  public setNumber = "31";
  public cardImage = "assets/cardback.png";
  public name = "Lucario C";
  public fullName = "Lucario C SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return LucarioCRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts (coin, draw and search effects).
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 30; });
    return state;
  }
}
