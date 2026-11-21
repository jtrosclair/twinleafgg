import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameMessage,
  PlayerType, PowerType, ChoosePokemonPrompt, SlotType
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED_FROM_HAND } from '../../game/store/prefabs/prefabs';

export class UmbreonVMAX extends PokemonCard {

  public tags = [CardTag.POKEMON_VMAX, CardTag.SINGLE_STRIKE];

  public stage: Stage = Stage.VMAX;

  public regulationMark = 'E';

  public evolvesFrom = 'Umbreon V';

  public cardType: CardType = CardType.DARK;

  public hp: number = 310;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Dark Signal',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of ' +
      'your Pokémon during your turn, you may switch 1 of your ' +
      'opponent\'s Benched Pokémon with their Active Pokémon.'
  }];

  public attacks = [{
    name: 'Max Darkness',
    cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
    damage: 160,
    text: ''
  }
  ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Umbreon VMAX';

  public fullName: string = 'Umbreon VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-cosmic-eclipse/venusaur-and-snivy-gx.ts (opposing Ability protection on the selected slot).
    if (JUST_EVOLVED_FROM_HAND(effect, state, this)) {
      const { player } = effect;
      const opponent = StateUtils.getOpponent(state, player);
      if (!opponent.bench.some(slot => slot.getPokemonCard()) || IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      return CONFIRMATION_PROMPT(store, state, player, accepted => {
        if (!accepted) return;
        store.prompt(state, new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER, [SlotType.BENCH], { allowCancel: false }), ([selected]) => {
          const signal = new EffectOfAbilityEffect(player, this.powers[0], this, selected);
          store.reduceEffect(state, signal);
          if (!signal.preventDefault && signal.target) opponent.switchPokemon(signal.target, store, state);
        });
      });
    }
    return state;
  }
}
