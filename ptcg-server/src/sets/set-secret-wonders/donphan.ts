import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';

export class Donphan extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Phanpy";
  public cardType: CardType = CardType.FIGHTING;
  public hp = 100;
  public weakness = [{ type: CardType.WATER, value: 20 }];
  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Rapid Spin", cost: [CardType.FIGHTING, CardType.COLORLESS], damage: 40, text: "Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon, if any. You switch Donphan with 1 of your Benched Pokémon, if any." },
    { name: "Bash In", cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS], damage: 70, damageCalculation: "+", text: "If the Defending Pokémon has a Pokémon Tool card attached to it, this attack does 70 damage plus 60 more damage." }
  ];
  public set = "SW";
  public setNumber = "48";
  public cardImage = 'assets/cardback.png';
  public name = "Donphan";
  public fullName = "Donphan SW";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Donphan.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Refs: set-diamond-and-pearl/heracross.ts (opponent chooses), self-switch-after-attack.ts (original attacker).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      opponentSwitchAfterAttack(state, effect, effect.source.getPokemonCard() || this);
      selfSwitchAfterAttack(state, effect);
    }
    // Ref: set-great-encounters/cacturne.ts (additive pre-damage bonus).
    if (WAS_ATTACK_USED(effect, 1, this) && effect.opponent.active.tools.length > 0) effect.damage += 60;
    return state;
  }
}
