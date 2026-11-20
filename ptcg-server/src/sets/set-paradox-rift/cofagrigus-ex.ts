import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, SlotType, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { registerKnockOutDeckSearch } from '../../game/store/prefabs/knock-out-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';

export class Cofagrigusex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Yamask';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 260;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Gold Coffin',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for a card and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Hollow Hands',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 110,
      text: 'Put 5 damage counters on your opponent\'s Benched Pokémon in any way you like.'
    }
  ];

  public set: string = 'PAR';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';

  public name: string = 'Cofagrigus ex';
  public fullName: string = 'Cofagrigus ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-lost-origin/spiritomb.ts (search before Knock Out discard)
    registerKnockOutDeckSearch(store, state, effect, this, 1);

    // Hollow Hands
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(5, store, state, effect, [SlotType.BENCH]);
    }

    return state;
  }
}