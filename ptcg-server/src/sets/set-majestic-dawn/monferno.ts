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

export class Monferno extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Chimchar';
  public hp: number = 70;
  public cardType: CardType = R;
  public weakness = [{ type: W, value: +20 }];
  public retreat = [];

  public attacks = [{
    name: 'Fire Fang',
    cost: [R],
    damage: 30,
    text: 'The Defending Pokémon is now Burned.'
  },
  {
    name: 'Mid-air Strike',
    cost: [C, C],
    damage: 30,
    damageCalculation: '+' as '+',
    text: 'Flip a coin. If heads, this attack does 30 damage plus 30 more damage.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Monferno';
  public fullName: string = 'Monferno MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Monferno.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.BURNED);
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 30; });
    return state;
  }
}
