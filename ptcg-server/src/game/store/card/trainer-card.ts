import { Attack, Power, State, StoreLike } from '../../..';
import { Effect } from '../effects/effect';
import { AttackEffect, PowerEffect } from '../effects/game-effects';
import { ToolEffect, TrainerEffect } from '../effects/play-card-effects';
import { Card } from './card';
import { Format, SuperType, TrainerType } from './card-types';


export abstract class TrainerCard extends Card {

  public superType: SuperType = SuperType.TRAINER;

  public trainerType: TrainerType = TrainerType.ITEM;

  public format: Format = Format.NONE;

  public text: string = '';

  public attacks: Attack[] = [];

  public powers: Power[] = [];

  /** A Team Flare Hyper Gear Tool is played onto the opposing side of the board. */
  public attachesToOpponentsPokemon?: boolean;

  public firstTurn: boolean = false;

  public stadiumDirection: 'up' | 'down' = 'up';

  public get canRecoverFromDiscard(): boolean {
    return true;
  }

  public toolEffect: ToolEffect | undefined;

  //Used on items and supporters that are "put into play", specifically for reference on Chaos Gym
  public putIntoPlay: boolean = false;

  /** Cards with a required payment can finish it before committing the Supporter play. */
  public paySupporterCost?(
    store: StoreLike, state: State, effect: TrainerEffect, onPaid: (state: State) => State,
  ): State;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect) {
      for (let i = 0; i < this.attacks.length; i++) {
        const attackEffect = this.attacks[i].effect;
        if (effect.attack === this.attacks[i] && attackEffect !== undefined && typeof attackEffect === 'function') {
          attackEffect(store, state, effect);
        }
      }
    }
    else if (effect instanceof PowerEffect) {
      for (let i = 0; i < this.powers.length; i++) {
        if (effect.power === this.powers[i] && effect.power.effect !== undefined) {
          return effect.power.effect(store, state, effect);
        }
      }
    }
    return state;
  }
}
