import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { getAttachedEnergyOfType } from '../../game/store/prefabs/knock-out-effects';
import { IS_ABILITY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Heatran extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp: number = 140;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Burned.',
    useWhenInPlay: false,
    name: 'Incandescent Body'
  }];

  public attacks = [{
    name: 'Steel Burst',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    damageCalculation: 'x',
    text: 'Discard all [M] Energy from this Pokémon. This attack does 50 damage for each card you discarded in this way.'
  }];

  public set: string = 'TWM';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '123';
  public name: string = 'Heatran';
  public fullName: string = 'Heatran TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source = effect.source;
      const metalEnergy = getAttachedEnergyOfType(store, state, effect.player, source, CardType.METAL);
      const discard = new DiscardCardsEffect(effect, metalEnergy);
      discard.target = source;
      store.reduceEffect(state, discard);
      const discarded = metalEnergy.filter(card => !source.cards.includes(card) && !source.energies.cards.includes(card));
      effect.damage = discarded.length ? effect.damage + 50 * discarded.length - effect.attack.damage : 0;
    }

    // Ref: set-temporal-forces/iron-jugulis.ts (retaliation after attack damage).
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })
      && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (!IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
          store, state, owner, this.powers[0], this, effect.source, [SpecialCondition.BURNED]
        );
      }
    }

    return state;
  }
}
