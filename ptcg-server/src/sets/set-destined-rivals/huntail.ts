import { PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, MOVE_CARDS, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { getAttachedBasicEnergy } from '../../game/store/prefabs/knock-out-effects';

export class Huntail extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Clamperl';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [
    {
      name: 'Diver Catch',
      powerType: PowerType.ABILITY,
      text: 'You may use this Ability whenever 1 of your [W] Pokémon is Knocked Out by damage from an opponent\'s Pokémon\'s attack. Return all Basic [W] Energy attached to the Knocked Out Pokémon to your hand instead of discarding them.'
    }
  ];

  public attacks = [{
    name: 'Wave Splash',
    cost: [W, C, C],
    damage: 80,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Huntail';
  public fullName: string = 'Huntail DRI';

  public readonly DIVER_CATCH_MARKER = 'DIVER_CATCH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard) {
      const { player, target } = effect;
      const inPlay = effect.pokemonInPlayBeforeKnockOut?.includes(this)
        ?? [player.active, ...player.bench].some(slot => slot.getPokemonCard() === this);
      if (!inPlay || IS_ABILITY_BLOCKED(store, state, player, this)) return state;

      const type = new CheckPokemonTypeEffect(target);
      store.reduceEffect(state, type);
      if (!type.cardTypes.includes(CardType.WATER)) return state;

      const getWater = () => getAttachedBasicEnergy(target).filter(card => card.provides.includes(CardType.WATER));
      effect.beforeDiscard.set(this, {
        label: this.powers[0].name,
        canResolve: () => getWater().length > 0,
        resolve: () => CONFIRMATION_PROMPT(store, state, player, confirmed => {
          if (confirmed) MOVE_CARDS(store, state, target, player.hand, { cards: getWater(), sourceCard: this, sourceEffect: effect });
        })
      });
    }

    if (effect instanceof BetweenTurnsEffect && effect.player.marker.hasMarker(this.DIVER_CATCH_MARKER)) {
      // Older snapshots can still contain a pending Diver's Catch.
      const player = effect.player;
      const cards = player.marker.markers
        .filter(marker => marker.name === this.DIVER_CATCH_MARKER && marker.source !== undefined)
        .map(marker => marker.source!);
      player.marker.removeMarker(this.DIVER_CATCH_MARKER);
      if (cards.some(card => player.discard.cards.includes(card))) {
        CONFIRMATION_PROMPT(store, state, player, confirmed => {
          if (confirmed) MOVE_CARDS(store, state, player.discard, player.hand, { cards });
        });
      }
    }

    return state;
  }
}
