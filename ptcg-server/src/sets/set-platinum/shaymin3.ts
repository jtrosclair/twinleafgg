import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { targetDamageAfter, optionalSelfSwitchAfter, healTeamAfter, coinRecoilAfter } from './round24-attack-helpers';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Shaymin3 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 80;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Energy Blow", cost: [], damage: 10, damageCalculation: "+", text: "Does 10 damage plus 10 more damage for each Energy attached to Shaymin." },
    { name: "Aromatherapy", cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS], damage: 40, text: "Remove 2 damage counters from each of your Pokémon." }
  ];
  public set = 'PL';
  public setNumber = "38";
  public cardImage = 'assets/cardback.png';
  public name = "Shaymin";
  public fullName = "Shaymin PL3";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Shaymin3.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) { const check=new CheckProvidedEnergyEffect(effect.player,effect.source);store.reduceEffect(state,check);effect.damage+=10*check.energyMap.reduce((n,e)=>n+e.provides.length,0); }
    if (WAS_ATTACK_USED(effect, 1, this)) healTeamAfter(state,effect,20,false);
    return state;
  }
}
