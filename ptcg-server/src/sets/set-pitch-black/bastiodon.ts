import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GamePhase, PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Bastiodon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Shieldon';
  public cardType: CardType = M;
  public hp: number = 160;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Ancient Bulwark',
    powerType: PowerType.ABILITY,
    text: 'While this Pokémon is on your Bench, prevent all damage done to your Pokémon by attacks from your opponent\'s Pokémon that have 2 or fewer Energy attached.',
  }];

  public attacks = [{
    name: 'Hammer In',
    cost: [M, M, C],
    damage: 160,
    text: '',
  }];

  public set: string = 'PBL';
  public setNumber: string = '62';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bastiodon';
  public fullName: string = 'Bastiodon M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof PutDamageEffect) || effect.ignoresDefendingDamageEffects
      || state.phase !== GamePhase.ATTACK || !(this instanceof Bastiodon)) return state;

    const owner = StateUtils.findOwner(state, effect.target);
    if (owner === effect.player || !owner.bench.some(slot => slot.getPokemonCard() === this)
      || !effect.source.getPokemonCard() || IS_ABILITY_BLOCKED(store, state, owner, this)) return state;

    const checkEnergy = new CheckProvidedEnergyEffect(effect.player, effect.source);
    store.reduceEffect(state, checkEnergy);
    const energy = checkEnergy.energyMap.reduce((sum, entry) => sum + StateUtils.getProvidesUnitCount(entry.provides), 0);
    if (energy <= 2) effect.preventDefault = true;
    return state;
  }
}
