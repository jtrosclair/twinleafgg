import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Weepinbell extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Bellsprout";
  public cardType: CardType = CardType.GRASS;
  public hp = 80;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Poisonpowder", cost: [CardType.GRASS], damage: 10, text: "The Defending Pokémon is now Poisoned." },
    { name: "Razor Leaf", cost: [CardType.GRASS, CardType.GRASS], damage: 40, text: "" }
  ];
  public set = "LA";
  public setNumber = "127";
  public cardImage = 'assets/cardback.png';
  public name = "Weepinbell";
  public fullName = "Weepinbell LA";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Weepinbell.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.POISONED);
    return state;
  }
}
