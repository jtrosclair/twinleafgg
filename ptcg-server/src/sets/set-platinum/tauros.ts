import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { targetDamageAfter, optionalSelfSwitchAfter, healTeamAfter, coinRecoilAfter } from './round24-attack-helpers';
import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';
import { SuperType, EnergyType } from '../../game/store/card/card-types';

export class Tauros extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 70;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Show Off", cost: [], damage: 0, text: "Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward." },
    { name: "Take Down", cost: [CardType.COLORLESS], damage: 20, text: "Flip a coin. If tails, Tauros does 10 damage to itself." }
  ];
  public set = 'PL';
  public setNumber = "98";
  public cardImage = 'assets/cardback.png';
  public name = "Tauros";
  public fullName = "Tauros PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Tauros.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state,effect,(s,next)=>SEARCH_DECK_REVEAL_AND_MOVE(s,next,effect,effect.source.getPokemonCard()||this,{superType:SuperType.ENERGY,energyType:EnergyType.BASIC},1));
    if (WAS_ATTACK_USED(effect, 1, this)) coinRecoilAfter(state,effect,10);
    return state;
  }
}
