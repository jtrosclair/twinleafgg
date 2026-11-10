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

export class StaraviaRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Starly";
  public hp = 70;
  public cardType: CardType = CardType.COLORLESS;
  public weakness = [{ type: CardType.LIGHTNING, value: 20 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Double Peck", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, damageCalculation: "x" as const, text: "Flip 2 coins. This attack does 20 damage times the number of heads." },
    { name: "Air Crash", cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "Flip a coin. If heads, discard an Energy card attached to the Defending Pokémon." }
  ];
  public set = "SV";
  public setNumber = "85";
  public cardImage = "assets/cardback.png";
  public name = "Staravia";
  public fullName = "Staravia SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return StaraviaRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts (coin, draw and search effects).
    if (WAS_ATTACK_USED(effect, 0, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
      const base = 20 * results.filter(Boolean).length;
      effect.damage = base ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    // Ref: game/store/prefabs/prefabs.ts (coin, draw and search effects).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const target=effect.opponent.active,defender=target.getPokemonCard();
      afterAttackDamage(state,effect,(s,next)=>COIN_FLIP_PROMPT(s,next,effect.player,heads=>{
        if(heads && defender && effect.opponent.active===target && target.getPokemonCard()===defender) DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(s,next,effect);
      }));
    }
    return state;
  }
}
