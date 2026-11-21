import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, Card } from '../../game';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, DISCARD_SPECIFIC_ENERGY_FROM_THIS_POKEMON, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class LuxrayV extends PokemonCard {

  public cardType = L;

  public tags = [CardTag.POKEMON_V];

  public stage = Stage.BASIC;

  public hp = 210;

  public weakness = [{ type: F }];

  public resistance = [];

  public retreat = [C];

  public attacks = [
    {
      name: 'Fang Snipe',
      cost: [C, C],
      damage: 30,
      text: 'Your opponent reveals their hand. Discard a Trainer card you find there.'
    },
    {
      name: 'Radiating Pulse',
      cost: [L, L, C],
      damage: 120,
      text: 'Discard 2 Energy from this Pokémon. Your opponent\'s Active Pokémon is now Paralyzed.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Luxray V';

  public fullName: string = 'Luxray V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // "Your opponent reveals their hand." — show all cards in opponent's hand to the player
      if (opponent.hand.cards.length > 0) {
        SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
      }

      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamage(state, effect, (attackStore, attackState) => {
        DISCARD_SPECIFIC_ENERGY_FROM_THIS_POKEMON(attackStore, attackState, effect, [C, C]);
        return attackState;
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), effect);
    }

    return state;
  }
}
