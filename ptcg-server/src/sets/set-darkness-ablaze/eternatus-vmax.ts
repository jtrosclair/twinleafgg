import { PokemonCard, pokemonHasCardType } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckEvolveEffect, UsePowerEffect } from '../../game/store/effects/game-effects';
import { GameError, GameMessage, Player, PowerType, StateUtils } from '../../game';
import { CheckPokemonPlacementEffect, CheckPokemonTypeEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { PlayPokemonEffect, PlayPokemonFromDeckEffect, PlayPokemonFromDiscardEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class EternatusVMAX extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public evolvesFrom = 'Eternatus V';
  public tags = [CardTag.POKEMON_VMAX];
  public cardType: CardType = D;
  public hp: number = 340;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [
    {
      name: 'Eternal Zone',
      powerType: PowerType.ABILITY,
      text: 'If all of your Pokémon in play are [D] type, you can have up to 8 Pokémon on your Bench, and you can\'t put non-[D] Pokémon into play. (If this Ability stops working, discard Pokémon from your Bench until you have 5.)'
    }];

  public attacks = [{
    name: 'Dread End',
    cost: [D, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each of your [D] Pokémon in play.'
  }];

  public set: string = 'DAA';
  public name: string = 'Eternatus VMAX';
  public fullName: string = 'Eternatus VMAX DAA';
  public setNumber: string = '117';
  public regulationMark: string = 'D';
  public cardImage: string = 'assets/cardback.png';

  public readonly ETERNATUS_EXPANDED_BENCH = 'ETERNATUS_EXPANDED_BENCH';

  private isDarkInPlay(store: StoreLike, state: State, slot: PokemonCardList): boolean {
    const types = new CheckPokemonTypeEffect(slot);
    store.reduceEffect(state, types);
    return types.cardTypes.includes(CardType.DARK);
  }

  private eternalZoneApplies(store: StoreLike, state: State, player: Player): boolean {
    return StateUtils.isPokemonInPlay(player, this) && !IS_ABILITY_BLOCKED(store, state, player, this)
      && player.getPokemonInPlay().every(slot => this.isDarkInPlay(store, state, slot));
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach((player, index) => {
        if (this.eternalZoneApplies(store, state, player)) {
          if (!player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
            player.marker.addMarker(this.ETERNATUS_EXPANDED_BENCH, this);
          }
          effect.expandBench(index, 8);
        } else {
          player.marker.removeMarker(this.ETERNATUS_EXPANDED_BENCH, this);
        }
      });
    }

    if (effect instanceof CheckPokemonPlacementEffect) {
      const prohibited = effect.candidates.filter(card => !pokemonHasCardType(card, CardType.DARK));
      if (prohibited.length && this.eternalZoneApplies(store, state, effect.player)) {
        prohibited.forEach(card => effect.blocked.add(card));
      }
    }

    if (effect instanceof PlayPokemonEffect || effect instanceof PlayPokemonFromDeckEffect
      || effect instanceof PlayPokemonFromDiscardEffect || effect instanceof CheckEvolveEffect) {
      if (!pokemonHasCardType(effect.pokemonCard, CardType.DARK) && this.eternalZoneApplies(store, state, effect.player)) {
        if (effect instanceof CheckEvolveEffect) effect.preventDefault = true;
        else throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (effect instanceof UsePowerEffect && effect.power.useFromHandToBench
      && !pokemonHasCardType(effect.card, CardType.DARK) && this.eternalZoneApplies(store, state, effect.player)) {
      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = 30 * effect.player.getPokemonInPlay().filter(slot => this.isDarkInPlay(store, state, slot)).length;
    }

    return state;
  }
}