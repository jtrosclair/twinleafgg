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

export class Mankey extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = F;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Punch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Karate Chop',
    cost: [F, C],
    damage: 40,
    damageCalculation: '-' as '-',
    text: 'Does 40 damage minus 10 damage for each damage counter on Mankey.'
  }];

  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Mankey';
  public fullName: string = 'Mankey UL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Mankey.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) { const base = Math.max(0, 40 - effect.source.damage); effect.damage = base ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; }
    return state;
  }
}
