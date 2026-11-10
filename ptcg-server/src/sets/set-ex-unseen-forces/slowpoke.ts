import { PokemonCard, Stage, CardType, GameMessage, CoinFlipPrompt } from '../../game';
import { EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { RECOVER_DISCARD_BY_ATTACK } from '../../game/store/prefabs/recover-discard-attack';

export class Slowpoke extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Fishing Tail',
      cost: [C],
      damage: 0,
      text: 'Search your discard pile for a Basic Pokémon, Evolution card, or basic Energy card, show it to your opponent, and put it into your hand.'
    },
    {
      name: 'Trip Over',
      cost: [C,C],
      damage: 20,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
    }
  ];

  public set: string = 'UF';
  public name: string = 'Slowpoke';
  public fullName: string = 'Slowpoke UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fishing Tail
    if (WAS_ATTACK_USED(effect, 0, this)){
      return RECOVER_DISCARD_BY_ATTACK(store, state, effect, card =>
        (card instanceof EnergyCard && card.energyType === EnergyType.BASIC) ||
        (card instanceof PokemonCard && [Stage.BASIC, Stage.STAGE_1, Stage.STAGE_2, Stage.VMAX,
          Stage.VSTAR, Stage.MEGA, Stage.BREAK].includes(card.stage)), 1, false);
    }
      
    // Trip Over
    if (WAS_ATTACK_USED(effect, 1, this)){
      const player = effect.player;

      // Flip a coin
      state = store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.FLIP_COIN
      ), result => {
        if (result) {
          effect.damage += 10; // 20 base + 10 for heads
        }
        return state;
      });
    }
    return state;
  }
}
