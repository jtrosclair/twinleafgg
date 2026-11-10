import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';


export class Rhydon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = "Rhyhorn";
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 140;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Destructive Horn',
    cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pok\u00e9mon.'
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rhydon';
  public fullName: string = 'Rhydon SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Destructive Horn
    // Ref: set-furious-fists/tyrunt.ts (Crunch)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    return state;
  }
}
