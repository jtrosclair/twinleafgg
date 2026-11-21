import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChooseCardsPrompt, GameMessage, ShowCardsPrompt, StateUtils, GameError, CardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Gothitelle extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Gothorita';
  public cardType: CardType = P;
  public hp: number = 150;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public powers = [{
    name: 'Read the Stars',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may look at the top 2 cards of your opponent\'s deck and put 1 of them back. Put the other card on the bottom of their deck.'
  }];

  public attacks = [
    {
      name: 'Psych Out',
      cost: [ P, C ],
      damage: 120,
      text: 'Discard a random card from your opponent\'s hand.'
    }
  ];

  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Gothitelle';
  public fullName: string = 'Gothitelle PAL';

  public readonly READ_THE_STARS_MARKER = 'READ_THE_STARS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.deck.cards.length === 0) throw new GameError(GameMessage.CANNOT_USE_POWER);
      if (HAS_MARKER(this.READ_THE_STARS_MARKER, player, this)) throw new GameError(GameMessage.POWER_ALREADY_USED);

      ABILITY_USED(player, this);
      ADD_MARKER(this.READ_THE_STARS_MARKER, player, this);
      if (opponent.deck.cards.length === 1) {
        // Ref: set-stellar-crown/lapras-ex.ts (a private preview of a short deck).
        return SHOW_CARDS_TO_PLAYER(store, state, player, opponent.deck.cards.slice(), opponent);
      }

      const deckTop = new CardList();
      opponent.deck.moveTo(deckTop, 2);
      return store.prompt(state, new ChooseCardsPrompt(
        player, GameMessage.CHOOSE_CARD_TO_PUT_ON_BOTTOM, deckTop, {},
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        deckTop.moveCardsTo(selected ?? [], opponent.deck);
        deckTop.moveToTopOfDestination(opponent.deck);
      });
    }

    // Ref: set-obsidian-flames/togepi.ts (choose a face-down card from the opponent's hand).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamage(state, effect, (store, afterState) => {
        const { player, opponent } = effect;
        if (opponent.hand.cards.length === 0) return afterState;
        return store.prompt(afterState, new ChooseCardsPrompt(
          player, GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {},
          { allowCancel: false, min: 1, max: 1, isSecret: true },
        ), selected => {
          if (!selected?.length) return;
          store.prompt(afterState, new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected,
            { sourcePlayerId: opponent.id }), () => {});
          MOVE_CARDS(store, afterState, opponent.hand, opponent.discard, {
            cards: selected, sourceCard: effect.source.getPokemonCard(), sourceEffect: effect,
          });
        });
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.READ_THE_STARS_MARKER, this);
    return state;
  }
}
