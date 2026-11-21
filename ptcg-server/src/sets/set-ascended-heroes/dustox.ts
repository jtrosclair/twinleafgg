import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PowerType } from '../../game/store/card/pokemon-types';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { ABILITY_USED, COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED, MOVE_CARDS, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Dustox extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Cascoon';
  public cardType: CardType = G;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public powers = [{
    name: 'Boisterous Wind',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may use this Ability. Flip a coin. If heads, put an Energy attached to your opponent\'s Active Pokémon into their hand.'
  }];

  public attacks = [{
    name: 'Twilight Poison',
    cost: [G, G],
    damage: 100,
    text: 'Your opponent\'s Active Pokémon is now Asleep and Poisoned.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Dustox';
  public fullName: string = 'Dustox M2a';

  public readonly RUSTLING_WIND_MARKER = 'RUSTLING_WIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reset marker when Pokemon is played
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.RUSTLING_WIND_MARKER, this);
    }

    // Reset marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.RUSTLING_WIND_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.RUSTLING_WIND_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const target = opponent.active;
      const power = this.powers[0];
      if (IS_ABILITY_BLOCKED(store, state, player, this)
        || !target.cards.some(card => card.superType === SuperType.ENERGY)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.RUSTLING_WIND_MARKER, this);
      ABILITY_USED(player, this);
      return COIN_FLIP_PROMPT(store, state, player, heads => {
        if (!heads || !CAN_APPLY_ABILITY_TO_TARGET(store, state, player, power, this, target)) return;

        store.prompt(state, new ChooseCardsPrompt(
          player, GameMessage.CHOOSE_CARD_TO_DISCARD, target,
          { superType: SuperType.ENERGY },
          { min: 1, max: 1, allowCancel: false },
        ), cards => MOVE_CARDS(store, state, target, opponent.hand, { cards, sourceCard: this, sourceEffect: power }));
      });
    }

    // Twilight Poison attack - apply Asleep and Poisoned
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Apply both Asleep and Poisoned conditions
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [
        SpecialCondition.ASLEEP,
        SpecialCondition.POISONED
      ]);
      specialConditionEffect.target = opponent.active;
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}
