import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';

export class Hitmonchan extends PokemonCard {
  private readonly COUNTER_PUNCH_MARKER = 'HITMONCHAN_COUNTER_PUNCH_NEXT_TURN';
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = F;
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Counter Punch',
    cost: [F],
    damage: 0,
    text: 'During your opponent\'s next turn, if Hitmonchan is damaged by an opponent\'s attack (even if Hitmonchan is Knocked Out), put 4 damage counters on the Attacking Pokémon.'
  },
  {
    name: 'Gut Strike',
    cost: [F, C],
    damage: 30,
    text: 'If Tyrogue is anywhere under Hitmonchan, this attack\'s base damage is 60 instead of 30.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Hitmonchan';
  public fullName: string = 'Hitmonchan LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Counter Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_MARKER(this.COUNTER_PUNCH_MARKER, this, this);
    }

    const cardList = StateUtils.findCardList(state, this);
    if (effect instanceof PutDamageEffect && cardList === effect.target
      && HAS_MARKER(this.COUNTER_PUNCH_MARKER, this, this)) {
      REMOVE_MARKER(this.COUNTER_PUNCH_MARKER, this, this);
      const attackerName = effect.source.getPokemonCard()?.name;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (target, card) => {
        if (target === effect.source || (attackerName && card.name === attackerName)) {
          store.reduceEffect(state, new PlaceDamageCountersEffect(effect.player, target, 40, this));
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      const owner = StateUtils.findOwner(state, cardList);
      if (owner && effect.player !== owner) {
        REMOVE_MARKER(this.COUNTER_PUNCH_MARKER, this, this);
      }
    }

    // Gut Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.active.cards.some(c => c.name === 'Tyrogue')) {
        effect.damage = 60;
      }
    }

    return state;
  }
}
