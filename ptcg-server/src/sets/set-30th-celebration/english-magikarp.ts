import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

// Printed English text: https://limitlesstcg.com/cards/30C/CC30 (PAL 42/203).
export class EnglishMagikarpCC30 extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 30;
  public cardType = CardType.WATER;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS];
  public regulationMark = 'G';
  public set = '30C';
  public setNumber = 'CC30';
  public usSetNumber = '30C CC30';
  public name = 'Magikarp';
  public fullName = 'Magikarp 30C CC30';
  public cardImage = 'assets/cardback.png';
  public attacks = [{
    name: 'Expert Splasher', cost: [CardType.WATER], damage: 10, damageCalculation: '+',
    text: 'Flip 2 coins. If both of them are heads, this attack does 20 more damage.'
  }];
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        if (results.length === 2 && results.every(Boolean)) { effect.damage += 20; }
      });
    }
    return state;
  }
}
