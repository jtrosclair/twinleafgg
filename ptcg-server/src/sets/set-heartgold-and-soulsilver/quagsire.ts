import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition, SuperType, EnergyType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, ShowCardsPrompt, SlotType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect, HealTargetEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON, THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Quagsire extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wooper';
  public hp: number = 100;
  public cardType: CardType = W;
  public weakness = [{ type: G }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Muddy Water',
    cost: [W, C, C],
    damage: 40,
    text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Mud Shot',
    cost: [F, C, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Quagsire';
  public fullName: string = 'Quagsire HS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Quagsire.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => {
      const opponent = effect.opponent;
      if (!opponent.bench.some(slot => slot.getPokemonCard())) return next;
      return s.prompt(next, new ChoosePokemonPrompt(effect.player.id, GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER, [SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
        const target = selected && selected[0];
        if (!target || !opponent.bench.includes(target) || !target.getPokemonCard()) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        const damage = new PutDamageEffect(effect, 20); damage.target = target; return s.reduceEffect(next, damage);
      });
    });
    return state;
  }
}
