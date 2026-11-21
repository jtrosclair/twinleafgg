import { afterAttackDamage } from '../../../game/store/prefabs/attack-after-damage';
import { CardType, EnergyType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Drampa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType = N;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Powerful Breath',
    cost: [F],
    damage: 30,
    text: 'Search your deck for a Basic Energy card and attach it to 1 of your [N] Pokémon. Then, shuffle your deck.'
  },
  {
    name: 'Reserve Strength',
    cost: [W, F, C],
    damage: 150,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Drampa';
  public fullName: string = 'Drampa FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Powerful Breath
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamage(state, effect, (store, next) => {
        const { player } = effect;
        const dragonTargets = player.getPokemonInPlay().filter(slot => {
          const checkType = new CheckPokemonTypeEffect(slot);
          store.reduceEffect(next, checkType);
          return checkType.cardTypes.includes(CardType.DRAGON);
        });
        if (dragonTargets.length === 0) return SHUFFLE_DECK(store, next, player);
        return ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON(store, next, player, 1, 1, {
          targetFilter: slot => dragonTargets.includes(slot),
          energyFilter: { energyType: EnergyType.BASIC },
          sourceCard: effect.source.getPokemonCard() ?? this,
        });
      });
    }

    // Reserve Strength
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.source.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
