import { flipLegacyCoinsUntilTails } from '../../game/store/prefabs/attack-coin-reflip';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { Card, GameMessage, ShowCardsPrompt, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Houndstone extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Greavard';
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Horror Bite',
    cost: [P],
    damage: 30,
    text: 'Flip a coin until you get tails. For each heads, choose a random card from your opponent\'s hand. Your opponent reveals those cards and shuffles them into their deck.'
  },
  {
    name: 'Hammer In',
    cost: [P, P, C],
    damage: 130,
    text: ''
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Houndstone';
  public fullName: string = 'Houndstone M1S';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-mega-evolution/mega-kangaskhan-ex.ts (keep the entire series before applying results).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const { player, opponent } = effect;
      return flipLegacyCoinsUntilTails(store, state, player, heads => {
        if (heads === 0) return;
        afterAttackDamage(state, effect, (store, state) => {
          const pool = opponent.hand.cards.slice();
          const count = Math.min(heads, pool.length);
          if (count === 0) return state;

          const revealed: Card[] = [];
          for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * pool.length);
            revealed.push(pool.splice(index, 1)[0]);
          }
          return store.prompt(state, new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            revealed, { sourcePlayerId: opponent.id }), () => {
            MOVE_CARDS(store, state, opponent.hand, opponent.deck, { cards: revealed, sourceCard: this, sourceEffect: effect.attack });
            SHUFFLE_DECK(store, state, opponent);
          });
        });
      });
    }

    return state;
  }
}
