import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { searchEvolutionToHand } from '../../game/store/prefabs/search-evolution-to-hand';

export class Feebas extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 30;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Splash", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Fast Evolution", cost: [CardType.WATER], damage: 0, text: "Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward." }
  ];
  public set = "GE";
  public setNumber = "67";
  public cardImage = 'assets/cardback.png';
  public name = "Feebas";
  public fullName = "Feebas GE";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Feebas.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/search-evolution-to-hand.ts (private search and reveal).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const attacker = effect.source.getPokemonCard();
      afterAttackDamage(state, effect, (s, next) => searchEvolutionToHand(s, next, effect, attacker));
    }
    return state;
  }
}
