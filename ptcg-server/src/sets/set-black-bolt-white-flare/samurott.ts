import { BoardEffect, CardType, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { hasUsedPokemonAbility, recordPokemonAbilityUse } from '../../game/store/prefabs/in-play-ability-use';
import { SWITCH_OUT_OPPONENT_ACTIVE_POKEMON, IS_ABILITY_BLOCKED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Samurott extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dewott';
  public cardType: CardType = W;
  public hp: number = 160;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [{
    name: 'Strong Currents',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokemon. If you do, your opponent switches their Active Pokemon with 1 of their Benched Pokemon.'
  }];

  public attacks = [{
    name: 'Energy Slash',
    cost: [W],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each Energy attached to this Pokemon.'
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Samurott';
  public fullName: string = 'Samurott SV11W';

  public readonly STRONG_CURRENTS_MARKER = 'STRONG_CURRENTS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect || (effect instanceof PlayPokemonEffect && effect.pokemonCard === this)) {
      effect.player.marker.removeMarker(this.STRONG_CURRENTS_MARKER, this);
    }

    // Ref: set-paldea-evolved/pelipper.ts (resolve the first action before the dependent effect).
    if (WAS_POWER_USED(effect, 0, this)) {
      const { player, power } = effect;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      const holder = player.getPokemonInPlay().find(slot => slot.getPokemonCard() === this);
      if (!holder || !player.bench.some(slot => !!slot.getPokemonCard())) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (hasUsedPokemonAbility(player, this.STRONG_CURRENTS_MARKER, this, power.name)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH], { allowCancel: false },
      ), ([target]) => {
        if (!target || !player.bench.includes(target) || !target.getPokemonCard()) return;
        recordPokemonAbilityUse(player, this.STRONG_CURRENTS_MARKER, this, power.name);
        player.switchPokemon(target, store, state);
        holder.addBoardEffect(BoardEffect.ABILITY_USED);
        const followUp = () => {
          const opponent = StateUtils.getOpponent(state, player);
          if (opponent.bench.some(slot => !!slot.getPokemonCard())
            && CAN_APPLY_ABILITY_TO_TARGET(store, state, player, power, this, opponent.active)) {
            SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player);
          }
        };
        if (store.hasPrompts()) store.waitPrompt(state, followUp);
        else followUp();
      });
    }

    // Ref: set-stellar-crown/lapras-ex.ts (count effective Energy units on the attacker).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const provided = new CheckProvidedEnergyEffect(effect.player, effect.source);
      state = store.reduceEffect(state, provided);
      effect.damage += 50 * provided.energyMap.reduce((total, energy) => total + energy.provides.length, 0);
    }
    return state;
  }
}
