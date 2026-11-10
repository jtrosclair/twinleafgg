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

export class LoudredRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Whismur";
  public hp = 80;
  public cardType: CardType = CardType.COLORLESS;
  public weakness = [{ type: CardType.FIGHTING, value: 20 }];
  public resistance = [];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Smash Kick", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "" },
    { name: "Stomp Off", cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 50, text: "Discard the top card from your opponent's deck." }
  ];
  public set = "SV";
  public setNumber = "64";
  public cardImage = "assets/cardback.png";
  public name = "Loudred";
  public fullName = "Loudred SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return LoudredRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts (coin, draw and search effects).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const attacker = effect.source.getPokemonCard() || this;
      afterAttackDamage(state, effect, (s,next) => {
        if (effect.opponent.deck.cards.length) DISCARD_TOP_X_OF_OPPONENTS_DECK(s,next,effect.player,1,attacker,effect);
        return next;
      });
    }
    return state;
  }
}
