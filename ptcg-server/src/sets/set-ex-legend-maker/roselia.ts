import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, PlayerType, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, IS_POKEBODY_BLOCKED, SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class Roselia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Reactive Aroma',
    powerType: PowerType.POKEBODY,
    text: 'As long as Roselia has any React Energy cards attached to it, remove 1 damage counter from each of your Pokémon (excluding Pokémon-ex) that has any React Energy cards attached to it between turns. You can\'t use more than 1 Reactive Aroma Poké-Body each turn.'
  }];

  public attacks = [{
    name: 'Flick Poison',
    cost: [C],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch. The new Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'LM';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Roselia';
  public fullName: string = 'Roselia LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Healing Stone Poké-Body
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      let hasReactRose = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this && cardList.cards.some(card => card.name === 'React Energy')) {
          hasReactRose = true;
        }
      });

      if (hasReactRose) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (cardList.cards.some(card => card.name === 'React Energy') && !card.tags.includes(CardTag.POKEMON_ex)) {
            const healEffect = new HealEffect(player, cardList, 10);
            state = store.reduceEffect(state, healEffect);
          }
        });
      }
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, effect.player, {
        sourceEffect: effect,
        onSwitched: () => {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
        },
      });
    }

    return state;
  }
} 