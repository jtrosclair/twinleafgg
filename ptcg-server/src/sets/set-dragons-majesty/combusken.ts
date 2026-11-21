import { CardType, CoinFlipPrompt, GameMessage, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Torchic';

  public cardType: CardType = R;

  public hp: number = 80;

  public weakness = [{ type: W }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Lunge',
      cost: [R, C],
      damage: 60,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public powers = [{
    name: 'Heat Boost',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Whenever you attach an Energy card from your hand to this Pokémon, remove all Special Conditions from it.'
  }];

  public set: string = 'DRM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '5';

  public name: string = 'Combusken';

  public fullName: string = 'Combusken DRM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.target.getPokemonCard() === this) {
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        effect.target.clearAllSpecialConditions();
      });
    }

    return state;
  }
}
