import { ActiveAbilityLock, applyActiveAbilityLock } from '../../game/store/prefabs/active-ability-lock';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard, pokemonHasCardType } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wobbuffet extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Bide Barricade',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is your Active Pokemon, each Pokemon in ' +
      'play, in each player\'s hand, and in each player\'s discard pile has ' +
      'no Abilities (except for [P] Pokémon).'
  }];

  public attacks = [{
    name: 'Psychic Assault',
    cost: [P, C],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each damage counter on ' +
      'your opponent\'s Active Pokemon.'
  }];

  public set: string = 'PHF';
  public name: string = 'Wobbuffet';
  public fullName: string = 'Wobbuffet PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';

  public activeAbilityLock(): ActiveAbilityLock {
    return {
      power: this.powers[0],
      checkTargetProtection: true,
      affects: (store, state, _owner, { card, slot, inHandOrDiscard }) => {
        if (!slot) {
          return !!inHandOrDiscard && !pokemonHasCardType(card, CardType.PSYCHIC);
        }
        const types = new CheckPokemonTypeEffect(slot);
        store.reduceEffect(state, types);
        return !types.cardTypes.includes(CardType.PSYCHIC);
      }
    };
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage += effect.opponent.active.damage;
      return state;
    }

    applyActiveAbilityLock(store, state, effect, this);
    return state;
  }
}
