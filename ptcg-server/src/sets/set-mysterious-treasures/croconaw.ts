import { PokemonCard, Stage, PowerType, CardList, EnergyCard, GameMessage, ShowCardsPrompt, State, StoreLike, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED_FROM_HAND, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Croconaw extends PokemonCard {

  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Totodile';
  public cardType = W;
  public hp = 80;
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Evolutionary Vitality',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Croconaw from your hand to evolve 1 of your Pokémon, you may look at the top 5 cards of your deck. Choose all Energy cards you find there, show them to your opponent, and put them into your hand. Put the other cards back on top of your deck. Shuffle your deck afterward.'
  }];

  public attacks = [{
    name: 'Hover Over',
    cost: [W, C],
    damage: 30,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Croconaw';
  public fullName: string = 'Croconaw MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED_FROM_HAND(effect, state, this)
      && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) return state;

      return CONFIRMATION_PROMPT(store, state, player, accepted => {
        if (!accepted) return;
        const viewed = new CardList();
        player.deck.moveTo(viewed, 5);
        const energy = viewed.cards.filter(card => card instanceof EnergyCard);
        const finish = () => {
          viewed.moveCardsTo(energy, player.hand);
          // Ref: set-vivid-voltage/trumbeak.ts (return the unselected part of a viewed deck subset).
          player.deck.cards.unshift(...viewed.cards);
          viewed.cards = [];
          SHUFFLE_DECK(store, state, player);
        };
        if (energy.length === 0) {
          finish();
        } else {
          const opponent = StateUtils.getOpponent(state, player);
          store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            energy, { sourcePlayerId: player.id }), finish);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }
}
