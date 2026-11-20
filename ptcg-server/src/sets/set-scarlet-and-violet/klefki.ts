import { ActiveAbilityLock, applyActiveAbilityLock } from '../../game/store/prefabs/active-ability-lock';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Klefki extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Mischievous Lock',
    powerType: PowerType.ABILITY,
    abilityLock: true,
    text: 'As long as this Pokémon is in the Active Spot, Basic ' +
      'Pokémon in play (both yours and your opponent\'s) have no ' +
      'Abilities, except for Mischievous Lock.'
  }];

  public attacks = [{
    name: 'Joust',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: 'Before doing damage, discard all Pokémon Tools from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '96';

  public name: string = 'Klefki';

  public fullName: string = 'Klefki SVI';

  public activeAbilityLock(): ActiveAbilityLock {
    return {
      power: this.powers[0],
      exemptAbility: 'Mischievous Lock',
      affects: (_store, _state, _owner, { card, slot, enteringBench }) => (!!slot || !!enteringBench) && card.stage === Stage.BASIC
    };
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    applyActiveAbilityLock(store, state, effect, this);
    return Klefki.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Discard active Pokemon's tool first
      const activePokemon = opponent.active;
      if (activePokemon.tools.length > 0) {
        activePokemon.moveCardsTo([...activePokemon.tools], opponent.discard);
      }

      // Then deal damage
      effect.damage = 10;

      return state;

    }

    return state;
  }
}
