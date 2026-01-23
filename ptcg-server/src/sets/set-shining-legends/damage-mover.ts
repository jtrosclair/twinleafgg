import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError, GameMessage, PlayerType, SlotType } from '../../game';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class DamageMover extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SLG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public name: string = 'Damage Mover';

  public fullName: string = 'Damage Mover SLG';

  public text: string =
    'Move 3 damage counters from 1 of your Pokémon to 1 of your other Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      // Count total Pokémon and those with at least 30 damage
      let totalPokemon = 0;
      let pokemonWithDamage = 0;
      const sourceOptions: { min: number; max: number; allowCancel: boolean; blocked: any[] } = {
        min: 1,
        max: 1,
        allowCancel: false,
        blocked: []
      };

      // Block Pokémon with less than 30 damage
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        totalPokemon++;
        if (cardList.damage >= 30) {
          pokemonWithDamage++;
        } else {
          sourceOptions.blocked.push(target);
        }
      });

      // Need at least 2 Pokémon and at least one with 30+ damage
      if (totalPokemon < 2 || pokemonWithDamage === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      effect.preventDefault = true;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_WITH_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        sourceOptions
      ), sourceResult => {
        if (sourceResult === null || sourceResult.length === 0) {
          player.hand.moveCardTo(effect.trainerCard, player.discard);
          return state;
        }

        const source = sourceResult[0];

        // Build the blocked list - need to block the source from being a target
        const blockedTargets: any[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
          if (cardList === source) {
            blockedTargets.push(target);
          }
        });

        // Prompt to choose target (any other Pokémon)
        const targetOptions: { min: number; max: number; allowCancel: boolean; blocked: any[] } = {
          min: 1,
          max: 1,
          allowCancel: false,
          blocked: blockedTargets
        };

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_MOVE_DAMAGE_TO,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          targetOptions
        ), targetResult => {
          if (targetResult === null || targetResult.length === 0) {
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
          }

          const target = targetResult[0];

          // Move 30 damage from source to target
          source.damage -= 30;
          target.damage += 30;

          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          return state;
        });
      });
    }
    return state;
  }

}
