import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Passimian extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 110;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Coordinated Throwing',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each of your Basic Pokémon in play.'
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '111';

  public regulationMark = 'H';

  public name: string = 'Passimian';

  public fullName: string = 'Passimian SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let basicCount = 0;

      // Count active if Basic
      if (player.active.getPokemonCard()?.stage === Stage.BASIC) {
        basicCount++;
      }

      // Count benched Basic Pokemon
      player.bench.forEach(b => {
        if (b.cards.length > 0 && b.getPokemonCard()?.stage === Stage.BASIC) {
          basicCount++;
        }
      });

      effect.damage = basicCount * 20;
    }

    return state;
  }
}
