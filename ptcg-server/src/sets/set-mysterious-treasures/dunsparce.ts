import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';

export class Dunsparce extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 60;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Snake Hook", cost: [], damage: 0, text: "Draw a card." },
    { name: "Bite and Run", cost: [], damage: 10, text: "Switch Dunsparce with 1 of your Benched Pokémon." }
  ];
  public set = "MT";
  public setNumber = "47";
  public cardImage = 'assets/cardback.png';
  public name = "Dunsparce";
  public fullName = "Dunsparce MT";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Dunsparce.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-secret-wonders/nidoran.ts (draw after damage).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (_s, next) => { DRAW_CARDS(effect.player, 1); return next; });
    // Ref: game/store/prefabs/self-switch-after-attack.ts (original attacker).
    if (WAS_ATTACK_USED(effect, 1, this)) selfSwitchAfterAttack(state, effect);
    return state;
  }
}
