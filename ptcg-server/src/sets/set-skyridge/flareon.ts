import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { ADD_BURN_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { attachedEnergyProvides, queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export class Flareon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Self-healing',
    useWhenInPlay: false,
    powerType: PowerType.POKEBODY,
    text: 'Whenever you attach a [R] Energy card from your hand to Flareon, remove all Special Conditions affecting Flareon.'
  }];

  public attacks = [{
    name: 'Singe',
    cost: [R],
    damage: 0,
    text: 'The Defending Pokémon is now Burned.'
  },
  {
    name: 'Burn Booster',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Discard an Energy card attached to Flareon in order to use this attack. If the discarded card is a [R] Energy card, this attack does 40 damage plus 10 more damage.'
  }];

  public set: string = 'SK';
  public name: string = 'Flareon';
  public fullName: string = 'Flareon SK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.target.getPokemonCard() === this) {
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        effect.target.clearAllSpecialConditions();
      }, () => attachedEnergyProvides(store, state, effect, CardType.FIRE));
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
    }

    // Make this acutally do the right thing later
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIRE);
      effect.damage += 10;
    }

    return state;
  }

}
