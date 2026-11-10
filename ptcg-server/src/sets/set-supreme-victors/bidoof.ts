import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Bidoof extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 60;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Whimsy Tackle", cost: [CardType.COLORLESS], damage: 20, text: "Flip a coin. If tails, this attack does nothing." }
  ];
  public set = 'SV';
  public setNumber = "91";
  public cardImage = 'assets/cardback.png';
  public name = "Bidoof";
  public fullName = "Bidoof SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Bidoof.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (!heads) effect.damage = 0; });
    return state;
  }
}
