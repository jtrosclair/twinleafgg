import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, ConfirmPrompt, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED_FROM_HAND, MOVE_CARDS, MOVE_POKEMON_OFF_BOARD, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Walrein extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Sealeo';
  public hp: number = 130;
  public cardType: CardType = W;
  public weakness = [{ type: M, value: +30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Freeze-up',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Walrein from your hand to evolve 1 of your Pokémon, you may flip 2 coins. If both are heads, discard 1 of the Defending Pokémon and all cards attached to it. (This doesn\'t count as a Knocked Out Pokémon.)'
  }];

  public attacks = [{
    name: 'Ice Bind',
    cost: [W, W, C],
    damage: 70,
    text: 'If your opponent doesn\'t discard a card from his or her hand, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Walrein';
  public fullName: string = 'Walrein MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Freeze-up
    if (JUST_EVOLVED_FROM_HAND(effect, state, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (!wantToUse) {
          return;
        }

        MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
          if (results.every(r => r)) {
            const opponent = StateUtils.getOpponent(state, effect.player);
            MOVE_POKEMON_OFF_BOARD(store, state, opponent.active, {
              pokemonDestination: opponent.discard,
              sourceCard: this,
            });
          }
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Ice Bind
    if (AFTER_ATTACK(effect, 0, this) && effect.originalDefender === effect.opponent.active) {
      const opponent = effect.opponent;
      const paralyze = () => ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, opponent, effect);
      if (opponent.hand.cards.length === 0) {
        paralyze();
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(opponent.id, GameMessage.WANT_TO_DISCARD_CARDS), confirmed => {
        if (!confirmed || opponent.hand.cards.length === 0) {
          paralyze();
          return;
        }
        store.prompt(state, new ChooseCardsPrompt(
          opponent, GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {},
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const card = selected?.[0];
          if (card) MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards: [card], sourceCard: this });
          if (!card || (!opponent.discard.cards.includes(card) && !opponent.lostzone.cards.includes(card))) {
            paralyze();
          }
        });
      });
    }

    return state;
  }
}
