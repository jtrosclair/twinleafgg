import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Gligar extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp = 60;
  public weakness = [{ type: CardType.WATER, value: 10 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Light Poison", cost: [], damage: 10, text: "Flip a coin. If tails, this attack does nothing. If heads, the Defending Pokémon is now Poisoned." },
    { name: "Jump On", cost: [CardType.FIGHTING], damage: 10, damageCalculation: "+", text: "Flip a coin. If heads, this attack does 10 damage plus 10 more damage." }
  ];
  public set = "LA";
  public setNumber = "94";
  public cardImage = 'assets/cardback.png';
  public name = "Gligar";
  public fullName = "Gligar LA";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Gligar.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
      if (heads) conditionAfterDamage(state, effect, SpecialCondition.POISONED); else effect.damage = 0;
    });
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 10; });
    return state;
  }
}
