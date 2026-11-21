import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, SWITCH_ACTIVE_WITH_BENCHED, SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class CrossSwitcher extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.FUSION_STRIKE];
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '230';
  public set: string = 'FST';
  public name: string = 'Cross Switcher';
  public fullName: string = 'Cross Switcher FST';

  public text: string =
    `You must play 2 Cross Switcher cards at once. (This effect works one time for 2 cards.)

Switch 1 of your opponent's Benched Pokémon with their Active Pokémon. If you do, switch your Active Pokémon with 1 of your Benched Pokémon.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;

    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    const second = player.hand.cards.find(card => card !== this && card.name === this.name);
    if (!second || !opponent.bench.some(slot => !!slot.getPokemonCard())) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    MOVE_CARDS(store, state, player.hand, player.discard, { cards: [second], sourceCard: this });
    return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, {
      onSwitched: () => { SWITCH_ACTIVE_WITH_BENCHED(store, state, player); }
    });
  }
}
