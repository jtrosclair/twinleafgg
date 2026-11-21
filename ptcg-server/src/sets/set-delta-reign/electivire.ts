import { SpecialCondition } from '../../game/store/card/card-types';
import { FLIP_COIN_TO_APPLY_ATTACK_CONDITION } from '../../game/store/prefabs/attack-effects';
import { CardType, EnergyType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Electivire extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Electabuzz';
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Body Slam',
    cost: [C, C],
    damage: 30,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }, {
    name: 'Voltaic Hammer',
    cost: [L, L, C, C],
    damage: 60,
    damageCalculation: 'x',
    text: 'Discard any amount of Basic Energy from this Pokémon, and this attack does 60 damage for each card you discarded in this way.'
  }];

  public regulationMark: string = 'J';

  public set: string = 'DLR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Electivire';
  public fullName: string = 'Electivire M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Body Slam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_COIN_TO_APPLY_ATTACK_CONDITION(state, effect, SpecialCondition.PARALYZED);
    }

    // Voltaic Hammer
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage = 0;

      return DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON(
        store,
        state,
        effect,
        Number.MAX_SAFE_INTEGER,
        { energyType: EnergyType.BASIC },
        0,
        transfers => {
          const { discard, lostzone } = effect.player;
          effect.damage = 60 * transfers.filter(({ card }) =>
            discard.cards.includes(card) || lostzone.cards.includes(card)).length;
        },
      );
    }

    return state;
  }
}