import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GamePhase, ChoosePokemonPrompt, PlayerType, SlotType, PowerType, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MovedToActiveEffect, PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { hasUsedPokemonAbility, recordPokemonAbilityUse } from '../../game/store/prefabs/in-play-ability-use';
import { ABILITY_USED, CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronValiantex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];
  public cardType: CardType = P;
  public hp: number = 220;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Tachyon Bits',
    powerType: PowerType.ABILITY,
    exemptFromInitialize: true,
    text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Laser Blade',
    cost: [P, P, C],
    damage: 200,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Iron Valiant ex';
  public fullName: string = 'Iron Valiant ex PAR';

  /** Retained in expanded simulator board responses for existing clients. */
  public tachyonBits: number = 0;
  public readonly TACHYON_BITS_MARKER = 'TACHYON_BITS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.TACHYON_BITS_MARKER, this);
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.TACHYON_BITS_MARKER, this);

    // Refs: set-chaos-rising/cobalion-ex.ts (completed switch), set-twilight-masquerade/munkidori.ts (Ability counters).
    if (effect instanceof MovedToActiveEffect && effect.pokemonCard === this
      && state.players[state.activePlayer] === effect.player && state.phase !== GamePhase.BETWEEN_TURNS) {
      const { player } = effect;
      const power = this.powers[0];
      if (hasUsedPokemonAbility(player, this.TACHYON_BITS_MARKER, this, power.name)
        || IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      return CONFIRMATION_PROMPT(store, state, player, accepted => {
        if (!accepted) return;
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id, GameMessage.CHOOSE_POKEMON_TO_DAMAGE, PlayerType.TOP_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE], { allowCancel: true },
        ), targets => {
          const target = targets?.[0];
          const opponent = StateUtils.getOpponent(state, player);
          if (!target?.getPokemonCard() || (target !== opponent.active && !opponent.bench.includes(target))) return;

          recordPokemonAbilityUse(player, this.TACHYON_BITS_MARKER, this, power.name);
          ABILITY_USED(player, this);
          return store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, 20, this, power));
        });
      });
    }

    // Laser Blade
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
