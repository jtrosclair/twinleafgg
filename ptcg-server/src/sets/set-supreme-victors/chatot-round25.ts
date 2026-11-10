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

export class ChatotRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public hp = 60;
  public cardType: CardType = CardType.COLORLESS;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Call for Family", cost: [CardType.COLORLESS], damage: 0, text: "Search your deck for a Basic Pokémon and put it onto your Bench. Shuffle your deck afterward." },
    { name: "Nosedive", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "Flip a coin. If tails, Chatot does 10 damage to itself." }
  ];
  public set = "SV";
  public setNumber = "95";
  public cardImage = "assets/cardback.png";
  public name = "Chatot";
  public fullName = "Chatot SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return ChatotRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/attack-after-damage.ts (after-damage timing).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state,effect,(s,next)=>{
      if (!effect.player.deck.cards.length || !effect.player.bench.some(slot=>!slot.getPokemonCard())) return next;
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(s,next,effect.player,{stage:Stage.BASIC},{min:0,max:1,allowCancel:false});
    });
    // Ref: set-platinum/round24-attack-helpers.ts (target and recoil effects).
    if (WAS_ATTACK_USED(effect, 1, this)) coinRecoilAfter(state,effect,10);
    return state;
  }
}
