import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Gulpin2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp = 60;
  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Collect", cost: [CardType.COLORLESS], damage: 0, text: "Draw a card." },
    { name: "Drool", cost: [CardType.PSYCHIC, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'AR';
  public setNumber = "66";
  public cardImage = 'assets/cardback.png';
  public name = "Gulpin";
  public fullName = "Gulpin AR2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Gulpin2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-mysterious-treasures/dunsparce.ts (draw after the attack).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (_s, next) => { DRAW_CARDS(effect.player, 1); return next; });
    return state;
  }
}
