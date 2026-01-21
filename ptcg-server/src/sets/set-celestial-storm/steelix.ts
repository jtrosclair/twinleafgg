import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Steelix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Onix';
  public cardType: CardType = CardType.METAL;
  public hp: number = 190;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Tail Crush',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: 80,
      text: 'Flip a coin. If heads, this attack does 40 more damage.'
    }
  ];

  public set: string = 'CES';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steelix';
  public fullName: string = 'Steelix CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tail Crush attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
      ], heads => {
        if (heads) {
          effect.damage += 40;
        }
      });
    }

    return state;
  }
}