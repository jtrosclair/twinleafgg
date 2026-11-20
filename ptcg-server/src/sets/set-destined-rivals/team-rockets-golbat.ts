import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, PowerType, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterEvolveEffect, PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsGolbat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Rocket\'s Zubat';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Sneaky Bite',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [D],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '121';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Golbat';
  public fullName: string = 'Team Rocket\'s Golbat DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: upstream db4eebfcf (Sneaky Bite, optional preventable counters).
    if (effect instanceof AfterEvolveEffect && effect.pokemonCard === this && effect.playedFromHand
      && state.players[state.activePlayer] === effect.player) {
      const player = effect.player;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) return state;
      const targetCount = 1;

      return CONFIRMATION_PROMPT(store, state, player, useAbility => {
        if (!useAbility) return;

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: targetCount, max: targetCount, allowCancel: false }
        ), selected => {
          for (const target of new Set(selected ?? [])) {
            store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, 20, this, this.powers[0]));
          }
        });
      });
    }

    // Confuse Ray
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }
    return state;
  }
} 