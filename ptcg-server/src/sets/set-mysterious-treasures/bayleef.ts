import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { searchEvolutionToHand } from '../../game/store/prefabs/search-evolution-to-hand';

export class Bayleef extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Chikorita";
  public cardType: CardType = CardType.GRASS;
  public hp = 80;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Evolution Impulse", cost: [CardType.COLORLESS], damage: 0, text: "Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward." },
    { name: "Leaf Boomerang", cost: [CardType.GRASS, CardType.COLORLESS], damage: 30, damageCalculation: "x", text: "Flip 2 coins. This attack does 30 damage times the number of heads." }
  ];
  public set = "MT";
  public setNumber = "41";
  public cardImage = 'assets/cardback.png';
  public name = "Bayleef";
  public fullName = "Bayleef MT";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Bayleef.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/search-evolution-to-hand.ts (private search and reveal).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const attacker = effect.source.getPokemonCard();
      afterAttackDamage(state, effect, (s, next) => searchEvolutionToHand(s, next, effect, attacker));
    }
    // Ref: set-diamond-and-pearl/skorupi.ts (coin-dependent base damage).
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
      const base = results.filter(Boolean).length * 30;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    return state;
  }
}
