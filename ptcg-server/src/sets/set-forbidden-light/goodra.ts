import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterHealEffect, HealEffect } from '../../game/store/effects/game-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttachEnergyFromHandEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { attachedEnergyProvides, queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';

export class Goodra extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = N;
  public hp: number = 160;
  public weakness = [{ type: Y }];
  public retreat = [C, C, C];
  public evolvesFrom = 'Sliggoo';

  public powers = [{
    name: 'Hydration',
    powerType: PowerType.ABILITY,
    text: 'Whenever you attach a [W] Energy card from your hand to this Pokémon, heal 20 damage from it.'
  }];

  public attacks = [{
    name: 'Soaking Horn',
    cost: [W, Y, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If this Pokémon was healed during this turn, this attack does 80 more damage.'
  }];

  public set: string = 'FLI';
  public name: string = 'Goodra';
  public fullName: string = 'Goodra FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';

  public readonly HYDRATION_MARKER = 'HYDRATION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Hydration
    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.recipientAtAttachment === this
      && attachedEnergyProvides(store, state, effect, CardType.WATER, CardType.GRW, CardType.WLFM)) {
      const { player, target, energyCard } = effect;
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        store.reduceEffect(state, new HealEffect(player, target, 20));
      }, () => target.getPokemonCard() === this && target.cards.includes(energyCard));
    }

    // Healed this turn tracker
    if (effect instanceof AfterHealEffect && effect.target.getPokemonCard() === this) {
      ADD_MARKER(this.HYDRATION_MARKER, StateUtils.findOwner(state, effect.target), this);
    }
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && HAS_MARKER(this.HYDRATION_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.HYDRATION_MARKER, effect.player, this);
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HYDRATION_MARKER, this);

    // Soaking Horn
    if (WAS_ATTACK_USED(effect, 0, this) && HAS_MARKER(this.HYDRATION_MARKER, effect.player, this)) {
      effect.damage += 80;
    }

    return state;
  }
}
