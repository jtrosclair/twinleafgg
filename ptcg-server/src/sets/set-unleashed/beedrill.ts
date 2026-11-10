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

export class Beedrill extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Kakuna';
  public hp: number = 110;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [{
    name: 'Twineedle',
    cost: [G],
    damage: 50,
    damageCalculation: 'x' as 'x',
    text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
  },
  {
    name: 'Paralyze Poison',
    cost: [G, C],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned. Flip a coin. If heads, the Defending Pokémon is also Paralyzed.'
  }];

  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Beedrill';
  public fullName: string = 'Beedrill UL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Beedrill.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => { const base = 50 * results.filter(Boolean).length; effect.damage = base ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; });
    if (WAS_ATTACK_USED(effect, 1, this)) { conditionAfterDamage(state, effect, SpecialCondition.POISONED); coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED); }
    return state;
  }
}
