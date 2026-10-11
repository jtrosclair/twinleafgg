import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES } from '../../game/store/prefabs/prefabs';

export class Unown extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = CardType.PSYCHIC;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Mysterious Signal',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC],
    damage: 40,
    text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, take 1 more Prize card.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Unown';
  public fullName: string = 'Unown 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mysterious Signal
    return IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES(store, state, effect, this, {
      attackName: 'Mysterious Signal',
    });
  }
}
