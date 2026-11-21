import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, CardType, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { ATTACH_ENERGY_TRANSFERS } from '../../game/store/prefabs/prefabs';
import { AttachEnergyPrompt, EnergyCard, GameError } from '../../game';

export class GlassTrumpet extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'H';
  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '135';
  public name: string = 'Glass Trumpet';
  public fullName: string = 'Glass Trumpet SCR';

  public text: string =
    `You can use this card only if you have any Tera Pokémon in play.

Choose up to 2 of your Benched [C] Pokémon and attach a Basic Energy card from your discard pile to each of them.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const hasBasicEnergy = player.discard.cards.some(card =>
        card instanceof EnergyCard && card.energyType === EnergyType.BASIC);
      const hasTeraPokemon = player.getPokemonInPlay().some(slot =>
        slot.getPokemonCard()?.tags.includes(CardTag.POKEMON_TERA));
      if (!hasBasicEnergy || !hasTeraPokemon) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked: CardTarget[] = [];
      let hasColorlessBench = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, _card, target) => {
        if (target.slot !== SlotType.BENCH) return;
        const type = new CheckPokemonTypeEffect(slot);
        store.reduceEffect(state, type);
        if (type.cardTypes.includes(CardType.COLORLESS)) hasColorlessBench = true;
        else blocked.push(target);
      });
      if (!hasColorlessBench) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

      effect.preventDefault = true;
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 1, max: 2, blockedTo: blocked, differentTargets: true },
      ), transfers => {
        ATTACH_ENERGY_TRANSFERS(store, state, player, transfers, 'discard', {
          sourceCard: this,
          onAttached: () => player.supporter.moveCardTo(this, player.discard)
        });
      });
    }
    return state;
  }
}
