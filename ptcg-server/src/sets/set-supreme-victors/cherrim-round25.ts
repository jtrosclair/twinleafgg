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

export class CherrimRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Cherubi";
  public hp = 80;
  public cardType: CardType = CardType.GRASS;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Ram", cost: [], damage: 20, text: "" },
    { name: "Petal Dance", cost: [CardType.GRASS], damage: 30, damageCalculation: "x" as const, text: "Flip 3 coins. This attack does 30 damage times the number of heads. Cherrim is now Confused." }
  ];
  public set = "SV";
  public setNumber = "55";
  public cardImage = "assets/cardback.png";
  public name = "Cherrim";
  public fullName = "Cherrim SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return CherrimRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts (coin, draw and search effects).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const source=effect.source, card=source.getPokemonCard();
      afterAttackDamage(state, effect, (s,next) => {
        if (!card || effect.player.active !== source || source.getPokemonCard() !== card) return next;
        const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]); condition.target = source;
        return s.reduceEffect(next,condition);
      });
    }
    // Ref: game/store/prefabs/prefabs.ts (coin, draw and search effects).
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
      const base = 30 * results.filter(Boolean).length;
      effect.damage = base ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    return state;
  }
}
