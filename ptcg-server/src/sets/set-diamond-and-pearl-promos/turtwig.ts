import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition, SuperType, EnergyType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { targetedDamageAfterAttack } from '../set-upstream-round28/targeted-damage';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';
import { coinRecoilAfterDamage } from '../round26-attack-effects';

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-diamond-and-pearl-promos/turtwig.ts
export class Round29TurtwigDPP1 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.GRASS;
  public hp = 60;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Tackle", cost: [], damage: 10, text: "" },
    { name: "Razor Leaf", cost: [CardType.GRASS], damage: 20, text: "" }
  ];
  public set: string = "DPP";
  public setNumber = "1";
  public cardImage = 'assets/cardback.png';
  public name = "Turtwig";
  public fullName = "Turtwig DPP";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round29TurtwigDPP1.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    
    return state;
  }
}
