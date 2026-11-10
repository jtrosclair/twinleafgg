import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bronzor extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp = 50;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Speed Dive", cost: [CardType.METAL], damage: 10, text: "" },
    { name: "Extrasensory", cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 30, damageCalculation: "+", text: "If you have the same number of cards in your hand as your opponent, this attack does 30 damage plus 30 more damage." }
  ];
  public set = 'AR';
  public setNumber = "34";
  public cardImage = 'assets/cardback.png';
  public name = "Bronzor";
  public fullName = "Bronzor AR";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Bronzor.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-secret-wonders/girafarig.ts (condition checked before damage).
    if (WAS_ATTACK_USED(effect, 1, this) && effect.player.hand.cards.length === effect.opponent.hand.cards.length) effect.damage += 30;
    return state;
  }
}
