import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { DISCARD_ATTACKER_ENERGY_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Klawfex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 220;

  public weakness = [ {type: CardType.GRASS} ];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [
    {
      name: 'Counterattacking Pincer',
      powerType: PowerType.ABILITY,
      text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), discard an Energy from the Attacking Pokémon.'
    }
  ];

  public attacks = [{
    name: 'Falling Press',
    cost: [ CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 100,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 80 more damage.'
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public name: string = 'Klawf ex';

  public fullName: string = 'Klawf ex OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 80);
    }
    return DISCARD_ATTACKER_ENERGY_FROM_ABILITY(store, state, effect, this);
  }
}
