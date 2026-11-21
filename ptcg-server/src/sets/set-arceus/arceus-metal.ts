import { PowerType, State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../game/store/prefabs/effect-of-attack-prefabs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ArceusMetal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];
  public tags = [CardTag.ARCEUS];

  public powers = [{
    name: 'Arceus Rule',
    powerType: PowerType.ARCEUS_RULE,
    text: 'You may have as many of this card in your deck as you like.'
  }];

  public attacks = [
    {
      name: 'Metal Barrier',
      cost: [M, C, C],
      damage: 40,
      text: 'Prevent all effects of attacks, including damage, done to Arceus by Pokémon LV.X during your opponent\'s next turn.'
    }
  ];

  public set: string = 'AR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'AR9';
  public name: string = 'Arceus';
  public fullName: string = 'Arceus Metal AR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-mysterious-treasures/finneon.ts (Elegant Swim).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const filter = { sourceStage: Stage.LV_X };
      state = PREVENT_DAMAGE(store, state, effect, this, filter);
      state = PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this, filter);
    }
    return state;
  }
}
