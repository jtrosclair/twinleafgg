import { State, StoreLike, TrainerCard } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dedenne extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Electromagnetic Sonar',
    cost: [C],
    damage: 0,
    text: 'Put a Trainer card from your discard pile into your hand.'
  },
  {
    name: 'Gnaw',
    cost: [P],
    damage: 30,
    text: ''
  }];

  public set: string = 'SSP';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Dedenne';
  public fullName: string = 'Dedenne SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-paldea-evolved/pelipper.ts (one required recovery from a public discard pile).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamage(state, effect, (store, afterState) => {
        const player = effect.player;
        if (player.discard.cards.some(card => card instanceof TrainerCard)) {
          SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, afterState, player, effect.source.getPokemonCard() ?? this,
            { superType: SuperType.TRAINER }, { min: 1, max: 1, allowCancel: false }, effect);
        }
        return afterState;
      });
    }

    return state;
  }
}
