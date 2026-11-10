import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, EnergyType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { coinRecoilAfterDamage } from '../round26-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Voltorb2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 60;

  public cardType: CardType = L;

  public weakness = [{ type: F, value: +10 }];

  public resistance = [{ type: M, value: -20 }];

  public retreat = [C];

  public attacks = [{
    // Outlet
    name: 'Outlet',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Lightning Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  }, {
    // Bouncing Ball
    name: 'Bouncing Ball',
    cost: [L],
    damage: 20,
    text: 'Flip a coin. If tails, Voltorb does 10 damage to itself.'
  }];

  public set: string = 'SF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '81';

  public name: string = 'Voltorb';

  public fullName: string = 'Voltorb SF2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Voltorb2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => { SEARCH_DECK_FOR_CARDS_TO_HAND(s, next, effect.player, effect.source.getPokemonCard() || this, { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' }, { min: 0, max: 1, allowCancel: false }, effect); return next; });
    // Ref: sets/round26-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) coinRecoilAfterDamage(state, effect, 10);
    return state;
  }
}
