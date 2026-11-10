import { GameError, GameMessage, State, StoreLike, TrainerCard } from '../../game';
import { CardTag, CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { RECOVER_DISCARD_BY_ATTACK } from '../../game/store/prefabs/recover-discard-attack';

export class FloatzelGL extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public tags = [ CardTag.POKEMON_SP ];
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Incite',
      cost: [ ],
      damage: 0,
      text: 'Search your discard pile for up to 2 Supporter cards, show them to your opponent, and put them into your hand.'
    },
    {
      name: 'Giant Wave',
      cost: [W, W],
      damage: 50,
      text: 'Floatzel GL can\'t use Giant Wave during your next turn.'
    }
  ];

  public set: string = 'RR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Floatzel GL';
  public fullName: string = 'Floatzel GL RR';

  public readonly GIANT_WAVE_MARKER = 'GIANT_WAVE_MARKER';
  public readonly CLEAR_GIANT_WAVE_MARKER = 'CLEAR_GIANT_WAVE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Incite
    if (WAS_ATTACK_USED(effect, 0, this)){
      return RECOVER_DISCARD_BY_ATTACK(store, state, effect,
        card => card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER, 2, true);
    }

    // Giant Wave
    if (WAS_ATTACK_USED(effect, 1, this)){
      if (effect.player.marker.hasMarker(this.GIANT_WAVE_MARKER, this)){ throw new GameError(GameMessage.BLOCKED_BY_EFFECT); }

      effect.player.marker.addMarker(this.GIANT_WAVE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_GIANT_WAVE_MARKER, this)) {
      effect.player.marker.removeMarker(this.GIANT_WAVE_MARKER, this);
      effect.player.marker.removeMarker(this.CLEAR_GIANT_WAVE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.GIANT_WAVE_MARKER, this)) {
      effect.player.marker.addMarker(this.CLEAR_GIANT_WAVE_MARKER, this);
    }

    return state;
  }
}
