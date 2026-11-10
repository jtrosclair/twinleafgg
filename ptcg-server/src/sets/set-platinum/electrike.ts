import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';

export class Electrike extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp = 50;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat: CardType[] = [];
  public attacks = [
    { name: "Roar", cost: [CardType.COLORLESS], damage: 0, text: "Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon." },
    { name: "Thunder Fang", cost: [CardType.LIGHTNING, CardType.COLORLESS], damage: 20, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." }
  ];
  public set = 'PL';
  public setNumber = "74";
  public cardImage = 'assets/cardback.png';
  public name = "Electrike";
  public fullName = "Electrike PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Electrike.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) opponentSwitchAfterAttack(state,effect,effect.source.getPokemonCard()||this);
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    return state;
  }
}
