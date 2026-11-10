import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Poliwag extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 40;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Tackle", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Twiddle", cost: [CardType.WATER], damage: 0, text: "Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, the Defending Pokémon is now Asleep." }
  ];
  public set = "LA";
  public setNumber = "114";
  public cardImage = 'assets/cardback.png';
  public name = "Poliwag";
  public fullName = "Poliwag LA";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Poliwag.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const target = effect.opponent.active, defender = target.getPokemonCard();
      afterAttackDamage(state, effect, (s, next) => COIN_FLIP_PROMPT(s, next, effect.player, heads => {
        if (!defender || effect.opponent.active !== target || target.getPokemonCard() !== defender) return;
        const add = new AddSpecialConditionsEffect(effect, [heads ? SpecialCondition.CONFUSED : SpecialCondition.ASLEEP]);
        add.target = target; s.reduceEffect(next, add);
      }));
    }
    return state;
  }
}
