import { CardType, GameError, GameMessage, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../game/store/prefabs/effect-of-attack-prefabs';

const CHAOS_CRAWLER_TURN = 'DLR_CHAOS_CRAWLER_TURN_';

export class Giratina extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];
  public attacks = [{
    name: 'Chaos Crawler', cost: [P, P, C], damage: 120,
    text: 'During your opponent\'s next turn, prevent all damage from attacks done to this Pokémon. If 1 of your Pokémon used Chaos Crawler during your last turn, this attack can\'t be used.'
  }];
  public regulationMark: string = 'J';
  public set: string = 'DLR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Giratina';
  public fullName: string = 'Giratina M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.marker.hasMarker(CHAOS_CRAWLER_TURN + (state.turn - 2))) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      return PREVENT_DAMAGE(store, state, effect, this);
    }
    if (effect instanceof AfterAttackEffect && effect.attack === this.attacks[0]) {
      const marker = effect.player.marker;
      marker.markers = marker.markers.filter(item => !item.name.startsWith(CHAOS_CRAWLER_TURN));
      marker.addMarker(CHAOS_CRAWLER_TURN + state.turn, this, undefined, 'player');
    }
    return state;
  }
}
