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

export class MedichamRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Meditite";
  public hp = 90;
  public cardType: CardType = CardType.PSYCHIC;
  public weakness = [{ type: CardType.PSYCHIC, value: 20 }];
  public resistance = [];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Channeling", cost: [CardType.PSYCHIC, CardType.COLORLESS], damage: 60, text: "Your opponent draws 2 cards." },
    { name: "Chakra Points", cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS], damage: 10, damageCalculation: "+" as const, text: "Does 10 damage plus 10 more damage for each card in your opponent's hand." }
  ];
  public set = "SV";
  public setNumber = "34";
  public cardImage = "assets/cardback.png";
  public name = "Medicham";
  public fullName = "Medicham SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return MedichamRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/attack-after-damage.ts (after-damage timing).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (_s, next) => { DRAW_CARDS(effect.opponent, 2); return next; });
    // Ref: game/store/prefabs/prefabs.ts (coin, draw and search effects).
    if (WAS_ATTACK_USED(effect, 1, this)) effect.damage += 10 * effect.opponent.hand.cards.length;
    return state;
  }
}
