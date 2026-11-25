import { CardTag, CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COPY_OPPONENT_ACTIVE_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Malamar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Inkay';
  public hp: number = 110;
  public cardType: CardType = D;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Skill Control',
    cost: [C],
    damage: 0,
    copycatAttack: true,
    text: 'Choose 1 of your opponent\'s Active Mega Evolution Pokémon ex\'s attacks and use it as this attack.'
  },
  {
    name: 'Slap',
    cost: [C, C, C],
    damage: 80,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Malamar';
  public fullName: string = 'Malamar FLO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Skill Control
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const active = opponent.active.getPokemonCard();

      if (
        !active ||
        !active.tags.includes(CardTag.POKEMON_SV_MEGA) ||
        !active.tags.includes(CardTag.POKEMON_ex) ||
        active.attacks.length === 0
      ) {
        return state;
      }

      return COPY_OPPONENT_ACTIVE_ATTACK(store, state, effect);
    }

    return state;
  }
}
