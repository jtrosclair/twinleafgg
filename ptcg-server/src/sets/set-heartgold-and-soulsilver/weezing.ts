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

export class Weezing extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Koffing';
  public hp: number = 90;
  public cardType: CardType = P;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Super Poison Breath',
    cost: [P],
    damage: 0,
    text: 'The Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Super Explosion',
    cost: [C, C],
    damage: 90,
    text: 'Weezing does 90 damage to itself, and don\'t apply Weakness to this damage.'
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Weezing';
  public fullName: string = 'Weezing HS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Weezing.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.POISONED);
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const source = effect.source, attacker = source.getPokemonCard();
      afterAttackDamage(state, effect, (s, next) => {
        if (!attacker || !next.players.some(p => p.active === source || p.bench.includes(source)) || source.getPokemonCard() !== attacker) return next;
        const self = new AttackEffect(effect.player, effect.opponent, effect.attack); self.source = source; self.ignoreWeakness = true;
        const damage = new DealDamageEffect(self, 90); damage.target = source; return s.reduceEffect(next, damage);
      });
    }
    return state;
  }
}
