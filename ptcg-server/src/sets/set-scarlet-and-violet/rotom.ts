import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { State, StoreLike, TrainerCard, TrainerType } from '../../game';
export class Rotom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Junk Hunt',
    cost: [C],
    damage: 0,
    text: 'Put an Item card from your discard pile into your hand.'
  },
  {
    name: 'Thunder Shock',
    cost: [L],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public set: string = 'SVI';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Rotom';
  public fullName: string = 'Rotom SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-paldea-evolved/pelipper.ts (one required recovery from a public discard pile).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamage(state, effect, (store, afterState) => {
        const player = effect.player;
        if (player.discard.cards.some(card => card instanceof TrainerCard && card.trainerType === TrainerType.ITEM)) {
          const filter: Partial<TrainerCard> = { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM };
          SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, afterState, player, effect.source.getPokemonCard() ?? this,
            filter, { min: 1, max: 1, allowCancel: false }, effect);
        }
        return afterState;
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
        }
      });
    }

    return state;
  }
}
