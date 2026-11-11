import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition, SuperType, EnergyType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { targetedDamageAfterAttack } from '../set-upstream-round28/targeted-damage';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-diamond-and-pearl-promos/buizel.ts
export class Round29BuizelDPP13 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.WATER;
  public hp = 60;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Splash About", cost: [CardType.WATER], damage: 10, damageCalculation: "+" as "+", text: "If Buizel has less Energy attached to it than the Defending Pokémon, this attack does 10 damage plus 10 more damage." }
  ];
  public set: string = "DPP";
  public setNumber = "13";
  public cardImage = 'assets/cardback.png';
  public name = "Buizel";
  public fullName = "Buizel DPP";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round29BuizelDPP13.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const own = new CheckProvidedEnergyEffect(effect.player, effect.source);
      const defending = new CheckProvidedEnergyEffect(effect.opponent, effect.opponent.active);
      store.reduceEffect(state, own);
      store.reduceEffect(state, defending);
      const provided = (check: CheckProvidedEnergyEffect) => check.energyMap.reduce((sum, entry) => sum + entry.provides.length, 0);
      if (provided(own) < provided(defending)) effect.damage += 10;
    }
    return state;
  }
}
