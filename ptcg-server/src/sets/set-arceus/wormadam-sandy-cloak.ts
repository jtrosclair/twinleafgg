import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class WormadamSandyCloak extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Burmy Sandy Cloak";
  public cardType: CardType = CardType.FIGHTING;
  public hp = 90;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Hang Down", cost: [CardType.FIGHTING], damage: 30, text: "" },
    { name: "Cloak Headbutt", cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS], damage: 60, damageCalculation: "+", text: "If you have Wormadam Trash Cloak in play, this attack does 60 damage plus 30 more damage." }
  ];
  public set = 'AR';
  public setNumber = "50";
  public cardImage = 'assets/cardback.png';
  public name = "Wormadam Sandy Cloak";
  public fullName = "Wormadam Sandy Cloak AR";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return WormadamSandyCloak.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-mysterious-treasures/kricketune.ts (count current Pokémon in play).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const own = effect.player;
      if ([own.active, ...own.bench].some(slot => slot.getPokemonCard()?.name === 'Wormadam Trash Cloak')) effect.damage += 30;
    }
    return state;
  }
}
