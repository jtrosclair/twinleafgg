import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { GamePhase, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { ADD_MARKER, ADD_POISON_TO_PLAYER_ACTIVE, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';

export class Sandslash extends PokemonCard {
  public readonly SPIKE_ARMOR_MARKER = 'SANDSLASH_MT_SPIKE_ARMOR';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sandshrew';
  public hp: number = 90;
  public cardType: CardType = F;
  public weakness = [{ type: W, value: 20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Spike Armor',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, if Sandslash is damaged by an opponent\'s attack (even if Sandslash is Knocked Out), put 4 damage counters on the Attacking Pokémon.'
  },
{
    name: 'Poison Spike',
    cost: [F, F, C],
    damage: 60,
    text: 'If the Defending Pokémon already has any damage counters on it, that Pokémon is now Poisoned.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Sandslash';
  public fullName: string = 'Sandslash MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SPIKE_ARMOR_MARKER, this);

    if (effect instanceof AfterDamageEffect && effect.target.getPokemonCard() === this && effect.damage > 0
      && state.phase === GamePhase.ATTACK) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (owner && owner !== effect.player && HAS_MARKER(this.SPIKE_ARMOR_MARKER, owner, this)) {
        const retaliation = new PlaceDamageCountersEffect(owner, effect.source, 40, this);
        store.reduceEffect(state, retaliation);
      }
    }
    // Spike Armor
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_MARKER(this.SPIKE_ARMOR_MARKER, StateUtils.getOpponent(state, effect.player), this);
    }

    // Poison Spike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
