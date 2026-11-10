import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Meowth extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 50;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Pay Day", cost: [CardType.COLORLESS], damage: 10, text: "Flip a coin. If heads, draw a card." },
    { name: "Fury Swipes", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 10, damageCalculation: "x", text: "Flip 3 coins. This attack does 10 damage times the number of heads." }
  ];
  public set = "LA";
  public setNumber = "106";
  public cardImage = 'assets/cardback.png';
  public name = "Meowth";
  public fullName = "Meowth LA";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Meowth.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (s, next) => COIN_FLIP_PROMPT(s, next, effect.player, heads => { if (heads) DRAW_CARDS(effect.player, 1); }));
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
      const base = results.filter(Boolean).length * 10;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    });
    return state;
  }
}
