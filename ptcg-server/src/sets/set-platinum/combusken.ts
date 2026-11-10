import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Combusken extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Torchic";
  public cardType: CardType = CardType.FIRE;
  public hp = 80;
  public weakness = [{ type: CardType.WATER, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Firebreathing", cost: [CardType.FIRE, CardType.COLORLESS], damage: 20, damageCalculation: "+", text: "Flip a coin. If heads, this attack does 20 damage plus 20 more damage." },
    { name: "High Jump Kick", cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS], damage: 60, text: "" }
  ];
  public set = 'PL';
  public setNumber = "45";
  public cardImage = 'assets/cardback.png';
  public name = "Combusken";
  public fullName = "Combusken PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Combusken.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 20; });
    return state;
  }
}
