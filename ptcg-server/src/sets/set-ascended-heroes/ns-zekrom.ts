import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class NsZekrom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.NS];
  public cardType: CardType = N;
  public hp: number = 130;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Shred',
    cost: [C, C, C],
    damage: 70,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  },
  {
    name: 'Rampaging Thunder',
    cost: [R, L, L, C],
    damage: 250,
    text: 'During your next turn, this Pokémon can\'t use attacks.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '155';
  public name: string = 'N\'s Zekrom';
  public fullName: string = 'N\'s Zekrom M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shred
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
      effect.damage = 0;

      const dealDamage = new DealDamageEffect(effect, 70);
      state = store.reduceEffect(state, dealDamage);
    }

    // Rampage Thunder
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}



