import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsDiglett extends PokemonCard {
  public stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public hp = 60;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public retreat = [C];
  public attacks = [{ name: 'Relentless Burrowing', cost: [F], damage: 0,
    text: "Flip a coin until you get tails. For each heads, discard the top card of your opponent's deck." }];
  public regulationMark = 'I';
  public set = 'ASC';
  public cardImage = 'assets/cardback.png';
  public setNumber = '100';
  public name = "Team Rocket's Diglett";
  public fullName = "Team Rocket's Diglett ASC";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-perfect-order/snorlax.ts (coin sequence), set-surging-sparks/deino.ts (discard).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Capture the cloned attack while delegation is active; the coin
      // sequence resumes after the copycat's printed attacks are restored.
      const sourceEffect = effect.attack;
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, heads => {
        if (heads > 0) {
          MOVE_CARDS(store, state, effect.opponent.deck, effect.opponent.discard, {
            count: heads, sourceCard: this, sourceEffect
          });
        }
      });
    }
    return state;
  }
}
