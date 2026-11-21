import { CardType, Player, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, preserveLegacyAbilityDamageProtection } from '../../game/store/prefabs/effect-of-attack-prefabs';

const MONKEY_TRIO_NAMES = ['Simisage', 'Simisear', 'Simipour'];

function hasMonkeyTrioInPlay(player: Player): boolean {
  const found = new Set<string>();
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, pokemonCard) => {
    if (MONKEY_TRIO_NAMES.includes(pokemonCard.name)) {
      found.add(pokemonCard.name);
    }
  });
  return found.size === MONKEY_TRIO_NAMES.length;
}

export class Simisage extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pansage';
  public hp: number = 100;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public readonly ARM_THRUST_NEEDLE_MARKER = 'SIMISAGE_ARM_THRUST_NEEDLE_MARKER';
  public readonly CLEAR_ARM_THRUST_NEEDLE_MARKER = 'SIMISAGE_ARM_THRUST_NEEDLE_MARKER';

  public powers = [{
    name: 'Monkey Trio',
    powerType: PowerType.ABILITY,
    text: 'If you have Simisage, Simisear, and Simipour in play, ignore all [C] Energy in the costs of attacks used by this Pokémon.',
  }];

  public attacks = [{
    name: 'Arm Thrust Needle',
    cost: [G, C, C],
    damage: 100,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Pokémon that have an Ability, except any Simisage.',
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Simisage';
  public fullName: string = "Simisage PAR";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Monkey Trio
    if (effect instanceof CheckAttackCostEffect) {
      if (effect.player.active.getPokemonCard() !== this) {
        return state;
      }
      const player = effect.player;
      if (!StateUtils.isPokemonInPlay(player, this)) {
        return state;
      }
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      if (!hasMonkeyTrioInPlay(player)) {
        return state;
      }
      effect.cost = effect.cost.filter(c => c !== CardType.COLORLESS);
    }

    // Ref: set-chaos-rising/deoxys-3-batch16.ts (damage protection from Pokémon with an Ability).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return PREVENT_DAMAGE(store, state, effect, this, { sourceHasAbility: true, excludedSourceName: 'Simisage' });
    }

    preserveLegacyAbilityDamageProtection(store, state, effect, this, this.ARM_THRUST_NEEDLE_MARKER, 'Simisage');
    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(
      state, effect, this.CLEAR_ARM_THRUST_NEEDLE_MARKER, this.ARM_THRUST_NEEDLE_MARKER, this
    );

    return state;
  }
}
