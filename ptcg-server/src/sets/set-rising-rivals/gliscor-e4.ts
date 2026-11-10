import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class GliscorE4 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_SP];

  public hp: number = 80;

  public cardType: CardType = F;

  public weakness = [{ type: W }];

  public resistance = [{ type: F, value: -20 }];

  public retreat = [C];

  public attacks = [{
    name: 'Irongrip',
    cost: [C],
    damage: 10,
    text: ''
  }, {
    name: 'Loaded Needle',
    cost: [F, C],
    damage: 10,
    damageCalculation: '+' as '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 30 more damage. If tails, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'RR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public name: string = 'Gliscor E4';

  public fullName: string = 'Gliscor E4 RR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return GliscorE4.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-great-encounters/ge-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 30; else conditionAfterDamage(state, effect, SpecialCondition.POISONED); });
    return state;
  }
}
