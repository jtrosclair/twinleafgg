import { PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, JUST_EVOLVED_FROM_HAND, CONFIRMATION_PROMPT, GET_PLAYER_BENCH_SLOTS, IS_ABILITY_BLOCKED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Ninjask extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Nincada';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [];

  public powers = [{
    name: 'Cast-Off Shell',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play this Pokémon from your hand to evolve 1 of your Pokémon, you may use this Ability. Search your deck for a Shedinja and put it onto your Bench. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'U-Turn',
    cost: [G, C],
    damage: 90,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Ninjask';
  public fullName: string = 'Ninjask M1S';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED_FROM_HAND(effect, state, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0 || GET_PLAYER_BENCH_SLOTS(player).length === 0
        || IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      return CONFIRMATION_PROMPT(store, state, player, accepted => {
        if (accepted) {
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player,
            { name: 'Shedinja' }, { min: 0, max: 1, allowCancel: false });
        }
      });
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }

    return state;
  }
}