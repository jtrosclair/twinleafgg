import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, DRAW_CARDS, DISCARD_TOP_X_OF_OPPONENTS_DECK } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';

export class Hippopotas extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = F;
  public weakness = [{ type: W, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Grainy Sand',
    cost: [F],
    damage: 10,
    damageCalculation: '+' as '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage.'
  },
  {
    name: 'Double-edge',
    cost: [C, C, C],
    damage: 40,
    text: 'Hippopotas does 10 damage to itself.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Hippopotas';
  public fullName: string = 'Hippopotas MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Hippopotas.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 10; });
    if (WAS_ATTACK_USED(effect, 1, this)) recoilAfterAttack(state, effect, 10);
    return state;
  }
}
