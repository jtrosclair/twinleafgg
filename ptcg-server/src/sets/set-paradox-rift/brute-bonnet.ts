import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { GameError, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { GameMessage } from '../../game/game-message';
import { BoardEffect, CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class BruteBonnet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ANCIENT];
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Toxic Powder',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon has an Ancient Booster Energy Capsule attached, you may make both Active Pokémon Poisoned.'
  }];

  public attacks = [{
    name: 'Rampaging Hammer',
    cost: [D, D, C],
    damage: 120,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '123';
  public name: string = 'Brute Bonnet';
  public fullName: string = 'Brute Bonnet PAR';

  public readonly TOXIC_POWDER_MARKER = 'TOXIC_POWDER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.TOXIC_POWDER_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.TOXIC_POWDER_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.TOXIC_POWDER_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isBruteBonnetWithAncientBooster = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tools.length > 0 && cardList.tools[0].name === 'Ancient Booster Energy Capsule') {
          isBruteBonnetWithAncientBooster = true;
        }
      });

      if (!isBruteBonnetWithAncientBooster) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.TOXIC_POWDER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
        store, state, player, this.powers[0], this, player.active, [SpecialCondition.POISONED]
      );
      APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
        store, state, player, this.powers[0], this, opponent.active, [SpecialCondition.POISONED]
      );

      player.marker.addMarker(this.TOXIC_POWDER_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
    }

    return BruteBonnet.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Rampaging Hammer
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}