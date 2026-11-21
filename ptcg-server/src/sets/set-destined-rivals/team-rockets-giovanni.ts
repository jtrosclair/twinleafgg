import { CardTarget, ChoosePokemonPrompt, PlayerType, SlotType, GameError, GameMessage, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { CardTag } from '../../game/store/card/card-types';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CopiedSupporterEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class TeamRocketsGiovanni extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public tags = [CardTag.TEAM_ROCKET];

  public regulationMark = 'I';

  public set: string = 'DRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '174';

  public name: string = 'Team Rocket\'s Giovanni';

  public fullName: string = 'Team Rocket\'s Giovanni DRI';

  public text: string =
    'Switch your Active Team Rocket\'s Pokemon with 1 of your Benched Team Rocket\'s Pokemon. If you do, then switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect && effect.player.rocketSupporter) {
      effect.player.rocketSupporter = false;
    }
    if (!WAS_TRAINER_USED(effect, this)) return state;

    const { player } = effect;
    if (player.supporterTurn > 0) throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
    const isRocket = (slot: typeof player.active) => slot.getPokemonCard()?.tags.includes(CardTag.TEAM_ROCKET) === true;
    if (!isRocket(player.active) || !player.bench.some(isRocket)) {
      if (effect instanceof CopiedSupporterEffect) return state;
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    const blocked: CardTarget[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, _card, target) => {
      if (target.slot === SlotType.BENCH && !isRocket(slot)) blocked.push(target);
    });

    if (!(effect instanceof CopiedSupporterEffect)) player.rocketSupporter = true;
    return store.prompt(state, new ChoosePokemonPrompt(
      player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.BOTTOM_PLAYER, [SlotType.BENCH],
      { allowCancel: false, blocked }
    ), selected => {
      const target = selected?.[0];
      if (!target) return;
      player.switchPokemon(target, store, state);
      if (player.active === target) SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { sourceEffect: effect });
    });
  }
}
