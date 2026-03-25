import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Gurdurr extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Timburr';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Low Kick',
      cost: [F],
      damage: 30,
      text: ''
    },
    {
      name: 'Hammer Arm',
      cost: [F, C, C],
      damage: 60,
      text: 'Discard the top card of your opponent\'s deck.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gurdurr';
  public fullName: string = 'Gurdurr SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[1] });
    }

    return state;
  }
}
