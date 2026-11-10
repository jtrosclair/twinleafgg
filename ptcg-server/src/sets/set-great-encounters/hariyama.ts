import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Hariyama extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Makuhita";
  public cardType: CardType = F;
  public hp = 100;
  public weakness = [{ type: P, value: 30 }];
  public retreat = [C, C, C];
  public attacks = [{
    name: "Palm Strike", cost: [F, C], damage: 20, damageCalculation: "+",
    text: "Flip a coin. If heads, this attack does 20 damage plus 40 more damage."
  }, {
    name: "Spirited Throw", cost: [F, F, C], damage: 50,
    text: "If Hariyama has fewer remaining HP than the Defending Pokémon, this attack's base damage is 80."
  } ];
  public set = "GE";
  public setNumber = "41";
  public cardImage = 'assets/cardback.png';
  public name = "Hariyama";
  public fullName = "Hariyama GE";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-secret-wonders/lickitung.ts (coin-gated bonus).
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 40; });
    // Ref: set-paradox-rift/vanilluxe.ts (actual calculated HP and attacker slot).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const own = new CheckHpEffect(effect.player, effect.source), opposing = new CheckHpEffect(effect.opponent, effect.opponent.active);
      state = store.reduceEffect(state, own); state = store.reduceEffect(state, opposing);
      if (own.hp - effect.source.damage < opposing.hp - effect.opponent.active.damage) effect.damage += 30;
    }
    return state;
  }
}
