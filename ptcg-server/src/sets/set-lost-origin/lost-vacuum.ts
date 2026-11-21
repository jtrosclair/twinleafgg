import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Card, CardList, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SelectOptionPrompt, SlotType, StateUtils } from '../../game';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';


export class LostVacuum extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '162';

  public regulationMark = 'F';

  public name: string = 'Lost Vacuum';

  public fullName: string = 'Lost Vacuum LOR';

  public text: string = `You can use this card only if you put another card from your hand in the Lost Zone.

Choose a Pokémon Tool attached to any Pokémon, or any Stadium in play, and put it in the Lost Zone.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);
    const stadium = StateUtils.getStadiumCard(state);
    const blocked: CardTarget[] = [];
    let hasTool = false;
    for (const owner of [player, opponent]) {
      owner.forEachPokemon(owner === player ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER, (slot, _card, target) => {
        if (slot.tools.length) hasTool = true;
        else blocked.push(target);
      });
    }
    if ((!hasTool && !stadium) || !player.hand.cards.some(card => card !== this)) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    const finish = () => player.supporter.moveCardTo(this, player.discard);
    const removeStadium = () => {
      const current = StateUtils.getStadiumCard(state);
      if (!current) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      const source = StateUtils.findCardList(state, current);
      const owner = StateUtils.findOwner(state, source);
      MOVE_CARDS(store, state, source, owner.lostzone, { sourceCard: this });
      finish();
    };
    const chooseTool = () => store.prompt(state, new ChoosePokemonPrompt(
      player.id, GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      PlayerType.ANY, [SlotType.ACTIVE, SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked },
    ), selected => {
      const target = selected?.[0];
      if (!target?.tools.length) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      const owner = StateUtils.findOwner(state, target);
      const removeTool = (tool: Card) => {
        if (!target.tools.includes(tool)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        target.moveCardTo(tool, owner.lostzone);
        finish();
      };
      if (target.tools.length === 1) {
        removeTool(target.tools[0]);
        return;
      }
      const tools = new CardList();
      tools.cards = [...target.tools];
      store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_DISCARD, tools,
        {}, { min: 1, max: 1, allowCancel: false }), selectedTools => removeTool(selectedTools?.[0]));
    });

    effect.preventDefault = true;
    player.hand.moveCardTo(this, player.supporter);
    return store.prompt(state, new ChooseCardsPrompt(
      player, GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 1, max: 1, allowCancel: false },
    ), selected => {
      const payment = selected?.[0];
      if (!payment || !player.hand.cards.includes(payment)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      player.hand.moveCardTo(payment, player.lostzone);
      if (hasTool && stadium) {
        store.prompt(state, new SelectOptionPrompt(player.id, GameMessage.DISCARD_STADIUM_OR_TOOL,
          [GameMessage.CHOICE_TOOL, GameMessage.CHOICE_STADIUM], { allowCancel: false }), choice => {
          if (choice === 0) chooseTool();
          else removeStadium();
        });
      } else if (hasTool) chooseTool();
      else removeStadium();
    });
  }
}
