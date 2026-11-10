import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS, GET_PLAYER_PRIZES, IS_ABILITY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Stakataka extends PokemonCard {
  public tags = [CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];
  public powers = [{ name: 'Wall of Stone', powerType: PowerType.ABILITY,
    text: 'If your opponent has 3 or fewer Prize cards remaining, this Pokémon\'s maximum HP is 200.' }];
  public attacks = [{ name: 'Top Down', cost: [F, F, C], damage: 110,
    text: 'Flip a coin until you get tails. For each heads, discard the top card of your opponent\'s deck.' }];
  public set = 'UNB';
  public setNumber = '106';
  public cardImage = 'assets/cardback.png';
  public name = 'Stakataka';
  public fullName = 'Stakataka UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckHpEffect && effect.target.getPokemonCard() === this) {
      // Some HP checks pass the attacking player. Resolve the target's owner.
      const owner = StateUtils.findOwner(state, effect.target);
      if (GET_PLAYER_PRIZES(StateUtils.getOpponent(state, owner)).length <= 3 &&
          !IS_ABILITY_BLOCKED(store, state, owner, this)) {
        effect.hp += 80;
      }
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, heads => {
        if (heads > 0) {
          // Use the shared move reducer so discarded Prism Star cards go to
          // the Lost Zone. Its count uses the same top as game-phase drawing.
          MOVE_CARDS(store, state, opponent.deck, opponent.discard,
            { count: heads, sourceCard: this, sourceEffect: effect });
        }
      });
    }
    return state;
  }
}
