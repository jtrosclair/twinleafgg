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

export class FeebasRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public hp = 30;
  public cardType: CardType = CardType.WATER;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public resistance = [];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Surprise Attack", cost: [], damage: 20, text: "Flip a coin. If tails, this attack does nothing." },
    { name: "Count and Draw", cost: [CardType.WATER], damage: 0, text: "Draw a card for each of your opponent's Pokémon that isn't an Evolved Pokémon." }
  ];
  public set = "SV";
  public setNumber = "104";
  public cardImage = "assets/cardback.png";
  public name = "Feebas";
  public fullName = "Feebas SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return FeebasRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts (coin, draw and search effects).
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (!heads) effect.damage = 0; });
    // Ref: game/store/prefabs/attack-after-damage.ts (after-damage timing).
    if (WAS_ATTACK_USED(effect, 1, this)) afterAttackDamage(state,effect,(_s,next)=>{
      // Ref: set-delta-reign/legendary-stadiums.ts (effective Evolution stage,
      // including the underlying Pokémon when an LV.X is on top).
      const count = [effect.opponent.active, ...effect.opponent.bench].filter(slot => {
        const pokemon = slot.getPokemons();
        let top = pokemon[pokemon.length - 1];
        if (!top) return false;
        if (top.stage === Stage.LV_X) top = pokemon.slice().reverse().find(card => card.stage !== Stage.LV_X)!;
        return !!top && ![Stage.STAGE_1, Stage.STAGE_2, Stage.VMAX, Stage.VSTAR, Stage.MEGA, Stage.BREAK].includes(top.stage);
      }).length;
      DRAW_CARDS(effect.player,count);return next;
    });
    return state;
  }
}
