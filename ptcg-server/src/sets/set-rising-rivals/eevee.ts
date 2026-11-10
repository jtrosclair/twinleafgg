import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Eevee extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 50;

  public cardType: CardType = C;

  public weakness = [{ type: F, value: +10 }];

  public retreat = [C];

  public attacks = [{
    name: 'Signs of Evolution',
    cost: [],
    damage: 0,
    text: 'Search your deck for up to 2 cards that evolve from Eevee, show them to your opponent, and put them into your hand. Shuffle your deck afterward.'
  }, {
    name: 'Bounce',
    cost: [C],
    damage: 10,
    text: 'Switch Eevee with 1 of your Benched Pokémon.'
  }];

  public set: string = 'RR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '59';

  public name: string = 'Eevee';

  public fullName: string = 'Eevee RR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Eevee.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => { SEARCH_DECK_FOR_CARDS_TO_HAND(s, next, effect.player, effect.source.getPokemonCard() || this, { superType: SuperType.POKEMON, evolvesFrom: 'Eevee' } as Partial<PokemonCard>, { min: 0, max: 2, allowCancel: false }, effect); return next; });
    // Ref: game/store/prefabs/self-switch-after-attack.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) selfSwitchAfterAttack(state, effect);
    return state;
  }
}
