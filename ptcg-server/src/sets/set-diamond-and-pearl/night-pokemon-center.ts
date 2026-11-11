import { ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class NightPokemonCenterDP extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '108';
  public name: string = 'Night Pokémon Center';
  public fullName: string = 'Night Pokémon Center DP';
  public text: string = 'Choose 1 of your Pokémon. Flip 2 coins. If both are heads, remove all damage counters from that Pokémon. If both are tails, discard all Energy cards attached to that Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;
    const player = effect.player;
    MOVE_CARDS(store, state, player.hand, player.discard, { cards: [effect.trainerCard], sourceCard: this });
    effect.preventDefault = true;
    return store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_HEAL,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { min: 1, max: 1, allowCancel: false }
    ), selected => {
      const target = selected[0];
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(Boolean).length;
        if (heads === 2) {
          store.reduceEffect(state, new HealEffect(player, target, target.damage));
        } else if (heads === 0) {
          const energies = target.cards.filter(card => card instanceof EnergyCard);
          if (energies.length) MOVE_CARDS(store, state, target, player.discard, { cards: energies, sourceCard: this });
        }
      });
    });
  }
}
