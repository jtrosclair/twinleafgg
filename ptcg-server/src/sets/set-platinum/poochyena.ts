import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';

export class Poochyena extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp = 50;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Howl", cost: [], damage: 0, text: "Search your deck for Poochyena and put it onto your Bench. Shuffle your deck afterward." },
    { name: "Lunge", cost: [CardType.DARK], damage: 20, text: "Flip a coin. If tails, this attack does nothing." }
  ];
  public set = 'PL';
  public setNumber = "86";
  public cardImage = 'assets/cardback.png';
  public name = "Poochyena";
  public fullName = "Poochyena PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Poochyena.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state,effect,(s,next)=>searchBasicsToBench(s,next,effect,1,['Poochyena']));
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store,state,effect.player,heads=>{if(!heads)effect.damage=0;});
    return state;
  }
}
