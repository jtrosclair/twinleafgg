import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';

export class Espathraex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Flittle';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 260;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public powers =
    [{
      name: 'Dazzling Gaze',
      powerType: PowerType.ABILITY,
      text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon cost [C] more.'
    }];

  public attacks = [
    {
      name: 'Psy Ball',
      cost: [CardType.PSYCHIC],
      damage: 30,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each Energy attached to both Active Pokémon.'
    }
  ];

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';

  public set = 'PAF';

  public name: string = 'Espathra ex';

  public fullName: string = 'Espathra ex PAF';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-black-bolt-white-flare/samurott.ts (probe the opposing Pokémon as the Ability target).
    if (effect instanceof CheckAttackCostEffect && effect.player.active.getPokemonCard()) {
      const owner = StateUtils.getOpponent(state, effect.player);
      if (owner.active.getPokemonCard() === this && !IS_ABILITY_BLOCKED(store, state, owner, this)
        && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, this.powers[0], this, effect.player.active)) {
        effect.cost.push(CardType.COLORLESS);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += (playerEnergyCount + opponentEnergyCount) * 30;
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}