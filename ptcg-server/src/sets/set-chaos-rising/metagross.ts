import { CardType, PokemonCard, Stage, State, StoreLike, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_AVAILABLE_ENERGY_FROM_ATTACKER } from '../../game/store/prefabs/costs';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import { CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Metagross extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Metang';
  public hp: number = 180;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Bounce Back',
    cost: [M],
    damage: 60,
    text: 'Switch out your opponent’s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  },
  {
    name: 'Metallic Hammer',
    cost: [M, M, M, C],
    damage: 150,
    damageCalculation: '+' as '+',
    text: 'You may discard 3 [M] Energy from this Pokémon and have this attack do 150 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public usSetNumber = 'CRI 61';
  public name: string = 'Metagross';
  public fullName: string = 'Metagross M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return this.reduceCopiedAttackEffect(store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: Magnezone PLS (the opponent chooses an unprotected defender’s replacement).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      opponentSwitchAfterAttack(state, effect, effect.source.getPokemonCard() || this);
    }
    // Ref: official Metallic Hammer ruling (the bonus applies with any available Metal Energy).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return CONFIRMATION_PROMPT(store, state, effect.player, confirm => {
        if (confirm) {
          effect.damage += 150;
          DISCARD_AVAILABLE_ENERGY_FROM_ATTACKER(store, state, effect, CardType.METAL, 3);
        }
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }
    return state;
  }
}
