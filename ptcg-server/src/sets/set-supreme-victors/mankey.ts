import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Mankey extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp = 50;
  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Extra Punch", cost: [CardType.FIGHTING], damage: 10, damageCalculation: "+", text: "If the Defending Pokémon is a Pokémon LV.X, this attack does 10 damage plus 50 more damage." }
  ];
  public set = 'SV';
  public setNumber = "112";
  public cardImage = 'assets/cardback.png';
  public name = "Mankey";
  public fullName = "Mankey SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Mankey.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this) && effect.opponent.active.getPokemonCard()?.stage === Stage.LV_X) effect.damage += 50;
    return state;
  }
}
