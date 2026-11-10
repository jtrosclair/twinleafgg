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


export class Miltank extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Moomoo Squeeze',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Moomoo Milk card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Body Slam',
    cost: [C, C, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Miltank';
  public fullName: string = 'Miltank HS';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Miltank.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => SEARCH_DECK_REVEAL_AND_MOVE(s, next, effect, this, { name: 'Moomoo Milk' }, 1));
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    return state;
  }
}
