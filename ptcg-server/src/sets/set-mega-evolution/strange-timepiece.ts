import { CardTarget, ChoosePokemonPrompt, GameError, GameMessage, GameStoreMessage, PlayerType, SelectPrompt, SlotType, TrainerCard } from '../../game';
import { CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { DEVOLVE_POKEMON } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class StrangeTimepiece extends TrainerCard {
  public name = 'Strange Timepiece';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '128';
  public set = 'MEG';
  public regulationMark = 'I';
  public fullName = 'Strange Timepiece MEG';
  public superType = SuperType.TRAINER;
  public trainerType = TrainerType.ITEM;

  public text = 'Devolve 1 of your evolved [P] Pokémon by putting any number of Evolution cards on it into your hand. (That Pokémon can\'t evolve this turn.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      let canDevolve = false;

      const blocked: CardTarget[] = [];
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const checkTypeEffect = new CheckPokemonTypeEffect(list);
        store.reduceEffect(state, checkTypeEffect);
        if (list.isEvolved() && checkTypeEffect.cardTypes.includes(CardType.PSYCHIC)) {
          canDevolve = true;
        } else {
          blocked.push(target);
        }
      });

      if (!canDevolve) {
        throw new GameError(GameStoreMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Choose Pokemon to Devolve
      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, min: 1, max: 1, blocked }
        ),
        (results) => {
            if (results && results.length > 0 && results[0].getPokemons().length > 0) {
            // Choose how many evolutions to pick up
            const pokemons = results[0].getPokemons();
            const maxCount = pokemons.length - 1;
            const options = [...Array(maxCount).keys()].map(i => String(i + 1));

            store.prompt(state, new SelectPrompt(
              effect.player.id,
              GameMessage.CHOOSE_OPTION,
              options,
              { allowCancel: false }
            ), choice => {
              const devolvesNeeded = choice + 1;
              for (let i = 0; i < devolvesNeeded; i++) {
                DEVOLVE_POKEMON(store, state, results[0], effect.player.hand);
              }
              // Keep this Pokémon from evolving again this turn.
              results[0].pokemonPlayedTurn = state.turn;
              return state;
            });
          }
          return state;
        }
      );
    }

    return state;
  }
}
