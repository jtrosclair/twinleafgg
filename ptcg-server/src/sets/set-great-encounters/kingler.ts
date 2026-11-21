import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamageWouldKnockOut } from '../../game/store/prefabs/post-damage-identity';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Kingler extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Krabby';
  public hp: number = 90;
  public cardType: CardType = W;
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Crabhammer',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Scissor Blow',
    cost: [W, W, C],
    damage: 80,
    text: 'If the Defending Pokémon would be Knocked Out by this attack, Kingler does 30 damage to itself.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Kingler';
  public fullName: string = 'Kingler GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-secret-wonders/honchkrow-lvx.ts (damage sufficient for a Knock Out).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const attacker = effect.source.getPokemonCard();
      afterAttackDamageWouldKnockOut(state, effect, (store, state) => {
        if (!attacker || effect.source.getPokemonCard() !== attacker
          || !StateUtils.isPokemonInPlay(effect.player, attacker)) return state;
        return THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
      });
    }

    return state;
  }
}
