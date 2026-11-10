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

export class CameruptGRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SP];
  public hp = 100;
  public cardType: CardType = CardType.FIRE;
  public weakness = [{ type: CardType.WATER }];
  public resistance = [];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Searing Flame", cost: [CardType.FIRE, CardType.COLORLESS], damage: 20, text: "The Defending Pokémon is now Burned." },
    { name: "Earth Power", cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 60, text: "Flip 2 coins. This attack does 10 damage times the number of heads to each of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)" }
  ];
  public set = "SV";
  public setNumber = "19";
  public cardImage = "assets/cardback.png";
  public name = "Camerupt G";
  public fullName = "Camerupt G SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return CameruptGRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-great-encounters/ge-attack-effects.ts (after-damage effects).
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.BURNED);
    // Ref: game/store/prefabs/attack-after-damage.ts (after-damage timing).
    if (WAS_ATTACK_USED(effect, 1, this)) afterAttackDamage(state, effect, (s, next) => MULTIPLE_COIN_FLIPS_PROMPT(s, next, effect.player, 2, results => {
      const amount = 10 * results.filter(Boolean).length;
      if (amount) effect.opponent.bench.forEach(target => { if (target.getPokemonCard()) { const damage = new PutDamageEffect(effect, amount); damage.target = target; s.reduceEffect(next, damage); } });
    }));
    return state;
  }
}
