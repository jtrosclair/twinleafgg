import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import {
  StoreLike, State, GameMessage, PowerType, ChooseCardsPrompt, GameLog, PlayerType, StateUtils,
  GameError
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { Card, TrainerCard } from '../../game';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';

export class Magneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magnemite';
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Call Signal',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    knocksOutSelf: true,
    text: 'Once during your turn (before your attack), you may search your deck for up to 3 Supporter cards, reveal them, and put them into your hand. Then, shuffle your deck. If you searched your deck in this way, this Pokémon is Knocked Out.'
  }];

  public attacks = [{
    name: 'Magnetic Blast',
    cost: [L, L, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magneton';
  public fullName: string = 'Magneton CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ABILITY_USED(player, this);

      const source = player.deck;
      const isSupporter = (card: Card) => card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER;
      const finishSearch = () => store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) cardList.damage += 999;
        });
      });
      return store.prompt(state, new ChooseCardsPrompt(
        player, GameMessage.CHOOSE_CARD_TO_HAND, source,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 3, allowCancel: false }
      ), selected => {
        if (!Array.isArray(selected)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        const cards = selected;
        if (cards.length > 3 || new Set(cards).size !== cards.length ||
          cards.some(card => !card || !source.cards.includes(card) || !isSupporter(card))) {
          throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        if (cards.length === 0) { finishSearch(); return; }
        store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => {
          MOVE_CARDS(store, state, source, player.hand, { cards, sourceCard: this, sourceEffect: this.powers[0] });
          cards.filter(card => player.hand.cards.includes(card)).forEach(card => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });
          finishSearch();
        });
      });

    }
    return state;
  }
}