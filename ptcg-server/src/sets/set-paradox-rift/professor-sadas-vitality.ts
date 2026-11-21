import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt, EnergyCard, GameError } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ATTACH_ENERGY_TRANSFERS, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class ProfessorSadasVitality extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public tags = [CardTag.ANCIENT];

  public regulationMark = 'G';

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '170';

  public name: string = 'Professor Sada\'s Vitality';

  public fullName: string = 'Professor Sada\'s Vitality PAR';

  public text: string =
    'Choose up to 2 of your Ancient Pokémon and attach a Basic Energy card from your discard pile to each of them. If you attached any Energy in this way, draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.ancientSupporter = false;
    }

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const hasBasicEnergy = player.discard.cards.some(card =>
        card instanceof EnergyCard && card.energyType === EnergyType.BASIC);
      const hasAncientPokemon = player.getPokemonInPlay().some(slot =>
        slot.getPokemonCard()?.tags.includes(CardTag.ANCIENT));
      if (!hasBasicEnergy || !hasAncientPokemon) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_slot, card, target) => {
        if (!card.tags.includes(CardTag.ANCIENT)) blocked.push(target);
      });

      player.hand.moveCardTo(this, player.supporter);
      effect.preventDefault = true;
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 1, max: 2, blockedTo: blocked, differentTargets: true },
      ), transfers => {
        player.ancientSupporter = true;
        ATTACH_ENERGY_TRANSFERS(store, state, player, transfers, 'discard', {
          sourceCard: this,
          onAttached: attached => {
            if (attached.length > 0) {
              MOVE_CARDS(store, state, player.deck, player.hand, { count: 3, sourceCard: this });
            }
          }
        });
      });
    }
    return state;
  }
}