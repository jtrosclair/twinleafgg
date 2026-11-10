import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Steelix extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Onix";
  public cardType: CardType = CardType.METAL;
  public hp = 110;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Slam", cost: [CardType.METAL], damage: 30, damageCalculation: "x", text: "Flip 2 coins. This attack does 30 damage times the number of heads." },
    { name: "Metal Slash", cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS, CardType.COLORLESS], damage: 100, text: "Steelix can't attack during your next turn." }
  ];
  public set = "DP";
  public setNumber = "38";
  public cardImage = 'assets/cardback.png';
  public name = "Steelix";
  public fullName = "Steelix DP";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Steelix.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-diamond-and-pearl/skorupi.ts (coin-dependent base damage).
    if (WAS_ATTACK_USED(effect, 0, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
      const base = results.filter(Boolean).length * 30;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    // Ref: game/store/effect-reducers/game-phase-effect.ts (next-turn attack restriction).
    if (WAS_ATTACK_USED(effect, 1, this)) effect.source.cannotAttackNextTurnPending = true;
    return state;
  }
}
