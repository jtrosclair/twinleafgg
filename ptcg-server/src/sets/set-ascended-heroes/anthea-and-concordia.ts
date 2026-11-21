import { TrainerCard, TrainerType, StoreLike, State, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class AntheaAndConcordia extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '182';
  public name: string = 'Anthea & Concordia';
  public fullName: string = 'Anthea & Concordia M2a';
  public extraPrizes = false;

  public text: string = `You can use this card only if you have N's Darmanitan, N's Zoroark ex, N's Vanilluxe, N's Klinklang, N's Reshiram, and N's Zekrom in play.

During this turn, if your opponent's Active Pokémon is Knocked Out by damage from an attack used by your N's Pokémon, take 3 more Prize cards.`;

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-crown-zenith/sky-seal-stone.ts (turn-scoped player Prize effect).
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const names = new Set(effect.player.getPokemonInPlay().map(slot => slot.getPokemonCard()?.name));
      if (!requiredPokemon.every(name => names.has(name))) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      const bonus = effect.player.antheaAndConcordiaPrizeBonus;
      effect.player.antheaAndConcordiaPrizeBonus = {
        turn: state.turn, count: (bonus?.turn === state.turn ? bonus.count : 0) + 3
      };
    }
    return state;
  }
}

const requiredPokemon = [
  "N's Darmanitan", "N's Zoroark ex", "N's Vanilluxe", "N's Klinklang", "N's Reshiram", "N's Zekrom"
];
