import { PokemonCard, Stage, CardType, PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { DISCARD_ATTACKER_ENERGY_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Turtonator extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Shell Spikes',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), discard an Energy from the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Heat Breath',
    cost: [R, R, C],
    damage: 80,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 80 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public usSetNumber = 'POR 17';
  public name: string = 'Turtonator';
  public fullName: string = 'Turtonator M3';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-obsidian-flames/klawf-ex.ts (Counterattacking Pincer).
    DISCARD_ATTACKER_ENERGY_FROM_ABILITY(store, state, effect, this);
    return Turtonator.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 80);
    }
    return state;
  }
}
