import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, EnergyType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_DECK_FOR_CARDS_TO_HAND, GET_PLAYER_PRIZES } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Misdreavus extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 60;

  public cardType: CardType = P;

  public weakness = [{ type: D, value: +10 }];

  public resistance = [{ type: C, value: -20 }];

  public retreat = [C];

  public attacks = [{
    name: 'Show Off',
    cost: [],
    damage: 0,
    text: 'Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Payback',
    cost: [P],
    damage: 10,
    damageCalculation: '+' as '+',
    text: 'If your opponent has only 1 Prize card left, this attack does 10 damage plus 20 more damage.'
  }];

  public set: string = 'LA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '107';

  public name: string = 'Misdreavus';

  public fullName: string = 'Misdreavus LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Misdreavus.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => { SEARCH_DECK_FOR_CARDS_TO_HAND(s, next, effect.player, effect.source.getPokemonCard() || this, { superType: SuperType.ENERGY, energyType: EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false }, effect); return next; });
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 1, this) && GET_PLAYER_PRIZES(effect.opponent).length === 1) effect.damage += 20;
    return state;
  }
}
