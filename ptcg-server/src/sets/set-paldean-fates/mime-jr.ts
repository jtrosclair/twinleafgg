import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../game/store/prefabs/copy-attack-prefabs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MimeJr extends PokemonCard {
  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 30;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public attacks = [{
    name: 'Mimed Games',
    cost: [],
    damage: 0,
    text: 'Your opponent chooses 1 of their Pokémon\'s attacks. Use that attack as this attack.'
  }];

  public set: string = 'PAF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

  public name: string = 'Mime Jr.';

  public fullName: string = 'Mime Jr. PAF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const candidates = effect.opponent.getPokemonInPlay().flatMap(slot => slot.getPokemonCard() ?? []);
      return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect, candidates, {
        allowCancel: false, promptPlayerId: effect.opponent.id, preserveInPlaySource: true,
      });
    }

    return state;
  }

}
