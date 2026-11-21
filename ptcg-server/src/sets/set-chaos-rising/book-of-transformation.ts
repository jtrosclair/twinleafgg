import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardTarget, GameError, GameMessage, ChooseCardsPrompt, ChoosePokemonPrompt, PlayerType, SlotType, StoreLike, State } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { getBlockedPokemonPlacementIndices } from '../../game/store/prefabs/bench-play-reactions';
import { swapInPlayPokemon } from '../../game/store/prefabs/pokemon-replacement';

export class BookOfTransformation extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public usSetNumber = 'CRI 83';
  public name: string = 'Book of Transformation';
  public fullName: string = 'Book of Transformation M4';
  public text: string = 'You must play 2 Transformation Tome cards at once. Switch 1 of your Basic Pokemon in play with 1 of your Basic Pokemon in your discard pile. (Any attached cards, damage counters, and effects remain on the new Pokemon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      // Any print of this card counts (e.g. Transformation Tome CRI 83)
      const second = player.hand.cards.find(c => c instanceof BookOfTransformation && c !== effect.trainerCard);
      if (second === undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      const ineligible = player.discard.cards.flatMap((card, index) =>
        card instanceof PokemonCard && card.stage === Stage.BASIC ? [] : [index]);
      const blockedDiscard = getBlockedPokemonPlacementIndices(store, state, player, player.discard, ineligible);
      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_, card, target) => {
        if (card.stage !== Stage.BASIC) blocked.push(target);
      });
      if (blocked.length === player.getPokemonInPlay().length || blockedDiscard.length === player.discard.cards.length) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      effect.preventDefault = true;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), inPlaySelected => {
        const target = inPlaySelected?.[0];
        if (target?.getPokemonCard()?.stage !== Stage.BASIC
          || (target !== player.active && !player.bench.includes(target))) return state;
        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.discard,
          { superType: SuperType.POKEMON, stage: Stage.BASIC },
          { min: 1, max: 1, allowCancel: false, blocked: blockedDiscard }
        ), discardSelected => {
          const replacement = discardSelected?.[0];
          if (replacement instanceof PokemonCard
            && swapInPlayPokemon(store, state, player, target, player.discard, replacement, player.discard)) {
            player.hand.moveCardTo(second, player.discard);
          }
        });
      });
    }
    return state;
  }
}
