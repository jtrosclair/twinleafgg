import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class Crawdaunt extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Corphish';
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Vice Grip',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Vengeful Scissors',
    cost: [D, D, C],
    damage: 130,
    text: 'If this Pokémon has any damage counters on it, this attack can be used for [D].'
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Crawdaunt';
  public fullName: string = 'Crawdaunt M1L';
  public regulationMark: string = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: the Advanced Player’s Rulebook, E-32 (a specified attack cost overrides modifiers).
    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[1]
      && effect.player.active.getPokemonCard() === this && effect.player.active.damage > 0) {
      effect.fixedCost = [CardType.DARK];
    }

    return state;
  }
}

