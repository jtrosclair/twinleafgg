import { PlayerType, PokemonCard, PowerType, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Froslass extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snorunt';
  public cardType: CardType = W;
  public weakness = [{ type: M }];
  public hp: number = 90;
  public retreat = [C];

  public powers = [{
    name: 'Freezing Shroud',
    powerType: PowerType.ABILITY,
    text: 'During Pokémon Checkup, put 1 damage counter on each Pokémon in play that has any Abilities (excluding any Froslass).'
  }];

  public attacks = [{
    name: 'Frost Smash',
    cost: [W, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Froslass';
  public fullName: string = 'Froslass TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect && state.phase === GamePhase.BETWEEN_TURNS) {
      const player = effect.player;

      // Check if this Froslass is in play on effect.player's side
      let thisIsInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          thisIsInPlay = true;
        }
      });

      if (!thisIsInPlay) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name !== 'Froslass') {
          const powersEffect = new CheckPokemonPowersEffect(player, card);
          state = store.reduceEffect(state, powersEffect);
          if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
            state = store.reduceEffect(state, new PlaceDamageCountersEffect(player, cardList, 10, this));
          }
        }
      });

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name !== 'Froslass') {
          const powersEffect = new CheckPokemonPowersEffect(opponent, card);
          state = store.reduceEffect(state, powersEffect);
          if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
            state = store.reduceEffect(state, new PlaceDamageCountersEffect(player, cardList, 10, this));
          }
        }
      });
    }

    return state;
  }
}