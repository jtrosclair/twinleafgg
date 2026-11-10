import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Hippopotas extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 70;

  public cardType: CardType = F;

  public weakness = [{ type: W, value: +10 }];

  public resistance = [{ type: L, value: -20 }];

  public retreat = [C, C];

  public attacks = [{
    name: 'Push Down',
    cost: [C],
    damage: 10,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  }, {
    name: 'Endeavor',
    cost: [F, C, C],
    damage: 30,
    damageCalculation: '+' as '+',
    text: 'Flip 2 coins. This attack does 30 damage plus 20 more damage for each heads.'
  }];

  public set: string = 'RR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '64';

  public name: string = 'Hippopotas';

  public fullName: string = 'Hippopotas RR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Hippopotas.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/opponent-switch-after-attack.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) opponentSwitchAfterAttack(state, effect, effect.source.getPokemonCard() || this);
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => { effect.damage += 20 * results.filter(Boolean).length; });
    return state;
  }
}
