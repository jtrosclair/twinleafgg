import { ActiveAbilityLock, applyActiveAbilityLock } from '../../game/store/prefabs/active-ability-lock';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { SlotType } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';

export class FlutterMane extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public tags = [CardTag.ANCIENT];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Midnight Fluttering',
    powerType: PowerType.ABILITY,
    abilityLock: true,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Active Pokémon has no Abilities, except for Midnight Fluttering.'
  }];

  public attacks = [{
    name: 'Hex Hurl',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'Put 2 damage counters on your opponent\'s Benched Pokémon in any way you like.'
  }];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '78';

  public name: string = 'Flutter Mane';

  public fullName: string = 'Flutter Mane TEF';

  public activeAbilityLock(): ActiveAbilityLock {
    return {
      power: this.powers[0],
      exemptAbility: 'Midnight Fluttering',
      affects: (_store, _state, owner, { player, slot }) => player !== owner && slot === player.active
    };
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    applyActiveAbilityLock(store, state, effect, this);
    return FlutterMane.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(2, store, state, effect, [SlotType.BENCH]);
    }

    return state;
  }
}
