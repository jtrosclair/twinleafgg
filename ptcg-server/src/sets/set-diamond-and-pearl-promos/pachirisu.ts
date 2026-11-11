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

// Upstream: ptcg-server/src/sets/04-diamond-pearl-platinum/set-diamond-and-pearl-promos/pachirisu.ts
export class Round29PachirisuDPP4 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.BASIC;
  public cardType = CardType.LIGHTNING;
  public hp = 70;
  public weakness = [{ type: CardType.FIGHTING, value: 20 }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: "Minor Errand-Running", cost: [CardType.COLORLESS], damage: 0, text: "Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward." },
    { name: "Thunder Jolt", cost: [CardType.LIGHTNING], damage: 20, text: "Flip a coin. If tails, Pachirisu does 10 damage to itself." }
  ];
  public set: string = "DPP";
  public setNumber = "4";
  public cardImage = 'assets/cardback.png';
  public name = "Pachirisu";
  public fullName = "Pachirisu DPP";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round29PachirisuDPP4.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => SEARCH_DECK_REVEAL_AND_MOVE(s, next, effect, this, { superType: SuperType.ENERGY, energyType: EnergyType.BASIC }, 1));
    if (WAS_ATTACK_USED(effect, 1, this)) coinRecoilAfterDamage(state, effect, 10);
    return state;
  }
}
