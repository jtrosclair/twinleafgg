import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, IS_ABILITY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Chesnaught extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Quilladin';
  public hp: number = 180;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Needly Armor',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), place 3 damage counters on the Attacking Pokémon for each [G] Energy attached to this Pokémon.'
  }];

  public attacks = [{
    name: 'Impound',
    cost: [G, G, C],
    damage: 160,
    text: 'During your opponent\'s next turn, the Defending Pokemon can\'t retreat.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public usSetNumber = 'CRI 7';
  public name: string = 'Chesnaught';
  public fullName: string = 'Chesnaught M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-pokemon-151/hitmonchan.ts (source-attributed retaliation against the attacker).
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })
      && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (IS_ABILITY_BLOCKED(store, state, owner, this)) return state;

      const provided = new CheckProvidedEnergyEffect(owner, effect.target);
      store.reduceEffect(state, provided);
      const grass = provided.energyMap.reduce((count, energy) => count
        + energy.provides.filter(type => type === CardType.GRASS || type === CardType.ANY).length, 0);
      if (grass > 0 && effect.source.getPokemonCard()) {
        state = store.reduceEffect(state, new PlaceDamageCountersEffect(owner, effect.source, 30 * grass, this, this.powers[0]));
      }
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    return state;
  }
}
