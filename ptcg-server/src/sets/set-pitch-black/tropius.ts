import { CardList } from '../../game/store/state/card-list';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GameMessage } from '../../game/game-message';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

export class Tropius extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Fruity Scent',
    cost: [C],
    damage: 0,
    text: 'Look at the top 6 cards of your deck. You may reveal any number of Pokémon you find there and put them into your hand. Then, shuffle the remaining cards back into your deck.',
  },
  {
    name: 'Solarbeam',
    cost: [G, C],
    damage: 60,
    text: '',
  }];

  public set: string = "PBL";
  public setNumber: string = '1';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tropius';
  public fullName: string = 'Tropius M5';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-stellar-crown/lapras-ex.ts (a private preview with one shuffle of the remainder).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamage(state, effect, (store, afterState) => {
        const { player, opponent } = effect;
        if (player.deck.cards.length === 0) return afterState;
        const topCards = new CardList();
        player.deck.moveTo(topCards, Math.min(6, player.deck.cards.length));
        const looked = topCards.cards.slice();
        SHOW_CARDS_TO_PLAYER(store, afterState, player, looked, player);

        const count = looked.filter(card => card instanceof PokemonCard).length;
        return store.prompt(afterState, new ChooseCardsPrompt(
          player, GameMessage.CHOOSE_CARD_TO_HAND, topCards, { superType: SuperType.POKEMON },
          { min: 0, max: count, allowCancel: false },
        ), selected => {
          const taken = selected ?? [];
          SHOW_CARDS_TO_PLAYER(store, afterState, opponent, taken, player);
          MOVE_CARDS(store, afterState, topCards, player.hand, {
            cards: taken, sourceCard: effect.source.getPokemonCard(), sourceEffect: effect,
          });
          if (topCards.cards.length > 0) {
            topCards.moveTo(player.deck);
            SHUFFLE_DECK(store, afterState, player);
          }
        });
      });
    }
    return state;
  }
}
