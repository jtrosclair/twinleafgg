import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StadiumEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Lunatone extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'New Moon',
    powerType: PowerType.ABILITY,
    text: 'If you have Solrock in play, prevent all effects of any Stadium ' +
      'done to your Pokémon in play.'
  }];

  public attacks = [{
    name: 'Moon Press',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 100,
    text: ''
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '92';

  public name: string = 'Lunatone';

  public fullName: string = 'Lunatone OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-celestial-storm/lunatone.ts (in-play Solrock and Ability lock).
    // Stadiums opt in to the target-specific check while resolving an effect.
    if (!(effect instanceof StadiumEffect)) {
      return state;
    }
    const slot = StateUtils.findPokemonSlot(state, this);
    if (!slot || slot.getPokemonCard() !== this) {
      return state;
    }
    const owner = StateUtils.findOwner(state, slot);
    if (StateUtils.findOwner(state, effect.target) !== owner) {
      return state;
    }
    let hasSolrock = false;
    owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_slot, pokemon) => {
      if (pokemon.name === 'Solrock') hasSolrock = true;
    });
    if (hasSolrock && (effect.skipAbilityLockCheck || !IS_ABILITY_BLOCKED(store, state, owner, this))) {
      effect.preventDefault = true;
    }
    return state;
  }

}
