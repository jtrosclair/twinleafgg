import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition, SuperType, EnergyType } from '../../game/store/card/card-types';
import { GameMessage, ShowCardsPrompt, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON, THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Sandslash extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sandshrew';
  public hp: number = 80;
  public cardType: CardType = F;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Poison Sting',
    cost: [F, C],
    damage: 30,
    text: 'The Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Fury Swipes',
    cost: [F, C, C],
    damage: 30,
    damageCalculation: 'x' as 'x',
    text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Sandslash';
  public fullName: string = 'Sandslash HS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Sandslash.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.POISONED);
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => { const base = 30 * results.filter(Boolean).length; effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; });
    return state;
  }
}
