import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { GameError, GameMessage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Electrike extends PokemonCard {
  public readonly ENERGY_JAM_MARKER = 'ELECTRIKE_MT_ENERGY_JAM';
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = L;
  public weakness = [{ type: F, value: +10 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Electromagnetic Jam',
    cost: [L],
    damage: 10,
    text: 'Flip a coin. If heads, your opponent can\'t attach any Energy cards from his or her hand to the Active Pokémon during his or her next turn.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Electrike';
  public fullName: string = 'Electrike MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ENERGY_JAM_MARKER, this);

    if (effect instanceof AttachEnergyEffect && effect.sourceZone === undefined
      && effect.target === effect.player.active
      && HAS_MARKER(this.ENERGY_JAM_MARKER, effect.player, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    // Electromagnetic Jam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_MARKER(this.ENERGY_JAM_MARKER, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    return state;
  }
}
