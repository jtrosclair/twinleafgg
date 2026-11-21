import { CardsToHandEffect } from '../../game/store/effects/attack-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import {
  CardTag,
  CardType,
  Stage,
  SuperType
} from '../../game/store/card/card-types';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, State, StoreLike } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
export class Accelgor extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shelmet';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [
    {
      name: 'Retribution',
      cost: [C],
      damage: 20,
      text: 'If an Escavalier you had in play was Knocked Out by damage from an opponent\'s attack during his or her last turn, put all Energy attached to the Defending Pok\u00e9mon into your opponent\'s hand.'
    },
    {
      name: 'Signal Beam',
      cost: [G, C],
      damage: 30,
      text: 'The Defending Pok\u00e9mon is now Confused.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Accelgor';
  public fullName: string = 'Accelgor PLB';

  public readonly ESCAVALIER_KO_MARKER = 'ESCAVALIER_KO_MARKER';
  public readonly ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER = 'ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: Stunfisk's Revenge uses the attack-damage Knock Out record.
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect)
      && effect.target.getPokemonCard()?.name === 'Escavalier') {
      effect.player.marker.addMarker(this.ESCAVALIER_KO_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)
      && effect.player.marker.hasMarker(this.ESCAVALIER_KO_MARKER, this)) {
      afterAttackDamageForOriginalDefender(state, effect, (store, state, target) => {
        const cards = new Set([
          ...target.cards.filter(card => card.superType === SuperType.ENERGY),
          ...target.energies.cards
        ]);
        const toHand = new CardsToHandEffect(effect, [...cards]);
        toHand.target = target;
        return store.reduceEffect(state, toHand);
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
    }

    // Marker cleanup
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.ESCAVALIER_KO_MARKER, this);
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER, this);
        });
      });
    }

    return state;
  }
}
