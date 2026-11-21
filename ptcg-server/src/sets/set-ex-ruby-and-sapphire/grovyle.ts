import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { attachedEnergyProvides, queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';

export class Grovyle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Treecko';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Natural Cure',
    useWhenInPlay: true,
    powerType: PowerType.POKEBODY,
    text: 'Whenever you attach a [G] Energy card from your hand to Grovyle, remove all Special Conditions from Grovyle.'
  }];

  public attacks = [{
    name: 'Slash',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'RS';
  public name: string = 'Grovyle';
  public fullName: string = 'Grovyle RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.target.getPokemonCard() === this) {
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        effect.target.clearAllSpecialConditions();
      }, () => attachedEnergyProvides(store, state, effect, CardType.GRASS));
    }

    return state;
  }

}
