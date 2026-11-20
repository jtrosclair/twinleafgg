import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { BLOCK_RETREAT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class HopsTrevenant extends PokemonCard {
  public tags = [CardTag.HOPS];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hop\'s Phantump';
  public hp: number = 140;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Horrifying Revenge',
    cost: [C],
    damage: 30,
    damageCalculation: '+',
    text: 'If any of your Hop\'s Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 100 more damage.'
  }, {
    name: 'Corner',
    cost: [P, C, C],
    damage: 90,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Hop\'s Trevenant';
  public fullName: string = 'Hop\'s Trevenant ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: game-effect.ts records the Pokémon tag and attack-damage provenance at Knock Out.
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(MarkerConstants.HOPS_KNOCKED_OUT_BY_ATTACK_LAST_TURN)) {
        effect.damage += 100;
      }
      return state;
    }

    // Corner
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
