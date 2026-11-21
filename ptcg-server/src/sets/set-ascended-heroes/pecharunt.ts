import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { registerKnockOutDeckSearch } from '../../game/store/prefabs/knock-out-effects';
import { NEXT_TURN_ATTACK_BONUS } from '../../game/store/prefabs/prefabs';

export class Pecharunt extends PokemonCard {
  private readonly MOCHI_RUSH_BONUS_MARKER = 'PECHARUNT_MOCHI_RUSH_BONUS';
  private readonly MOCHI_RUSH_CLEAR_MARKER = 'PECHARUNT_MOCHI_RUSH_CLEAR';
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Final Chain',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for a card and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Mochi Rush',
    cost: [D],
    damage: 20,
    text: 'During your next turn, this Pokémon\'s Mochi Rush attack does 50 more damage (before applying Weakness and Resistance).'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '143';
  public name: string = 'Pecharunt';
  public fullName: string = 'Pecharunt ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-paradox-rift/cofagrigus-ex.ts (Knock Out from opposing attack damage).
    registerKnockOutDeckSearch(store, state, effect, this, 1);

    // Mochi Rush
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 50,
      bonusMarker: this.MOCHI_RUSH_BONUS_MARKER,
      clearMarker: this.MOCHI_RUSH_CLEAR_MARKER,
    });

    return state;
  }
}
