import { CardTarget, ChooseCardsPrompt, PlayerType, SelectPrompt, GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CopiedSupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';

export class Serena extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '164';

  public regulationMark = 'F';

  public name: string = 'Serena';

  public fullName: string = 'Serena SIT';

  public text: string =
    'Choose 1:\n\n' +
    '• Discard up to 3 cards from your hand. (You must discard at least 1 card.) If you do, draw cards until you have 5 cards in your hand.\n' +
    '• Switch 1 of your opponent\'s Benched Pokémon V with their Active Pokémon.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const { player } = effect;
    if (player.supporterTurn > 0) {
      throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
    }

    const opponent = StateUtils.getOpponent(state, player);
    const canDiscard = player.hand.cards.some(card => card !== this);
    const canSwitch = opponent.bench.some(slot => slot.vPokemon());
    if (!canDiscard && !canSwitch) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    if (!(effect instanceof CopiedSupporterEffect)) player.hand.moveCardTo(this, player.supporter);
    const options: { message: GameMessage; action: () => void }[] = [];
    if (canDiscard) {
      options.push({
        message: GameMessage.DISCARD_AND_DRAW,
        action: () => {
          store.prompt(state, new ChooseCardsPrompt(
            player, GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {},
            { min: 1, max: 3, allowCancel: false }
          ), selected => {
            if (!selected?.length) return;
            const discard = new MoveCardsEffect(player.hand, player.discard, { cards: selected, sourceCard: this });
            store.reduceEffect(state, discard);
            if (selected.some(card => player.discard.cards.includes(card) || player.lostzone.cards.includes(card))) {
              player.deck.moveTo(player.hand, Math.max(0, 5 - player.hand.cards.length));
            }
          });
        },
      });
    }
    if (canSwitch) {
      options.push({
        message: GameMessage.SWITCH_POKEMON,
        action: () => {
          const blocked: CardTarget[] = [];
          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (slot, _card, target) => {
            if (!slot.vPokemon()) blocked.push(target);
          });
          SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { blocked, sourceEffect: effect });
        },
      });
    }

    return store.prompt(state, new SelectPrompt(
      player.id, GameMessage.CHOOSE_OPTION, options.map(option => option.message), { allowCancel: false }
    ), choice => options[choice].action());
  }
}
