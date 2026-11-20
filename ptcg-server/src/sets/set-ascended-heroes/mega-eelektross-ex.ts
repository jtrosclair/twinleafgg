import { CardTag, CardType, GameMessage, PokemonCard, SlotType, SpecialCondition, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { DISCARD_AVAILABLE_ENERGY_FROM_ATTACKER } from '../../game/store/prefabs/costs';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';

export class MegaEelektrossex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Eelektrik';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = L;
  public hp: number = 350;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Split Bomb',
    cost: [L, L],
    damage: 0,
    text: 'This attack does 60 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Disaster Shock',
    cost: [L, L, L],
    damage: 190,
    text: 'You may discard 2 [L] Energy from this Pokémon and make your opponent\'s Active Pokemon Paralyzed.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Eelektross ex';
  public fullName: string = 'Mega Eelektross ex M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return this.reduceCopiedAttackEffect(store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const count = Math.min(2, effect.opponent.getPokemonInPlay().length);
      if (count > 0) {
        return THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(
          60, effect, store, state, count, count, false, [SlotType.ACTIVE, SlotType.BENCH]
        );
      }
    }

    // Ref: official Genome Hacking ruling (Disaster Shock works with no attached Lightning Energy).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamageForOriginalDefender(state, effect, (currentStore, currentState, target) =>
        CONFIRMATION_PROMPT(currentStore, currentState, effect.player, confirm => {
          if (confirm) {
            DISCARD_AVAILABLE_ENERGY_FROM_ATTACKER(currentStore, currentState, effect, CardType.LIGHTNING, 2, resolvedState => {
              const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
              condition.target = target;
              currentStore.reduceEffect(resolvedState, condition);
            });
          }
        }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK)
      );
    }

    return state;
  }
}
