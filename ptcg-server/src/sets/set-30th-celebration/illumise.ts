import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils } from "../../game";
import { ApplyWeaknessEffect } from "../../game/store/effects/attack-effects";
import { Effect } from "../../game/store/effects/effect";
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED } from "../../game/store/prefabs/prefabs";

export class Illumise extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = CardType.GRASS;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Supereffective Pheromones',
    powerType: PowerType.ABILITY,
    text: 'If you have Volbeat in play, apply Weakness for both Active Pokémon as x3.'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Illumise';
  public fullName: string = 'Illumise 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof ApplyWeaknessEffect && effect.weaknessMultiplier !== 3 && !effect.ignoreWeakness
      && state.players.some(player => player.active === effect.target)) {
      const owner = state.players.find(player => StateUtils.isPokemonInPlay(player, this));
      if (owner && owner.getPokemonInPlay().some(slot => slot.getPokemonCard()?.name === 'Volbeat')
        && !IS_ABILITY_BLOCKED(store, state, owner, this)
        && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, this.powers[0], this, effect.target)) {
        effect.weaknessMultiplier = 3;
      }
    }
    return state;
  }
}
