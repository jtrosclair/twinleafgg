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

export class Butterfree extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Metapod';
  public hp: number = 120;
  public cardType: CardType = G;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Cure Powder',
    cost: [G],
    damage: 0,
    text: 'Remove 3 damage counters from each of your Pokémon.'
  },
  {
    name: 'Whirlwind',
    cost: [G, C, C],
    damage: 60,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Butterfree';
  public fullName: string = 'Butterfree HS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Butterfree.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => { [effect.player.active, ...effect.player.bench].forEach(slot => { if (!slot.getPokemonCard()) return; const heal = new HealTargetEffect(effect, 30); heal.target = slot; s.reduceEffect(next, heal); }); return next; });
    if (WAS_ATTACK_USED(effect, 1, this)) opponentSwitchAfterAttack(state, effect, effect.source.getPokemonCard() || this);
    return state;
  }
}
