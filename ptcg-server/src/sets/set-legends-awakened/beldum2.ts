import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Beldum2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp = 50;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Allure", cost: [CardType.COLORLESS], damage: 0, text: "Draw a card." },
    { name: "Tackle", cost: [CardType.METAL, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = "LA";
  public setNumber = "84";
  public cardImage = 'assets/cardback.png';
  public name = "Beldum";
  public fullName = "Beldum LA2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Beldum2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (_s, next) => { DRAW_CARDS(effect.player, 1); return next; });
    return state;
  }
}
