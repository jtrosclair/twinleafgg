import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, StateUtils, GameError } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { ABILITY_USED, IS_ABILITY_BLOCKED, MOVE_CARDS, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Volcanionex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 220;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Scorching Steam',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokemon is in your Active Spot, you may make your opponent\'s Active Pokémon Burned.'
  }];

  public attacks = [
    {
      name: 'Heat Cyclone',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 160,
      text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Volcanion ex';
  public fullName: string = 'Volcanion ex JTG';

  public readonly SCORCHING_STEAM = 'SCORCHING_STEAM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.SCORCHING_STEAM, this);
    }

    // Scorching Steam
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.active.getPokemonCard() !== this || IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.SCORCHING_STEAM, this);
      ABILITY_USED(player, this);
      return APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
        store, state, player, this.powers[0], this, opponent.active, [SpecialCondition.BURNED]);
    }

    // Ref: set-destined-rivals/yanmega-ex.ts (move attached Energy to the attacker's Bench).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const source = effect.source;
      afterAttackDamage(state, effect, (store, state) => {
        if (!source.cards.some(card => card.superType === SuperType.ENERGY)
          || !player.bench.some(slot => slot.getPokemonCard())) return state;

        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          source,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: 1, max: 1 }
        ), transfers => {
          for (const transfer of transfers ?? []) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, source, target, { cards: [transfer.card], sourceCard: this, sourceEffect: effect });
          }
        });
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SCORCHING_STEAM, this);
    }

    return state;
  }

}
