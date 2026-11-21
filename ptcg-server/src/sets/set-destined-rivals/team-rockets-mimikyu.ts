import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { COPY_OPPONENT_ACTIVE_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsMimikyu extends PokemonCard {
  public regulationMark = 'I';
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Gemstone Hunt',
    cost: [P, C],
    damage: 0,
    copycatAttack: true,
    text: 'Choose an attack on your opponent\'s Active Tera Pokemon and use it as the effect of this attack.'
  }];

  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Team Rocket\'s Mimikyu';
  public fullName: string = 'Team Rocket\'s Mimikyu DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)
      && effect.opponent.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_TERA)) {
      return COPY_OPPONENT_ACTIVE_ATTACK(store, state, effect);
    }
    return state;
  }
}
