import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Drifloon extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp = 40;
  public weakness = [{ type: CardType.DARK, value: 10 }];
  public resistance = [{ type: CardType.COLORLESS, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Reckless Charge", cost: [CardType.COLORLESS], damage: 20, text: "Drifloon does 10 damage to itself." },
    { name: "Collect", cost: [CardType.PSYCHIC], damage: 0, text: "Draw a card." }
  ];
  public set = 'SV';
  public setNumber = "103";
  public cardImage = 'assets/cardback.png';
  public name = "Drifloon";
  public fullName = "Drifloon SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Drifloon.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) recoilAfterAttack(state, effect, 10);
    if (WAS_ATTACK_USED(effect, 1, this)) afterAttackDamage(state, effect, (_s, next) => { DRAW_CARDS(effect.player, 1); return next; });
    return state;
  }
}
