import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { targetDamageAfter, optionalSelfSwitchAfter, healTeamAfter, coinRecoilAfter } from './round24-attack-helpers';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Combee extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 60;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Collect", cost: [], damage: 0, text: "Draw a card." },
    { name: "Shoot Through", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "Does 10 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)" }
  ];
  public set = 'PL';
  public setNumber = "71";
  public cardImage = 'assets/cardback.png';
  public name = "Combee";
  public fullName = "Combee PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Combee.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (_s, next) => { DRAW_CARDS(effect.player, 1); return next; });
    if (WAS_ATTACK_USED(effect, 1, this)) targetDamageAfter(state,effect,10);
    return state;
  }
}
