import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Geodude extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp = 60;
  public weakness = [{ type: CardType.WATER, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Knuckle Punch", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Focus Fist", cost: [CardType.FIGHTING, CardType.COLORLESS], damage: 30, text: "Flip a coin. If tails, this attack does nothing." }
  ];
  public set = 'SV';
  public setNumber = "105";
  public cardImage = 'assets/cardback.png';
  public name = "Geodude";
  public fullName = "Geodude SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Geodude.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (!heads) effect.damage = 0; });
    return state;
  }
}
