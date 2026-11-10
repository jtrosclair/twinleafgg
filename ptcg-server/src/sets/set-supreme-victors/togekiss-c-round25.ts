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

export class TogekissCRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SP];
  public hp = 70;
  public cardType: CardType = CardType.COLORLESS;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [];
  public attacks = [
    { name: "Collect", cost: [], damage: 0, text: "Draw a card." },
    { name: "Reckless Charge", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "Togekiss C does 10 damage to itself." }
  ];
  public set = "SV";
  public setNumber = "86";
  public cardImage = "assets/cardback.png";
  public name = "Togekiss C";
  public fullName = "Togekiss C SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return TogekissCRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/attack-after-damage.ts (after-damage timing).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state,effect,(_s,next)=>{DRAW_CARDS(effect.player,1);return next;});
    // Ref: game/store/prefabs/recoil-after-attack.ts (recoil timing).
    if (WAS_ATTACK_USED(effect, 1, this)) recoilAfterAttack(state,effect,10);
    return state;
  }
}
