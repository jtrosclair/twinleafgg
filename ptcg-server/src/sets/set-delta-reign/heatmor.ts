import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Heatmor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Destructive Flame',
    cost: [R],
    damage: 30,
    text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'DLR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Heatmor';
  public fullName: string = 'Heatmor M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Destructive Flame
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamageForOriginalDefender(state, effect, (store, next, target) => {
        const defender = target.getPokemonCard();
        return COIN_FLIP_PROMPT(store, next, effect.player, heads => {
          if (heads && target === effect.opponent.active && target.getPokemonCard() === defender) {
            DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, next, effect);
          }
        });
      });
    }

    return state;
  }
}
