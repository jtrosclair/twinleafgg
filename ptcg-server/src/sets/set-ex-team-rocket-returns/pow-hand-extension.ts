import { CardTarget, GameError, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { CardTag } from '../../game/store/card/card-types';
import { MoveEnergyPrompt } from '../../game/store/prompts/move-energy-prompt';
import { SelectOptionPrompt } from '../../game/store/prompts/select-option-prompt';
import { MOVE_CARDS, SWITCH_IN_OPPONENT_BENCHED_POKEMON, TRAINER_TARGET_BLOCKED } from '../../game/store/prefabs/prefabs';

export class PowHandExtension extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.ROCKETS_SECRET_MACHINE];
  public set: string = 'TRR';
  public name: string = 'Pow! Hand Extension';
  public fullName: string = 'Pow! Hand Extension TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public text = `You may use this card only if you have more Prize cards left than your opponent.
Move 1 Energy card attached to the Defending Pokémon to another of your opponent's Pokémon. Or, switch 1 of your opponent's Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;
    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (player.getPrizeLeft() <= opponent.getPrizeLeft() || !opponent.bench.some(slot => !!slot.getPokemonCard())) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    const source = opponent.active;
    const hasEnergy = MoveEnergyPrompt.sourceCards(source).some(card => MoveEnergyPrompt.isAttachedEnergy(source, card));
    const switchOpponent = () => SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { sourceEffect: effect });
    if (!hasEnergy) return switchOpponent();

    return store.prompt(state, new SelectOptionPrompt(
      player.id, GameMessage.CHOOSE_OPTION,
      [GameMessage.MOVE_ENERGY_CARDS, GameMessage.CHOOSE_POKEMON_TO_SWITCH].map(message => 'GAME_MESSAGES.' + message),
      { allowCancel: false }
    ), choice => {
      if (choice === 1) {
        switchOpponent();
        return;
      }
      if (choice !== 0) return;

      const active: CardTarget = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
      const bench = opponent.bench.map((_, index) => ({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index }));
      store.prompt(state, new MoveEnergyPrompt(
        player.id, GameMessage.MOVE_ENERGY_CARDS, PlayerType.TOP_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], {},
        { min: 1, max: 1, allowCancel: false, validateTransfers: true, blockedFrom: bench, blockedTo: [active] }
      ), transfers => {
        const transfer = transfers?.[0];
        if (!transfer || source !== opponent.active || !MoveEnergyPrompt.isAttachedEnergy(source, transfer.card)) return;
        if (TRAINER_TARGET_BLOCKED(store, state, effect, source)) return;

        // Like Energy Antics, removal succeeds even if the recipient refuses the Energy.
        const target = StateUtils.getTarget(state, player, transfer.to);
        const destination = TRAINER_TARGET_BLOCKED(store, state, effect, target) ? opponent.discard : target;
        MOVE_CARDS(store, state, source, destination, { cards: [transfer.card], sourceCard: this });
      });
    });
  }
}
