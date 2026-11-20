import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { AfterEvolveEffect } from '../../game/store/effects/game-effects';
import { Attack, CardType, PokemonCard, Power, PowerType, SpecialCondition, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Raichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pikachu';
  public cardType: CardType = L;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public powers: Power[] = [
    {
      name: 'Evoshock',
      powerType: PowerType.ABILITY,
      text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, ' +
        'you may leave your opponent\'s Active Pokémon Paralyzed.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Volt Tackle',
      cost: [L, L, C],
      damage: 130,
      text: 'This Pokémon does 30 damage to itself.'
    },
  ];

  public set: string = 'BUS';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Raichu';
  public fullName: string = 'Raichu BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterEvolveEffect && effect.pokemonCard === this && effect.playedFromHand
      && state.players[state.activePlayer] === effect.player && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      return CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          const opponent = StateUtils.getOpponent(state, player);
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
            store, state, player, this.powers[0], this, opponent.active, [SpecialCondition.PARALYZED]
          );
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }
    return state;
  }
}
